import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="px-4 h-14 flex items-center justify-between">
        <div className="w-10 h-10" /> {/* Spacer */}

        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="text-lg font-bold text-foreground">Date For You</span>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-muted rounded-full relative"
        >
          <MessageCircle className="w-6 h-6 text-foreground" />
          {/* Badge could go here */}
        </button>
      </div>
    </header>
  );
}
