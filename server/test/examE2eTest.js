async function runExamTests() {
  console.log('🧪 Starting SSC Exam Prep End-to-End API Tests...\n');

  const BASE_URL = 'http://localhost:5001/api';

  try {
    // 1. Authenticate with demo account
    console.log('1. Authenticating demo user...');
    const authRes = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
    const authData = await authRes.json();
    if (!authData.success || !authData.token) throw new Error('Demo auth failed');
    const token = authData.token;
    console.log('   ✅ Authenticated as:', authData.user.name);

    // 2. Fetch supported exams
    console.log('2. Testing GET /api/exam/exams');
    const examsRes = await fetch(`${BASE_URL}/exam/exams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const examsData = await examsRes.json();
    if (!examsData.success || examsData.data.length < 5) {
      throw new Error(`Expected at least 5 exams, got ${examsData.data?.length}`);
    }
    console.log('   ✅ Supported exams count:', examsData.data.length);
    console.log('   Exams:', examsData.data.map((e) => e.name).join(', '));

    // 3. Switch target exam to SSC CGL
    console.log('3. Testing POST /api/exam/target to set SSC CGL');
    const targetRes = await fetch(`${BASE_URL}/exam/target`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        examId: 'ssc_cgl',
        targetDate: '2026-09-15',
        dailyStudyHoursGoal: 5,
      }),
    });
    const targetData = await targetRes.json();
    if (!targetData.success) throw new Error('Set target exam failed');
    console.log('   ✅ Target exam set:', targetData.data.targetExam);

    // 4. Fetch Exam Overview
    console.log('4. Testing GET /api/exam/overview');
    const overviewRes = await fetch(`${BASE_URL}/exam/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const overviewData = await overviewRes.json();
    if (!overviewData.success) throw new Error('Exam overview failed');
    console.log('   ✅ Exam Overview:', {
      exam: overviewData.data.targetExam.name,
      daysRemaining: overviewData.data.targetExam.daysRemaining,
      overallProgress: overviewData.data.overallProgress + '%',
      totalChapters: overviewData.data.totalChapters,
      subjectsCount: overviewData.data.subjects.length,
    });

    // 5. Fetch Complete Syllabus
    console.log('5. Testing GET /api/exam/syllabus');
    const syllabusRes = await fetch(`${BASE_URL}/exam/syllabus`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const syllabusData = await syllabusRes.json();
    if (!syllabusData.success) throw new Error('Syllabus failed');
    console.log('   ✅ Syllabus Subjects:');
    syllabusData.data.forEach((s) => {
      console.log(`      - ${s.name}: ${s.totalChapters} chapters (${s.overallProgress}% complete)`);
    });

    // 6. Get Chapter Detail (Percentage: math_4)
    console.log('6. Testing GET /api/exam/chapters/math_4 (Percentage)');
    const chRes = await fetch(`${BASE_URL}/exam/chapters/math_4`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const chData = await chRes.json();
    if (!chData.success || !chData.data.checkpoints) throw new Error('Chapter detail failed');
    console.log('   ✅ Chapter checkpoints loaded:', chData.data.checkpoints.length);

    // 7. Toggle Checkpoint
    const cpId = chData.data.checkpoints[0].id;
    console.log(`7. Testing POST /api/exam/chapters/math_4/checkpoints/${cpId}/toggle`);
    const toggleRes = await fetch(`${BASE_URL}/exam/chapters/math_4/checkpoints/${cpId}/toggle`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const toggleData = await toggleRes.json();
    if (!toggleData.success) throw new Error('Toggle checkpoint failed');
    console.log('   ✅ Checkpoint toggled. Progress:', toggleData.data.progressPercentage + '%, Status:', toggleData.data.status);

    // 8. Add Custom Checkpoint
    console.log('8. Testing POST /api/exam/chapters/math_4/checkpoints (Add Custom Checkpoint)');
    const addCpRes = await fetch(`${BASE_URL}/exam/chapters/math_4/checkpoints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Complete 50 Tough PYQ Set from TCS 2024',
        category: 'pyq',
        priority: 'high',
        target: '50 questions',
      }),
    });
    const addCpData = await addCpRes.json();
    if (!addCpData.success) throw new Error('Add custom checkpoint failed');
    const addedCp = addCpData.data.checkpoints.find((cp) => cp.title.includes('Tough PYQ'));
    console.log('   ✅ Custom Checkpoint added:', addedCp?.title);

    // 9. Update Chapter Stats (practice questions, pyqs, revision count)
    console.log('9. Testing PUT /api/exam/chapters/math_4/stats');
    const statsRes = await fetch(`${BASE_URL}/exam/chapters/math_4/stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        practiceSolved: 85,
        practiceTarget: 100,
        pyqsSolved: 40,
        pyqsTarget: 50,
        revisionCount: 2,
        notes: 'Mastered fraction to percentage conversions (1/7 = 14.28%, 1/8 = 12.5%)',
      }),
    });
    const statsData = await statsRes.json();
    if (!statsData.success) throw new Error('Update stats failed');
    console.log('   ✅ Chapter stats updated: Practice', statsData.data.practiceSolved + '/' + statsData.data.practiceTarget);

    // 10. Log a Study Session
    console.log('10. Testing POST /api/exam/study-log');
    const logRes = await fetch(`${BASE_URL}/exam/study-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subjectId: 'maths',
        chapterId: 'math_4',
        chapterName: 'Percentage',
        durationMinutes: 60,
        questionsSolved: 35,
        topicCovered: 'Percentage increase/decrease and successive percentage tricks',
        notes: 'Completed in single sitting without distraction',
      }),
    });
    const logData = await logRes.json();
    if (!logData.success) throw new Error('Log study session failed');
    console.log('   ✅ Study session logged:', logData.data.durationMinutes, 'minutes, XP gained:', logData.xpGained);

    // 11. Fetch Exam Analytics
    console.log('11. Testing GET /api/exam/analytics');
    const analyticsRes = await fetch(`${BASE_URL}/exam/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const analyticsData = await analyticsRes.json();
    if (!analyticsData.success) throw new Error('Analytics failed');
    console.log('   ✅ Analytics returned:');
    console.log('      - Subject stats:', analyticsData.data.subjectStats.length, 'subjects');
    console.log('      - Mastery distribution:', analyticsData.data.masteryDistribution.map((m) => `${m.name}: ${m.value}`).join(', '));
    console.log('      - Study trend days:', analyticsData.data.studyTrend.length);

    console.log('\n🎉 ALL 11 SSC EXAM PREP TESTS PASSED SUCCESSFULLY! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

runExamTests();
