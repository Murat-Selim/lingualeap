
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import { startChatSession, sendMessageStream, generateSampleDialogue } from '../services/geminiService';
import { LogoIcon, BackIcon, SpeakerIcon, SendIcon } from '../constants';

const parseMessageText = (rawText: string): { text: string; translation?: string } => {
    const match = rawText.match(/^(.*?)\n\((.*?)\)$/s);
    if (match && match[1] && match[2]) {
        return { text: match[1].trim(), translation: match[2].trim() };
    }
    return { text: rawText.trim(), translation: undefined };
};

const ChatBubble: React.FC<{ message: ChatMessage; onSpeak: (text: string) => void; }> = ({ message, onSpeak }) => {
    const isUser = message.sender === 'user';

    const bubbleClasses = isUser
        ? 'bg-green-600 text-white rounded-br-none'
        : 'bg-blue-500 text-white rounded-bl-none';
    const bubbleAlign = isUser ? 'justify-end' : 'justify-start';
    
    const separatorColor = 'border-white/30';
    const labelColor = 'text-white/80';
    const iconColor = 'text-white/80 hover:text-white';

    return (
        <div className={`flex items-start ${bubbleAlign}`}>
            <div className={`relative max-w-sm md:max-w-md lg:max-w-xl p-4 rounded-2xl ${bubbleClasses}`}>
                {/* English Part */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className={`text-sm font-semibold mb-1 ${labelColor}`}>English:</p>
                        <p className="text-base">{message.text}</p>
                    </div>
                    <button
                        onClick={() => onSpeak(message.text)}
                        className={`flex-shrink-0 transition-colors p-1 ${iconColor}`}
                        aria-label="Read English aloud"
                    >
                        <SpeakerIcon />
                    </button>
                </div>

                {/* Separator and Azerbaijani Part */}
                {message.translation && (
                    <>
                        <hr className={`my-3 ${separatorColor}`} />
                        <div>
                            <p className={`text-sm font-semibold mb-1 ${labelColor}`}>Azerbaijani:</p>
                            <p className="text-base">{message.translation}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


interface ChatViewProps {
    topic: string;
    difficulty: string;
    onEndConversation: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ topic, difficulty, onEndConversation }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const updateVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        // Voices may load asynchronously.
        window.speechSynthesis.onvoiceschanged = updateVoices;
        // Also call it directly in case they are already loaded.
        updateVoices();
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const handleSpeak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) {
            alert("Sorry, your browser doesn't support text-to-speech.");
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.lang = 'en-US';
        utterance.pitch = 1; // Natural pitch
        utterance.rate = 1;  // Natural rate
        utterance.volume = 1;

        // Prioritize known high-quality voices for a more natural sound
        const preferredVoiceNames = [
            'Samantha',          // Apple
            'Google US English', // Chrome
            'Zira',              // Microsoft
        ];
        
        let selectedVoice = voices.find(voice => preferredVoiceNames.includes(voice.name) && voice.lang.startsWith('en'));

        // Fallback to any other English voice if preferred are not found
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);
    }, [voices]);


    const initializeChat = useCallback(async () => {
        setIsLoading(true);
        setMessages([]);
        try {
            const sampleDialogue = await generateSampleDialogue(topic, difficulty);
            // Parse all messages from the sample dialogue, including user messages
            const parsedDialogue = sampleDialogue.map(msg => {
                const { text, translation } = parseMessageText(msg.text);
                return { ...msg, text, translation };
            });
            setMessages(parsedDialogue);
            // Use the original (unparsed) text for history
            startChatSession(topic, difficulty, sampleDialogue); 
        } catch (error) {
            console.error("Error initializing chat:", error);
            setMessages([{ sender: 'ai', text: 'Sorry, I am having trouble starting our conversation. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [topic, difficulty]);
    
    useEffect(() => {
        initializeChat();
    }, [initializeChat]);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await sendMessageStream(userInput);
            let currentAiMessage = '';
            
            // Add a temporary AI message that will be updated by the stream
            setMessages(prev => [...prev, { sender: 'ai', text: ''}]);

            for await (const chunk of stream) {
                currentAiMessage += chunk.text;
                 setMessages(prev => {
                    const latestMessages = [...prev];
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    // Update the last message in-place
                    if (lastMessage.sender === 'ai') {
                        lastMessage.text = currentAiMessage;
                    }
                    return latestMessages;
                });
            }
            
            const { text: finalText, translation: finalTranslation } = parseMessageText(currentAiMessage);
             setMessages(prev => {
                const latestMessages = [...prev];
                const lastMessage = latestMessages[latestMessages.length - 1];
                 if (lastMessage.sender === 'ai') {
                    lastMessage.text = finalText;
                    lastMessage.translation = finalTranslation;
                 }
                return latestMessages;
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'An error occurred. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isAiReplying = isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user';
    const isInitializing = isLoading && messages.length === 0;

    return (
        <div className="w-full max-w-3xl mx-auto h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden" style={{maxHeight: '85vh'}}>
            <header className="flex items-center justify-between p-4 border-b border-slate-200">
                <button onClick={onEndConversation} className="p-2 rounded-full hover:bg-slate-100">
                    <BackIcon />
                </button>
                <div className="text-center">
                    <h2 className="font-bold text-slate-800 capitalize">{topic}</h2>
                    <p className="text-sm text-slate-500">{difficulty}</p>
                </div>
                 <button onClick={onEndConversation} className="text-sm font-semibold text-green-600 hover:text-green-800 px-3 py-1">End</button>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg} onSpeak={handleSpeak} />
                ))}
                {isInitializing && (
                    <div className="flex items-center justify-center p-8">
                        <div className="flex items-center gap-2 text-slate-500">
                            <LogoIcon />
                            <span>Preparing your conversation...</span>
                        </div>
                    </div>
                )}
                {isAiReplying && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="max-w-xs px-4 py-3 rounded-2xl bg-blue-500 text-white rounded-bl-none">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex items-center gap-3 bg-slate-50">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                    disabled={isLoading}
                    aria-label="Your message"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
                    disabled={isLoading || !userInput.trim()}
                    aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatView;
