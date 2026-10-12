export const CATEGORIES = [
  'Health',
  'Fitness',
  'Study',
  'Work',
  'Personal',
  'Finance',
  'Reading',
  'Coding',
  'Sleep',
  'Other',
];

export const COLOR_PALETTE = [
  { name: 'Indigo', hex: '#6366f1', light: '#e0e7ff' },
  { name: 'Emerald', hex: '#10b981', light: '#d1fae5' },
  { name: 'Violet', hex: '#8b5cf6', light: '#ede9fe' },
  { name: 'Cyan', hex: '#06b6d4', light: '#cffafe' },
  { name: 'Blue', hex: '#3b82f6', light: '#dbeafe' },
  { name: 'Amber', hex: '#f59e0b', light: '#fef3c7' },
  { name: 'Rose', hex: '#f43f5e', light: '#ffe4e6' },
  { name: 'Pink', hex: '#ec4899', light: '#fce7f3' },
  { name: 'Orange', hex: '#f97316', light: '#ffedd5' },
  { name: 'Teal', hex: '#14b8a6', light: '#ccfbf1' },
];

export const FREQUENCIES = [
  { id: 'daily', label: 'Every Day', desc: 'Track every single day' },
  { id: 'specific_days', label: 'Specific Days', desc: 'Choose which days of the week' },
  { id: 'weekly', label: 'Weekly Target', desc: 'Repeat X times a week' },
  { id: 'monthly', label: 'Monthly Target', desc: 'Repeat X times a month' },
];

export const DAYS_OF_WEEK = [
  { id: 1, short: 'Mon', label: 'Monday' },
  { id: 2, short: 'Tue', label: 'Tuesday' },
  { id: 3, short: 'Wed', label: 'Wednesday' },
  { id: 4, short: 'Thu', label: 'Thursday' },
  { id: 5, short: 'Fri', label: 'Friday' },
  { id: 6, short: 'Sat', label: 'Saturday' },
  { id: 0, short: 'Sun', label: 'Sunday' },
];

export const MOTIVATIONAL_QUOTES = [
  { quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant' },
  { quote: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
  { quote: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { quote: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' },
  { quote: 'Consistency is the DNA of mastery.', author: 'Unknown' },
  { quote: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
];

export const getMotivationalMessage = (percentage, currentStreak) => {
  if (percentage === 100) {
    return {
      title: 'Flawless Day! 🌟',
      subtitle: `All scheduled habits completed today! Your streak is on fire (${currentStreak} days).`,
      badge: '100% Completed',
    };
  }
  if (percentage >= 70) {
    return {
      title: 'Crushing It! 🔥',
      subtitle: `You're ${percentage}% done today. Almost at the finish line!`,
      badge: 'Great Progress',
    };
  }
  if (percentage > 0) {
    return {
      title: 'Building Momentum ⚡',
      subtitle: `${percentage}% complete. Every check-off brings you closer to your goals.`,
      badge: 'In Progress',
    };
  }
  return {
    title: 'Ready to Conquer Today? 🚀',
    subtitle: 'Check off your first habit and ignite your daily streak!',
    badge: 'Starting Fresh',
  };
};
