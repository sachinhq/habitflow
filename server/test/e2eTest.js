import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import Achievement from '../models/Achievement.js';
import { getTodayString } from '../utils/dateHelper.js';
import '../server.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('🧪 Starting HabitFlow End-to-End API Tests...\n');
  await delay(1500); // Allow server to bind

  const BASE_URL = 'http://localhost:5001/api';
  let token = '';
  let testHabitId = '';

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    if (health.status !== 'online') throw new Error('Health check failed');
    console.log('   ✅ Health check passed: online');

    // 2. Register new user
    const testEmail = `tester_${Date.now()}@habitflow.app`;
    console.log(`2. Testing POST /api/auth/register with ${testEmail}`);
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Runner',
        email: testEmail,
        password: 'password123',
      }),
    });
    const regData = await regRes.json();
    if (!regData.success || !regData.token) throw new Error(`Registration failed: ${regData.message}`);
    token = regData.token;
    console.log('   ✅ Registration passed, token acquired, user XP:', regData.user.xp);

    // 3. Get /auth/me
    console.log('3. Testing GET /api/auth/me');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    if (!meData.success || meData.user.email !== testEmail) throw new Error('Auth me check failed');
    console.log('   ✅ Auth verification passed for:', meData.user.name);

    // 4. Create Habit
    console.log('4. Testing POST /api/habits (Create Habit)');
    const createRes = await fetch(`${BASE_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Deep Work Session',
        description: '90 minutes of focused coding without distractions',
        category: 'Coding',
        icon: 'Code',
        color: '#3b82f6',
        frequency: 'daily',
        targetCount: 90,
        unit: 'mins',
        reminderTime: '10:00',
        isReminderEnabled: true,
      }),
    });
    const createData = await createRes.json();
    if (!createData.success || !createData.data._id) throw new Error('Habit creation failed');
    testHabitId = createData.data._id;
    console.log('   ✅ Habit created:', createData.data.name, 'ID:', testHabitId);
    console.log('   ✅ Initial stats:', createData.data.stats);

    // 5. Toggle completion for today
    const todayStr = getTodayString();
    console.log(`5. Testing POST /api/habits/${testHabitId}/toggle for today (${todayStr})`);
    const toggleRes1 = await fetch(`${BASE_URL}/habits/${testHabitId}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: todayStr, notes: 'Completed full 90m session!' }),
    });
    const toggleData1 = await toggleRes1.json();
    if (!toggleData1.success || !toggleData1.data.completed) throw new Error('First toggle failed');
    console.log('   ✅ Habit completed for today! New streak:', toggleData1.data.stats.currentStreak);
    console.log('   ✅ XP gained:', toggleData1.xpGained);

    // 6. Test Weekly Analytics
    console.log('6. Testing GET /api/analytics/weekly');
    const weeklyRes = await fetch(`${BASE_URL}/analytics/weekly?date=${todayStr}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const weeklyData = await weeklyRes.json();
    if (!weeklyData.success) throw new Error('Weekly analytics failed');
    console.log('   ✅ Weekly matrix returned', weeklyData.data.habitMatrix.length, 'habits, score:', weeklyData.data.weeklyCompletionRate + '%');

    // 7. Test Monthly Heatmap
    const now = new Date();
    console.log(`7. Testing GET /api/analytics/monthly for ${now.getFullYear()}/${now.getMonth() + 1}`);
    const monthlyRes = await fetch(
      `${BASE_URL}/analytics/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const monthlyData = await monthlyRes.json();
    if (!monthlyData.success) throw new Error('Monthly heatmap failed');
    console.log('   ✅ Monthly heatmap returned', monthlyData.data.heatmap.length, 'days, total check-offs:', monthlyData.data.totalCompleted);

    // 8. Test Trends
    console.log('8. Testing GET /api/analytics/trends');
    const trendsRes = await fetch(`${BASE_URL}/analytics/trends?days=7`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const trendsData = await trendsRes.json();
    if (!trendsData.success) throw new Error('Trends analytics failed');
    console.log('   ✅ Trends returned for', trendsData.data.daysCount, 'days, average rate:', trendsData.data.averageCompletionRate + '%');

    // 9. Test Achievements
    console.log('9. Testing GET /api/users/achievements');
    const achRes = await fetch(`${BASE_URL}/users/achievements`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const achData = await achRes.json();
    if (!achData.success) throw new Error('Achievements failed');
    console.log('   ✅ Achievements returned, unlocked count:', achData.data.unlockedCount);

    // 10. Update habit
    console.log('10. Testing PUT /api/habits/' + testHabitId);
    const updateRes = await fetch(`${BASE_URL}/habits/${testHabitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: 'Deep Work Session (Updated)', targetCount: 120 }),
    });
    const updateData = await updateRes.json();
    if (!updateData.success || updateData.data.name !== 'Deep Work Session (Updated)') {
      throw new Error('Update habit failed');
    }
    console.log('   ✅ Habit updated successfully');

    // 11. Delete habit
    console.log('11. Testing DELETE /api/habits/' + testHabitId);
    const deleteRes = await fetch(`${BASE_URL}/habits/${testHabitId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteData = await deleteRes.json();
    if (!deleteData.success) throw new Error('Delete habit failed');
    console.log('   ✅ Habit deleted successfully');

    console.log('\n🎉 ALL 11 END-TO-END TESTS PASSED SUCCESSFULLY! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

runTests();
