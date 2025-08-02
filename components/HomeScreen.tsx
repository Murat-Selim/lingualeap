
import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { DIFFICULTY_LEVELS } from '../constants';
import type { Difficulty } from '../types';
import { DailyConversationsIcon, TotalXPIcon, LoadingSpinner, SendIcon } from './icons';

interface HomeScreenProps {
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
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

export const HomeScreen: React.FC<HomeScreenProps> = ({
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
