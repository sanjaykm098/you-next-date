import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative">
      {showNav && <TopBar />}
      <main className={showNav ? 'pt-14 pb-20' : ''}>
        {children}
      </main>
      {showNav && <BottomTabBar />}
    </div>
  );
}
