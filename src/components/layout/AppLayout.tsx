import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showNav && <TopBar />}
      <main className={showNav ? 'pt-14 pb-20' : ''}>
        {children}
      </main>
      {showNav && <BottomTabBar />}
    </div>
  );
}
