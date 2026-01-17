import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-background relative overflow-hidden">
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
