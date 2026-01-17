import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chat, Message } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

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

function ChatListItem({ chat, onClick }: { chat: any; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-card/50 transition-colors border-b border-border/50"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
          <span className="text-3xl" role="img" aria-label="avatar">
            {chat.personas.photos?.[0] || '😎'}
          </span>
        </div>
        {chat.unread_count > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
            <span className="text-[10px] font-bold text-white">{chat.unread_count}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">{chat.personas.name}</h3>
          <span className="text-xs text-muted-foreground">{formatTime(new Date(chat.last_message_time))}</span>
        </div>
        <p className={cn(
          "text-sm truncate",
          chat.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {chat.last_message || 'Start a conversation'}
        </p>
      </div>
    </motion.button>
  );
}

function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chats')
        .select('*, personas(*)')
        .eq('user_id', user.id)
        .order('last_message_time', { ascending: false });

      if (data) setChats(data);
      setLoading(false);
    };
    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-136px)]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-136px)] px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-6 shadow-inner">
          <Send className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No chats yet</h2>
        <p className="text-muted-foreground">Match with someone to start chatting</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/30">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          onClick={() => navigate(`/chat/${chat.id}`)}
        />
      ))}
    </div>
  );
}

function ChatConversation({ chatId }: { chatId: string }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      const { data: chatData } = await supabase
        .from('chats')
        .select('*, personas(*)')
        .eq('id', chatId)
        .single();

      if (chatData) {
        setChat(chatData);
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (messagesData) setMessages(messagesData);
      }
      setLoading(false);
    };
    fetchChatData();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chat) return;

    const text = inputValue.trim();
    setInputValue('');

    try {
      // 1. Save user message to DB
      const { data: userMsg, error } = await supabase.from('messages').insert({
        chat_id: chatId,
        sender_type: 'user',
        content: text
      }).select().single();

      if (error) throw error;

      // 2. Call AI Edge Function
      setIsTyping(true);
      const { data: aiData, error: aiError } = await supabase.functions.invoke('chat-ai', {
        body: { chatId, message: text, personaId: chat.persona_id }
      });

      if (aiError) throw aiError;

      // AI message will be added via realtime subscription
    } catch (err: any) {
      console.error('Send error:', err);
      toast.error('Failed to send message: ' + (err.message || 'Unknown error'));
      setIsTyping(false);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!chat) return null;

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 h-16 flex items-center px-4">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 -ml-2 hover:bg-card rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden ml-2">
          <span className="text-xl" role="img" aria-label="avatar">
            {chat.personas.photos?.[0] || '😎'}
          </span>
        </div>
        <div className="ml-3">
          <h2 className="font-semibold text-foreground text-sm">{chat.personas.name}</h2>
          <p className="text-[10px] text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {isTyping ? 'typing...' : 'online'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-16 pb-24 px-4 space-y-4 scroll-smooth"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('flex', message.sender_type === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm',
                message.sender_type === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-card text-foreground rounded-tl-none border border-border/50'
              )}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-none border border-border/50">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-card border border-border/50 text-foreground px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
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
      <div className="max-w-2xl mx-auto">
        <div className="p-4 border-b border-border/30">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </div>
        <ChatList />
      </div>
    </AppLayout>
  );
}
