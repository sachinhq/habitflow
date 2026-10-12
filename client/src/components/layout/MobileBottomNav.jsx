import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  GraduationCap,
  Settings,
  Scale,
  HeartPulse,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileBottomNav = () => {
  const tabs = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/exam-prep', label: 'Exam Prep', icon: GraduationCap },
    { to: '/health', label: 'Health', icon: HeartPulse },
    { to: '/today', label: 'Today', icon: CheckSquare },
    { to: '/monthly', label: 'Calendar', icon: Calendar },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 safe-area-inset-bottom">
      <div className="grid grid-cols-6 h-16 items-center px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5 mb-1', isActive && 'scale-110')} />
                  <span className="text-[10px] tracking-tight">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
