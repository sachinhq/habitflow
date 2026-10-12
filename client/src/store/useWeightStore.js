import { create } from 'zustand';
import api from '../services/api';
import confetti from 'canvas-confetti';

export const useWeightStore = create((set, get) => ({
  logs: [],
  chartData: [],
  stats: {
    currentWeight: null,
    previousWeight: null,
    weeklyChange: 0,
    startingWeight: null,
    totalChange: 0,
    lowestWeight: null,
    highestWeight: null,
    averageWeight: null,
    targetWeight: null,
    remainingToTarget: null,
    targetProgress: 0,
    bmi: null,
    preferredUnit: 'kg',
    totalEntries: 0,
  },
  preferences: {
    targetWeight: null,
    startingWeight: null,
    heightCm: null,
    weightUnit: 'kg',
  },
  isLoading: false,
  isSaving: false,
  error: null,

  fetchWeightData: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/weight');
      const data = res.data?.data || {};
      set({
        logs: Array.isArray(data.logs) ? data.logs : [],
        chartData: Array.isArray(data.chartData) ? data.chartData : [],
        stats: data.stats || {
          currentWeight: null,
          previousWeight: null,
          weeklyChange: 0,
          startingWeight: null,
          totalChange: 0,
          lowestWeight: null,
          highestWeight: null,
          averageWeight: null,
          targetWeight: null,
          remainingToTarget: null,
          targetProgress: 0,
          bmi: null,
          preferredUnit: 'kg',
          totalEntries: 0,
        },
        preferences: data.preferences || {
          targetWeight: null,
          startingWeight: null,
          heightCm: null,
          weightUnit: 'kg',
        },
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch weight data',
        isLoading: false,
      });
    }
  },

  logWeight: async (payload) => {
    try {
      set({ isSaving: true });
      const res = await api.post('/weight', payload);
      
      // Fire small celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#6366f1'],
      });

      await get().fetchWeightData();
      set({ isSaving: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      set({ isSaving: false });
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to log weight',
      };
    }
  },

  deleteWeight: async (id) => {
    try {
      await api.delete(`/weight/${id}`);
      await get().fetchWeightData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete entry',
      };
    }
  },

  updatePreferences: async (prefs) => {
    try {
      set({ isSaving: true });
      await api.put('/weight/preferences', prefs);
      await get().fetchWeightData();
      set({ isSaving: false });
      return { success: true };
    } catch (err) {
      set({ isSaving: false });
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update preferences',
      };
    }
  },
}));
