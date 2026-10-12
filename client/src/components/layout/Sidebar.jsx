import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarRange,
  Calendar,
  BarChart3,
  Layers,
  GraduationCap,
  Award,
  Settings,
  Flame,
  Zap,
  Scale,
  HeartPulse,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../utils/cn';

export const Sidebar = () => {
  const { user } = useAuthStore();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/exam-prep', label: 'Exam Prep', icon: GraduationCap, badge: 'SSC' },
    { to: '/health', label: 'Health', icon: HeartPulse },
    { to: '/today', label: 'Today', icon: CheckSquare },
    { to: '/weekly', label: 'Weekly View', icon: CalendarRange },
    { to: '/monthly', label: 'Monthly View', icon: Calendar },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/habits', label: 'Manage Habits', icon: Layers },
    { to: '/achievements', label: 'Badges & XP', icon: Award },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  // Calculate XP progress
  const userLevel = user?.level || 1;
  const userXp = user?.xp || 0;
  const currentLevelBase = Math.pow(userLevel - 1, 2) * 50;
  const nextLevelBase = Math.pow(userLevel, 2) * 50;
  const levelProgress =
    nextLevelBase > currentLevelBase
      ? Math.round(
          ((userXp - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100
        )
      : 100;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 transition-colors z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Flame className="w-6 h-6 fill-white text-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            HabitFlow
          </span>
          <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-0.5">
            Consistency SaaS
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Gamification XP Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-violet-50/60 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Level {userLevel}
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              {userXp} XP
            </span>
          </div>

          <ProgressBar
            value={levelProgress}
            max={100}
            height="h-2"
            color="bg-gradient-to-r from-indigo-500 to-violet-500"
            trackColor="bg-slate-200/80 dark:bg-slate-800"
          />

          <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
            <span>Next: Level {userLevel + 1}</span>
            <span>{Math.max(0, nextLevelBase - userXp)} XP left</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
