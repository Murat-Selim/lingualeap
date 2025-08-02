
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// =================================================================
// INLINED CODE FROM: types.ts
// =================================================================
type Role = 'user' | 'ai';

interface Message {
  id: string;
  role: Role;
  english: string;
  azerbaijani: string;
}

type View = 'home' | 'conversation';

type Difficulty = 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4';

// =================================================================
// INLINED CODE FROM: constants.ts
// =================================================================
const DIFFICULTY_LEVELS: Difficulty[] = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];

// =================================================================
// INLINED CODE FROM: components/icons.tsx
// =================================================================
const LinguaLeapLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 4.5C14.5 5.88 13.38 7 12 7C10.62 7 9.5 5.88 9.5 4.5C9.5 3.12 10.62 2 12 2C13.38 2 14.5 3.12 14.5 4.5ZM17 9H16C15.14 9 14.39 8.64 13.78 8.05C13.59 8.23 13.38 8.43 13.16 8.64C14.61 9.53 15.68 10.94 16.03 12.59C16.89 12.21 17.91 12 19 12V10C18.23 10 17.54 10.15 16.97 10.39C16.5 9.56 15.82 8.87 15 8.36C15.61 7.77 16.24 7.33 17 7V9ZM8 9H7V7C7.76 7.33 8.39 7.77 9 8.36C8.18 8.87 7.5 9.56 7.03 10.39C6.46 10.15 5.77 10 5 10V12C6.09 12 7.11 12.21 7.97 12.59C8.32 10.94 9.39 9.53 10.84 8.64C10.62 8.43 10.41 8.23 10.22 8.05C9.61 8.64 8.86 9 8 9ZM12 8.25C11.41 8.25 10.83 8.12 10.29 7.88L10.22 8.05C10.89 8.95 11.23 10.09 11.23 11.25V22H12.77V11.25C12.77 10.09 13.11 8.95 13.78 8.05L13.71 7.88C13.17 8.12 12.59 8.25 12 8.25Z" />
  </svg>
);

const DailyConversationsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const TotalXPIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
    </svg>
);

const LoadingSpinner = ({ className }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// =================================================================
// INLINED CODE FROM: services/geminiService.ts
// =================================================================
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const conversationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        role: { type: Type.STRING, description: "The speaker's role, either 'ai' or 'user'.", enum: ['ai', 'user'], },
        english: { type: Type.STRING, description: "The message in English.", },
        azerbaijani: { type: Type.STRING, description: "The message translated into Azerbaijani.", },
      },
      required: ['role', 'english', 'azerbaijani'],
    },
};

const generateConversation = async (topic: string, difficulty: Difficulty): Promise<Omit<Message, 'id'>[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable is not set.");
        alert("API Key is not configured. The application cannot function without it.");
        return [{
            role: 'ai',
            english: 'API Key is not configured. I cannot start the conversation.',
            azerbaijani: 'API açarı konfiqurasiya edilməyib. Söhbətə başlaya bilmirəm.'
        }];
    }
    try {
        const prompt = `Create a natural-sounding dialogue with 5 turns about "${topic}". The conversation is for an English language learner whose native language is Azerbaijani. The difficulty level should be ${difficulty}. The turns should alternate between the AI tutor ('ai') and the student ('user'), starting with the AI tutor.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conversationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedResponse)) {
            throw new Error("API response is not an array");
        }
        
        return parsedResponse;
    } catch (error) {
        console.error("Error generating conversation:", error);
        return [{
            role: 'ai',
            english: 'Sorry, I had trouble starting a conversation. Please try again.',
            azerbaijani: 'Bağışlayın, söhbətə başlaya bilmədim. Zəhmət olmasa, yenidən cəhd edin.'
        }];
    }
};

// =================================================================
// INLINED CODE FROM: components/HomeScreen.tsx
// =================================================================
interface HomeScreenProps {
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
  isLoading: boolean;
  dailyConversations: number;
  totalXp: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
    <div className="text-emerald-500">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({
  difficulty,
  setDifficulty,
  topic,
  setTopic,
  onStart,
  isLoading,
  dailyConversations,
  totalXp
}) => {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={<DailyConversationsIcon className="w-8 h-8"/>} label="Daily Conversations" value={dailyConversations} />
          <StatCard icon={<TotalXPIcon className="w-8 h-8"/>} label="Total XP" value={totalXp} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Start a New Conversation</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Difficulty Level</label>
            <div className="flex flex-wrap gap-3">
              {DIFFICULTY_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    difficulty === level
                      ? 'bg-emerald-500 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-600 mb-2">Conversation Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., traveling, new technologies, hobbies"
            />
          </div>
          <button
            onClick={onStart}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200 disabled:bg-emerald-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-5 h-5" />
                <span>Start Learning</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// INLINED CODE FROM: components/ConversationScreen.tsx
// =================================================================
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

const ConversationScreen: React.FC<ConversationScreenProps> = ({ messages, onGoHome, topic }) => {
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

// =================================================================
// INLINED CODE FROM: App.tsx
// =================================================================
function App() {
  const [view, setView] = useState<View>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY_LEVELS[1]);
  const [topic, setTopic] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // These would typically be fetched and persisted
  const [dailyConversations, setDailyConversations] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(0);

  const handleStartConversation = useCallback(async () => {
    if (!topic.trim()) {
      alert("Please enter a conversation topic.");
      return;
    }
    setIsLoading(true);
    try {
      const conversationTurns = await generateConversation(topic, difficulty);
      // Check if fallback message was returned due to an error
      if (conversationTurns.length === 1 && conversationTurns[0].english.includes('API Key is not configured')) {
         setIsLoading(false);
         return; // Stop execution if API key is missing
      }
      
      const newMessages: Message[] = conversationTurns.map((turn, index) => ({
        ...turn,
        id: `${Date.now()}-${index}`,
      }));
      setMessages(newMessages);
      
      // Update stats
      setDailyConversations(prev => prev + 1);
      setTotalXp(prev => prev + 10);
      
      setView('conversation');
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [topic, difficulty]);

  const handleGoHome = () => {
    setView('home');
    setMessages([]); // Clear old conversation
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mx-auto flex items-center gap-3 mb-8">
        <LinguaLeapLogo className="h-10 w-10 text-emerald-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">LinguaLeap</h1>
          <p className="text-gray-500">Master English with AI-powered Azerbaijani dialogues.</p>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto">
        {view === 'home' ? (
          <HomeScreen
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            topic={topic}
            setTopic={setTopic}
            onStart={handleStartConversation}
            isLoading={isLoading}
            dailyConversations={dailyConversations}
            totalXp={totalXp}
          />
        ) : (
          <ConversationScreen
            messages={messages}
            onGoHome={handleGoHome}
            topic={topic}
          />
        )}
      </main>
    </div>
  );
}

// =================================================================
// ORIGINAL RENDER CODE FROM: index.tsx
// =================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
