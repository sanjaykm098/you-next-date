import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockChats, mockMessages } from '@/data/mockData';
import { Chat, Message } from '@/types';
import { cn } from '@/lib/utils';

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function ChatListItem({ chat, onClick }: { chat: Chat; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-card/50 transition-colors"
    >
      <div className="relative">
        <img
          src={chat.persona.photos[0]}
          alt={chat.persona.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        {chat.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">{chat.unreadCount}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-foreground">{chat.persona.name}</h3>
          <span className="text-xs text-muted-foreground">{formatTime(chat.lastMessageTime)}</span>
        </div>
        <p className={cn(
          "text-sm truncate",
          chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {chat.lastMessage}
        </p>
      </div>
    </motion.button>
  );
}

function ChatList() {
  const navigate = useNavigate();

  if (mockChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-136px)] px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-6">
          <Send className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No chats yet</h2>
        <p className="text-muted-foreground">Match with someone to start chatting</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {mockChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          onClick={() => navigate(`/chat/${chat.id}`)}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message, isUser }: { message: Message; isUser: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[75%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-card text-card-foreground rounded-bl-md'
        )}
      >
        <p className="text-sm">{message.content}</p>
        <p className={cn(
          'text-xs mt-1',
          isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-card px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatConversation({ chatId }: { chatId: string }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatId] || []);
  
  const chat = mockChats.find((c) => c.id === chatId);
  
  if (!chat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: `m${Date.now() + 1}`,
        chatId,
        content: "Haha, that's interesting! Tell me more 😊",
        sender: 'persona',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <img
            src={chat.persona.photos[0]}
            alt={chat.persona.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-medium text-foreground">{chat.persona.name}</h2>
            <p className="text-xs text-muted-foreground">
              {isTyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-14 pb-20 px-4">
        <div className="flex flex-col gap-3 py-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>
      
      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 bg-card text-foreground placeholder:text-muted-foreground px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { chatId } = useParams();
  
  if (chatId) {
    return <ChatConversation chatId={chatId} />;
  }
  
  return (
    <AppLayout>
      <ChatList />
    </AppLayout>
  );
}
