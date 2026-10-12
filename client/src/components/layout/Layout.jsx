import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { AchievementModal } from '../gamification/AchievementModal';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useHabitStore } from '../../store/useHabitStore';

export const Layout = () => {
  const { newAchievement, clearNewAchievement } = useHabitStore();

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Achievement Unlocked Popup */}
      <AchievementModal
        achievement={newAchievement}
        onClose={clearNewAchievement}
      />
    </div>
  );
};
