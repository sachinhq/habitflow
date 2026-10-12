import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => {
  // Listen for 401 unauthorized events from axios interceptor
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      set({ user: null, token: null, isAuthenticated: false });
    });
  }

  return {
    user: null,
    token: localStorage.getItem('habitflow_token') || null,
    isAuthenticated: !!localStorage.getItem('habitflow_token'),
    isLoading: true,
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    checkAuth: async () => {
      const token = localStorage.getItem('habitflow_token');
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        set({ isLoading: true });
        const res = await api.get('/auth/me');
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        localStorage.removeItem('habitflow_token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    },

    login: async (email, password) => {
      try {
        set({ isLoading: true, error: null });
        const res = await api.post('/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('habitflow_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
        set({ error: msg, isLoading: false });
        return { success: false, message: msg };
      }
    },

    register: async (name, email, password) => {
      try {
        set({ isLoading: true, error: null });
        const res = await api.post('/auth/register', { name, email, password });
        const { token, user } = res.data;

        localStorage.setItem('habitflow_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed. Please try again.';
        set({ error: msg, isLoading: false });
        return { success: false, message: msg };
      }
    },

    demoLogin: async () => {
      try {
        set({ isLoading: true, error: null });
        const res = await api.post('/auth/demo');
        const { token, user } = res.data;

        localStorage.setItem('habitflow_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || 'Demo login failed.';
        set({ error: msg, isLoading: false });
        return { success: false, message: msg };
      }
    },

    logout: async () => {
      try {
        await api.post('/auth/logout');
      } catch (e) {
        // ignore
      } finally {
        localStorage.removeItem('habitflow_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      }
    },

    updateUser: (userData) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : userData,
      }));
    },
  };
});
