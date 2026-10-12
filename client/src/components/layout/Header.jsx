import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Laptop,
  Flame,
  User,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  Scale,
  HeartPulse,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />;
    return <Laptop className="w-4 h-4 text-slate-400" />;
  };

  const unread = unreadCount();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile App Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              HabitFlow
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Welcome back, {user?.name || 'Habit Builder'}
            </span>
            <span>•</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
              Level {user?.level || 1}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Button */}
          <button
            onClick={cycleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all"
            title={`Current theme: ${theme}. Click to switch.`}
          >
            {getThemeIcon()}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Notifications
                  </h4>
                  {unread > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                        !n.read && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/60 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-1.5">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Settings
                </Link>

                <Link
                  to="/health"
                  onClick={() => setShowUserMenu(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <HeartPulse className="w-4 h-4 text-emerald-500" /> Health Tracker
                </Link>

                <Link
                  to="/achievements"
                  onClick={() => setShowUserMenu(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> Badges & XP
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
