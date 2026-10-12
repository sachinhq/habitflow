import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate reset link dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mx-auto mb-4 animate-bounce-subtle">
            <Flame className="w-8 h-8 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your email and we'll send you recovery instructions
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Recovery Link Sent
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an account exists for <span className="font-bold">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link to="/login" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 font-bold text-sm shadow-md shadow-indigo-500/25"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
