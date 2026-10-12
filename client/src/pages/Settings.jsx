import React, { useState } from 'react';
import {
  User,
  Sun,
  Moon,
  Laptop,
  Bell,
  RefreshCw,
  Check,
  Shield,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useHabitStore } from '../store/useHabitStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import { cn } from '../utils/cn';

export const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { requestBrowserPermission } = useNotificationStore();
  const { fetchHabits, fetchOverview } = useHabitStore();

  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const res = await api.put('/users/profile', { name });
      updateUser(res.data.data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await requestBrowserPermission();
    if (granted) {
      alert('Browser notifications enabled successfully!');
    } else {
      alert('Notification permissions were not granted by the browser.');
    }
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    setSeedSuccess('');
    try {
      await api.post('/users/seed-demo');
      await fetchHabits();
      await fetchOverview();
      setSeedSuccess('Demo habits and 60 days of historical data loaded!');
      setTimeout(() => setSeedSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your appearance, notification preferences, and account profile
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Account Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed directly."
              />
            </div>

            {successMessage && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> {successMessage}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                <Save className="w-4 h-4" /> Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance & Theme Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Appearance & Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Choose your preferred theme. HabitFlow seamlessly adjusts across all components.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 font-bold text-xs',
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Browser Push Notifications
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Receive browser alert prompts for scheduled habits
              </p>
            </div>
            <Button
              onClick={handleRequestNotifications}
              variant="outline"
              size="sm"
            >
              Request Permission
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Data Management */}
      <Card className="border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/20 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Demonstration Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Need realistic sample habits (Morning Walk, Water, 20 Pages, Coding, DBMS, Sleep, Meditation) with 60 days of historical completion records for testing analytics and heatmaps?
          </p>

          {seedSuccess && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> {seedSuccess}
            </p>
          )}

          <Button
            onClick={handleSeedDemoData}
            variant="secondary"
            isLoading={isSeeding}
            className="font-bold border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Load Realistic Demo Habits (60 Days)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
