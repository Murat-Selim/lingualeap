
import React from 'react';
import type { Message, Role } from '../types';
import { SpeakerIcon, StartIcon } from './icons';

interface ConversationScreenProps {
  messages: Message[];
  onGoHome: () => void;
  topic: string;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAi = message.role === 'ai';

  const speak = (text: string, lang: 'en-US' | 'az-AZ') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const bubbleClasses = isAi
    ? 'bg-blue-500 text-white rounded-br-lg'
    : 'bg-green-500 text-white rounded-bl-lg self-end';
  
  const wrapperClasses = isAi ? 'items-start' : 'items-end';

  return (
    <div className={`flex flex-col gap-2 w-full max-w-lg ${wrapperClasses}`}>
        <div className={`p-4 rounded-t-lg ${bubbleClasses}`}>
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/30">
                <span className="font-bold text-sm">English:</span>
                <button onClick={() => speak(message.english, 'en-US')} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <SpeakerIcon className="w-5 h-5" />
                </button>
            </div>
            <p className="mb-3">{message.english}</p>

            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/30">
                <span className="font-bold text-sm">Azerbaijani:</span>
                <button onClick={() => speak(message.azerbaijani, 'az-AZ')} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <SpeakerIcon className="w-5 h-5" />
                </button>
            </div>
            <p>{message.azerbaijani}</p>
        </div>
    </div>
  );
};

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ messages, onGoHome, topic }) => {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
             <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">Conversation Topic</h2>
                <p className="text-gray-500 capitalize">{topic}</p>
            </div>
            <button
                onClick={onGoHome}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
                New Conversation
            </button>
        </div>
      
      <div className="h-[60vh] overflow-y-auto p-4 bg-gray-100 rounded-lg flex flex-col gap-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
};
