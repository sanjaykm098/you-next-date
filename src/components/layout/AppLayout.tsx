import { ReactNode, useEffect } from 'react';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  useEffect(() => {
    // Lock body scroll when internal app layout is used
    document.body.classList.add('fixed-viewport');
    return () => {
      document.body.classList.remove('fixed-viewport');
    };
  }, []);

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-background relative overflow-hidden w-full">
      {showNav && <TopBar />}
      <main className={cn(
        "flex-1 scrollable",
        showNav ? 'pt-14 pb-20' : ''
      )}>
        {children}
      </main>
      {showNav && <BottomTabBar />}
    </div>
  );
}
