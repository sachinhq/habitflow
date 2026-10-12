import { create } from 'zustand';
import api from '../services/api';
import confetti from 'canvas-confetti';

export const useExamStore = create((set, get) => ({
  exams: [],
  targetExamId: 'ssc_cgl',
  overview: null,
  syllabus: [],
  activeSubjectId: 'maths',
  activeChapter: null,
  studyLogs: [],
  analytics: null,
  isLoading: false,
  isTogglingCheckpoint: {},
  error: null,

  setActiveSubjectId: (id) => set({ activeSubjectId: id }),
  setActiveChapter: (ch) => set({ activeChapter: ch }),

  fetchExams: async () => {
    try {
      const res = await api.get('/exam/exams');
      set({
        exams: res.data.data,
        targetExamId: res.data.targetExamId,
      });
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  },

  setTargetExam: async (examId, targetDate, dailyStudyHoursGoal) => {
    try {
      await api.post('/exam/target', { examId, targetDate, dailyStudyHoursGoal });
      set({ targetExamId: examId });
      get().fetchOverview();
      get().fetchSyllabus();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update target exam' };
    }
  },

  fetchOverview: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/exam/overview');
      set({
        overview: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error fetching exam overview:', err);
      set({ isLoading: false });
    }
  },

  fetchSyllabus: async () => {
    try {
      const res = await api.get('/exam/syllabus');
      set({ syllabus: res.data.data });
    } catch (err) {
      console.error('Error fetching syllabus:', err);
    }
  },

  fetchChapterDetail: async (chapterId) => {
    try {
      const res = await api.get(`/exam/chapters/${chapterId}`);
      set({ activeChapter: res.data.data });
      return res.data.data;
    } catch (err) {
      console.error('Error fetching chapter detail:', err);
    }
  },

  toggleCheckpoint: async (chapterId, checkpointId) => {
    const currentActive = get().activeChapter;
    if (!currentActive || currentActive.id !== chapterId) {
      await get().fetchChapterDetail(chapterId);
    }

    const chapter = get().activeChapter;
    if (!chapter) return;

    // Optimistic toggle
    const updatedCheckpoints = chapter.checkpoints.map((cp) =>
      cp.id === checkpointId ? { ...cp, isCompleted: !cp.isCompleted } : cp
    );

    set({
      activeChapter: {
        ...chapter,
        checkpoints: updatedCheckpoints,
      },
      isTogglingCheckpoint: { ...get().isTogglingCheckpoint, [checkpointId]: true },
    });

    try {
      const res = await api.post(`/exam/chapters/${chapterId}/checkpoints/${checkpointId}/toggle`);
      const updatedData = res.data.data;

      // Update active chapter with server calculation
      set({
        activeChapter: {
          ...chapter,
          ...updatedData,
        },
        isTogglingCheckpoint: { ...get().isTogglingCheckpoint, [checkpointId]: false },
      });

      // If chapter was just mastered, trigger celebration!
      if (updatedData.status === 'mastered') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
        });
      }

      // Refresh syllabus & overview in background
      get().fetchSyllabus();
      get().fetchOverview();

      return { success: true, xpGained: res.data.xpGained };
    } catch (err) {
      // Revert optimistic update
      set({
        activeChapter: chapter,
        isTogglingCheckpoint: { ...get().isTogglingCheckpoint, [checkpointId]: false },
      });
      return { success: false };
    }
  },

  addCustomCheckpoint: async (chapterId, checkpointData) => {
    try {
      const res = await api.post(`/exam/chapters/${chapterId}/checkpoints`, checkpointData);
      set((state) => ({
        activeChapter: state.activeChapter ? { ...state.activeChapter, ...res.data.data } : null,
      }));
      get().fetchSyllabus();
      get().fetchOverview();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add checkpoint' };
    }
  },

  deleteCheckpoint: async (chapterId, checkpointId) => {
    try {
      const res = await api.delete(`/exam/chapters/${chapterId}/checkpoints/${checkpointId}`);
      set((state) => ({
        activeChapter: state.activeChapter ? { ...state.activeChapter, ...res.data.data } : null,
      }));
      get().fetchSyllabus();
      get().fetchOverview();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete checkpoint' };
    }
  },

  updateChapterStats: async (chapterId, statsData) => {
    try {
      const res = await api.put(`/exam/chapters/${chapterId}/stats`, statsData);
      set((state) => ({
        activeChapter: state.activeChapter ? { ...state.activeChapter, ...res.data.data } : null,
      }));
      get().fetchSyllabus();
      get().fetchOverview();
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to update stats' };
    }
  },

  logStudySession: async (sessionData) => {
    try {
      const res = await api.post('/exam/study-log', sessionData);
      get().fetchStudyLogs();
      get().fetchOverview();
      return { success: true, xpGained: res.data.xpGained };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to log study session' };
    }
  },

  fetchStudyLogs: async () => {
    try {
      const res = await api.get('/exam/study-logs');
      set({ studyLogs: res.data.data });
    } catch (err) {
      console.error('Error fetching study logs:', err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await api.get('/exam/analytics');
      set({ analytics: res.data.data });
    } catch (err) {
      console.error('Error fetching exam analytics:', err);
    }
  },
}));
