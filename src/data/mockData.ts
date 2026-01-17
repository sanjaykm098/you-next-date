import { Persona, Chat, Message, UsageLimits } from '@/types';

export const mockPersonas: Persona[] = [
  {
    id: '1',
    name: 'Priya',
    age: 24,
    bio: 'chai lover ☕ | music obsessed 🎵 | looking for someone to laugh with',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop'],
    vibes: ['Deep talks', 'Music', 'Travel'],
    location: 'Mumbai',
  },
  {
    id: '2',
    name: 'Aisha',
    age: 22,
    bio: 'bookworm 📚 | sunset chaser 🌅 | let\'s talk about everything',
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop'],
    vibes: ['Reading', 'Art', 'Coffee'],
    location: 'Delhi',
  },
  {
    id: '3',
    name: 'Neha',
    age: 25,
    bio: 'gym at 6am 💪 | netflix at night | somewhere in between, there\'s pizza',
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop'],
    vibes: ['Fitness', 'Movies', 'Food'],
    location: 'Bangalore',
  },
  {
    id: '4',
    name: 'Riya',
    age: 23,
    bio: 'dancing through life 💃 | dog mom 🐕 | coffee enthusiast',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'],
    vibes: ['Dancing', 'Pets', 'Cafe hopping'],
    location: 'Pune',
  },
  {
    id: '5',
    name: 'Simran',
    age: 26,
    bio: 'startup life 🚀 | weekend artist 🎨 | looking for my raj 😂',
    photos: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop'],
    vibes: ['Entrepreneurship', 'Art', 'Bollywood'],
    location: 'Hyderabad',
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    personaId: '1',
    persona: mockPersonas[0],
    lastMessage: 'Haha, that\'s so true! 😂',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    unreadCount: 2,
  },
  {
    id: '2',
    personaId: '2',
    persona: mockPersonas[1],
    lastMessage: 'What are you reading these days?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      content: 'Hey! Your bio cracked me up 😄',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'm2',
      chatId: '1',
      content: 'Heyy! Thanks yaar, I try to keep it real 😅',
      sender: 'persona',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: 'm3',
      chatId: '1',
      content: 'So what kind of music are you into?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      id: 'm4',
      chatId: '1',
      content: 'Everything from Arijit to Arctic Monkeys 🎵 You?',
      sender: 'persona',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'm5',
      chatId: '1',
      content: 'Same! Mood ke hisaab se change hota hai',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: 'm6',
      chatId: '1',
      content: 'Haha, that\'s so true! 😂',
      sender: 'persona',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  '2': [
    {
      id: 'm1',
      chatId: '2',
      content: 'Hey! Love your vibe ✨',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: 'm2',
      chatId: '2',
      content: 'Aww thank you! I saw you like books too?',
      sender: 'persona',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
    {
      id: 'm3',
      chatId: '2',
      content: 'What are you reading these days?',
      sender: 'persona',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ],
};

export const mockUsageLimits: UsageLimits = {
  swipesUsed: 8,
  swipesLimit: 20,
  messagesUsed: 12,
  messagesLimit: 30,
};

export const vibeOptions = [
  'Deep talks',
  'Music',
  'Travel',
  'Reading',
  'Art',
  'Coffee',
  'Fitness',
  'Movies',
  'Food',
  'Dancing',
  'Pets',
  'Gaming',
  'Photography',
  'Cooking',
  'Sports',
  'Nature',
];
