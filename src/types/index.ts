// Mock types for the dating app

export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  photos: string[];
  preferences: {
    ageRange: [number, number];
    genderPreference: string[];
    vibes: string[];
  };
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  vibes: string[];
  location: string;
  gender: string;
}

export interface Chat {
  id: string;
  personaId: string;
  persona: Persona;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'persona';
  timestamp: Date;
}

export interface UsageLimits {
  swipesUsed: number;
  swipesLimit: number;
  messagesUsed: number;
  messagesLimit: number;
}
