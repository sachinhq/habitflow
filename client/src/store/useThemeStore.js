import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('habitflow_theme') || 'system',

  setTheme: (newTheme) => {
    localStorage.setItem('habitflow_theme', newTheme);
    set({ theme: newTheme });
    get().applyTheme(newTheme);
  },

  applyTheme: (theme) => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  initTheme: () => {
    const currentTheme = get().theme;
    get().applyTheme(currentTheme);

    // Listen for OS preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (get().theme === 'system') {
        get().applyTheme('system');
      }
    });
  },
}));
