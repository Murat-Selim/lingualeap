
export type Role = 'user' | 'ai';

export interface Message {
  id: string;
  role: Role;
  english: string;
  azerbaijani: string;
}

export type View = 'home' | 'conversation';

export type Difficulty = 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4';
