
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  translation?: string;
}

export interface ProgressData {
    conversations: number;
    xp: number;
}