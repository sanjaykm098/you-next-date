import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/discover', icon: Compass, label: 'Discover' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-150',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon 
                  className={cn(
                    'w-6 h-6 transition-transform duration-150',
                    isActive && 'scale-110'
                  )} 
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
