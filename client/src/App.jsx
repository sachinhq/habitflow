import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Today } from './pages/Today';
import { WeeklyView } from './pages/WeeklyView';
import { MonthlyView } from './pages/MonthlyView';
import { Analytics } from './pages/Analytics';
import { HabitsManage } from './pages/HabitsManage';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { WeightManagement } from './pages/WeightManagement';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

// Exam Prep Pages
import { ExamLayout } from './pages/exam/ExamLayout';
import { ExamDashboard } from './pages/exam/ExamDashboard';
import { SyllabusView } from './pages/exam/SyllabusView';
import { DailyStudyPlan } from './pages/exam/DailyStudyPlan';
import { PracticeRevision } from './pages/exam/PracticeRevision';
import { ExamAnalytics } from './pages/exam/ExamAnalytics';

import { useThemeStore } from './store/useThemeStore';

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Application Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/today" element={<Today />} />
          <Route path="/weekly" element={<WeeklyView />} />
          <Route path="/monthly" element={<MonthlyView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/habits" element={<HabitsManage />} />
          <Route path="/health" element={<WeightManagement />} />
          <Route path="/weight" element={<WeightManagement />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />

          {/* SSC Exam Prep Nested Routes */}
          <Route path="/exam-prep" element={<ExamLayout />}>
            <Route index element={<ExamDashboard />} />
            <Route path="syllabus" element={<SyllabusView />} />
            <Route path="daily-plan" element={<DailyStudyPlan />} />
            <Route path="practice" element={<PracticeRevision />} />
            <Route path="analytics" element={<ExamAnalytics />} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
