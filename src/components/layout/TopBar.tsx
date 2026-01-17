import { Heart } from 'lucide-react';

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="text-lg font-semibold text-foreground">Date For You</span>
        </div>
      </div>
    </header>
  );
}
