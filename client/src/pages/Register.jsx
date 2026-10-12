import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Register = () => {
  const { register, demoLogin, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    clearError();
    const result = await demoLogin();
    setIsDemoLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mx-auto mb-4 animate-bounce-subtle">
            <Flame className="w-8 h-8 fill-white text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Start with HabitFlow
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Join thousands building consistency and lifelong habits
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5">
          {/* 1-Click Demo Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleDemo}
              disabled={isDemoLoading || isLoading}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/40 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {isDemoLoading ? 'Loading Demo Profile...' : '1-Click Demo Account Access'}
            </button>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 font-semibold uppercase">
                or sign up with email
              </span>
            </div>
          </div>

          {(error || localError) && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold text-sm shadow-md shadow-indigo-500/25"
              isLoading={isLoading}
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Footer Login Link */}
          <div className="text-center mt-6 text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
