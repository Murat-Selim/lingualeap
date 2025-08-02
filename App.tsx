
import React from 'react';
import { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ConversationScreen } from './components/ConversationScreen';
import { generateConversation } from './services/geminiService';
import { Difficulty, Message, View } from './types';
import { DIFFICULTY_LEVELS } from './constants';
import { LinguaLeapLogo } from './components/icons';

function App() {
  const [view, setView] = useState<View>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY_LEVELS[1]);
  const [topic, setTopic] = useState<string>('working in the tech industry');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // These would typically be fetched and persisted
  const [dailyConversations, setDailyConversations] = useState<number>(6);
  const [totalXp, setTotalXp] = useState<number>(310);

  const handleStartConversation = useCallback(async () => {
    if (!topic.trim()) {
      alert("Please enter a conversation topic.");
      return;
    }
    setIsLoading(true);
    try {
      const conversationTurns = await generateConversation(topic, difficulty);
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
      // Optionally show an error message to the user
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

export default App;
