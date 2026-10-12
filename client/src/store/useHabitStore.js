import { create } from 'zustand';
import api from '../services/api';
import confetti from 'canvas-confetti';

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useHabitStore = create((set, get) => ({
  habits: [],
  overview: null,
  selectedDate: getLocalDateString(),
  selectedCategory: 'All',
  filterStatus: 'all',
  searchQuery: '',
  isLoading: false,
  isToggling: {},
  error: null,
  newAchievement: null,

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchHabits(date);
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearNewAchievement: () => set({ newAchievement: null }),

  fetchHabits: async (date = get().selectedDate) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get(`/habits?date=${date}`);
      set({ habits: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch habits',
        isLoading: false,
      });
    }
  },

  fetchOverview: async () => {
    try {
      const res = await api.get('/analytics/overview');
      set({ overview: res.data.data });
    } catch (err) {
      console.error('Failed to fetch overview metrics:', err);
    }
  },

  toggleHabit: async (habitId, date = get().selectedDate) => {
    const currentHabits = get().habits;
    const targetHabit = currentHabits.find((h) => h._id === habitId);
    if (!targetHabit) return;

    // Optimistic UI toggle
    const wasCompleted = targetHabit.stats.isCompletedToday;
    const optimisticCompleted = !wasCompleted;

    const updatedHabits = currentHabits.map((h) => {
      if (h._id === habitId) {
        const delta = optimisticCompleted ? 1 : -1;
        const newStreak = optimisticCompleted
          ? h.stats.currentStreak + 1
          : Math.max(0, h.stats.currentStreak - 1);

        return {
          ...h,
          stats: {
            ...h.stats,
            isCompletedToday: optimisticCompleted,
            currentStreak: newStreak,
            longestStreak: Math.max(h.stats.longestStreak, newStreak),
            totalCompletedDays: Math.max(0, h.stats.totalCompletedDays + delta),
          },
        };
      }
      return h;
    });

    set({
      habits: updatedHabits,
      isToggling: { ...get().isToggling, [habitId]: true },
    });

    // Check if 100% completed today to fire confetti celebration!
    const allCompletedNow = updatedHabits.every((h) => h.stats.isCompletedToday);
    if (optimisticCompleted && allCompletedNow && updatedHabits.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    }

    try {
      const res = await api.post(`/habits/${habitId}/toggle`, { date });
      const { stats, unlockedBadges, xpGained } = res.data;

      // Update with server truth
      set((state) => ({
        habits: state.habits.map((h) =>
          h._id === habitId ? { ...h, stats } : h
        ),
        isToggling: { ...state.isToggling, [habitId]: false },
      }));

      // Trigger achievement popup if newly unlocked
      if (unlockedBadges && unlockedBadges.length > 0) {
        set({ newAchievement: unlockedBadges[0] });
      }

      // Refresh overview stats in the background
      get().fetchOverview();

      return { success: true, xpGained, unlockedBadges };
    } catch (err) {
      // Revert optimistic update on failure
      set({
        habits: currentHabits,
        isToggling: { ...get().isToggling, [habitId]: false },
        error: 'Failed to update habit. Please try again.',
      });
      return { success: false };
    }
  },

  createHabit: async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      const newHabit = res.data.data;
      set((state) => ({
        habits: [newHabit, ...state.habits],
      }));
      if (res.data.unlockedBadges && res.data.unlockedBadges.length > 0) {
        set({ newAchievement: res.data.unlockedBadges[0] });
      }
      get().fetchOverview();
      return { success: true, habit: newHabit };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create habit',
      };
    }
  },

  updateHabit: async (id, habitData) => {
    try {
      const res = await api.put(`/habits/${id}`, habitData);
      const updated = res.data.data;
      set((state) => ({
        habits: state.habits.map((h) => (h._id === id ? updated : h)),
      }));
      get().fetchOverview();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update habit',
      };
    }
  },

  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      set((state) => ({
        habits: state.habits.filter((h) => h._id !== id),
      }));
      get().fetchOverview();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete habit',
      };
    }
  },

  saveNotes: async (id, date, notes) => {
    try {
      await api.put(`/habits/${id}/notes`, { date, notes });
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to save note' };
    }
  },
}));
