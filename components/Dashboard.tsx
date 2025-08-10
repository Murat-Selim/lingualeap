
import React, { useState } from 'react';
import { DIFFICULTY_LEVELS, SendIcon, LightningIcon } from '../constants';

interface DashboardProps {
    onStartConversation: (topic: string, difficulty: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartConversation }) => {
    // Default to level 4 as shown in the image
    const [selectedLevel, setSelectedLevel] = useState<number>(4);
    const [topic, setTopic] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTopic = topic.trim() === '' ? 'general greetings' : topic;
        const difficulty = DIFFICULTY_LEVELS.find(level => level.id === selectedLevel)?.value || 'Upper-Intermediate (B2)';
        onStartConversation(finalTopic, difficulty);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="p-8 bg-white rounded-xl shadow-lg border border-slate-200/50">
                <div className="flex items-center gap-3 mb-8">
                    <LightningIcon />
                    <h2 className="text-2xl font-bold text-green-600">Start a New Conversation</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Difficulty Level Section */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Difficulty Level</h3>
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            {DIFFICULTY_LEVELS.map(level => (
                                <label key={level.id} htmlFor={`level-${level.id}`} className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        id={`level-${level.id}`}
                                        name="difficulty"
                                        value={level.id}
                                        checked={selectedLevel === level.id}
                                        onChange={() => setSelectedLevel(level.id)}
                                        className="sr-only"
                                    />
                                    {/* Custom radio button visual */}
                                    <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                        selectedLevel === level.id ? 'border-green-600' : 'border-slate-300 group-hover:border-slate-400'
                                    }`}>
                                        <span className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                            selectedLevel === level.id ? 'bg-green-600' : 'bg-transparent'
                                        }`}></span>
                                    </span>
                                    <span className="ml-3 text-md font-medium text-slate-700">
                                        {level.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Conversation Topic Section */}
                    <div>
                        <label htmlFor="topic" className="block text-lg font-bold text-slate-800 mb-4">Conversation Topic</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder='E.g., "ordering food", or leave blank for "general greetings"'
                            className="w-full px-4 py-3 bg-white text-slate-800 placeholder:text-slate-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md hover:shadow-lg active:bg-green-800"
                        >
                            <SendIcon />
                            Start Learning
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;