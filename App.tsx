
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import { ProgressData } from './types';

type View = 'dashboard' | 'chat';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [progress, setProgress] = useState<ProgressData>({ conversations: 0, xp: 0 });
    const [chatConfig, setChatConfig] = useState<{ topic: string, difficulty: string }>({ topic: '', difficulty: '' });

    const handleStartConversation = (topic: string, difficulty: string) => {
        setChatConfig({ topic, difficulty });
        setView('chat');
    };

    const handleEndConversation = () => {
        setProgress(prev => ({
            conversations: prev.conversations + 1,
            xp: prev.xp + 10 
        }));
        setView('dashboard');
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 p-4 md:p-8">
            <Header />
            <main>
                {view === 'dashboard' ? (
                    <Dashboard onStartConversation={handleStartConversation} />
                ) : (
                    <ChatView 
                        topic={chatConfig.topic} 
                        difficulty={chatConfig.difficulty}
                        onEndConversation={handleEndConversation} 
                    />
                )}
            </main>
        </div>
    );
};

export default App;