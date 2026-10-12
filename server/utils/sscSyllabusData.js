/**
 * Canonical SSC Exam Syllabus & Structure
 * Covers SSC CGL, SSC CHSL, SSC MTS, SSC CPO, and SSC GD.
 */

export const DEFAULT_CHECKPOINTS = [
  // 📖 Learn (Weight: 20%)
  {
    id: 'learn_concepts',
    title: 'Understand basic concepts',
    category: 'learn',
    weight: 5,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'learn_formulas',
    title: 'Learn formulas & rules',
    category: 'learn',
    weight: 5,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'learn_shortcuts',
    title: 'Study shortcuts & calculation tricks',
    category: 'learn',
    weight: 5,
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: 'learn_theory',
    title: 'Complete chapter theory & notes',
    category: 'learn',
    weight: 5,
    isCompleted: false,
    priority: 'high',
  },

  // ✍️ Practice (Weight: 30%)
  {
    id: 'prac_basic',
    title: 'Solve Level 1 (Basic) questions',
    category: 'practice',
    weight: 7.5,
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: 'prac_moderate',
    title: 'Solve Level 2 (Moderate) questions',
    category: 'practice',
    weight: 7.5,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'prac_difficult',
    title: 'Solve Level 3 (Difficult / Advanced) questions',
    category: 'practice',
    weight: 7.5,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'prac_set',
    title: 'Complete comprehensive practice set',
    category: 'practice',
    weight: 7.5,
    isCompleted: false,
    priority: 'medium',
  },

  // 📝 PYQs (Weight: 25%)
  {
    id: 'pyq_solve',
    title: 'Solve SSC Previous Year Questions (PYQs)',
    category: 'pyq',
    weight: 6.25,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'pyq_set1',
    title: 'Complete Previous-Year Set 1 (Last 3 years)',
    category: 'pyq',
    weight: 6.25,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'pyq_set2',
    title: 'Complete Previous-Year Set 2 (Last 5 years)',
    category: 'pyq',
    weight: 6.25,
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: 'pyq_errors',
    title: 'Analyze & log mistake / silly error notebook',
    category: 'pyq',
    weight: 6.25,
    isCompleted: false,
    priority: 'high',
  },

  // 🔄 Revision (Weight: 15%)
  {
    id: 'rev_1',
    title: 'First revision (Within 3 days)',
    category: 'revision',
    weight: 5,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'rev_2',
    title: 'Second revision (Within 15 days)',
    category: 'revision',
    weight: 5,
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: 'rev_final',
    title: 'Final pre-exam speed revision',
    category: 'revision',
    weight: 5,
    isCompleted: false,
    priority: 'high',
  },

  // 🎯 Test (Weight: 10%)
  {
    id: 'test_chapter',
    title: 'Attempt timed chapter mock test',
    category: 'test',
    weight: 3.33,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'test_analysis',
    title: 'Analyze chapter test percentile & weak spots',
    category: 'test',
    weight: 3.33,
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'test_reattempt',
    title: 'Reattempt incorrect & skipped questions',
    category: 'test',
    weight: 3.34,
    isCompleted: false,
    priority: 'medium',
  },
];

export const SSC_EXAMS = [
  {
    examId: 'ssc_cgl',
    name: 'SSC CGL',
    fullName: 'Combined Graduate Level Examination',
    shortDescription: 'For Group B & C Gazetted and Non-Gazetted Officer posts in Central Ministries.',
    targetDate: '2026-09-15',
    stages: 'Tier-I (Prelims) & Tier-II (Mains)',
    totalMarks: 200,
    totalQuestions: 100,
  },
  {
    examId: 'ssc_chsl',
    name: 'SSC CHSL',
    fullName: 'Combined Higher Secondary Level (10+2)',
    shortDescription: 'For Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).',
    targetDate: '2026-07-20',
    stages: 'Tier-I & Tier-II',
    totalMarks: 200,
    totalQuestions: 100,
  },
  {
    examId: 'ssc_mts',
    name: 'SSC MTS & Havaldar',
    fullName: 'Multi-Tasking (Non-Technical) Staff',
    shortDescription: 'For General Central Service Group C non-gazetted, non-ministerial posts.',
    targetDate: '2026-10-10',
    stages: 'Computer Based Examination (Session 1 & 2)',
    totalMarks: 270,
    totalQuestions: 90,
  },
  {
    examId: 'ssc_cpo',
    name: 'SSC CPO',
    fullName: 'Central Police Organisation Sub-Inspector',
    shortDescription: 'For Sub-Inspector (SI) in Delhi Police and Central Armed Police Forces (CAPFs).',
    targetDate: '2026-06-25',
    stages: 'Paper-I, PET/PST & Paper-II',
    totalMarks: 200,
    totalQuestions: 200,
  },
  {
    examId: 'ssc_gd',
    name: 'SSC GD Constable',
    fullName: 'General Duty Constable',
    shortDescription: 'For Constables in BSF, CISF, CRPF, SSB, ITBP, AR, SSF, and NCB.',
    targetDate: '2026-11-15',
    stages: 'Computer Based Exam & Physical Efficiency Test',
    totalMarks: 160,
    totalQuestions: 80,
  },
];

export const SSC_SUBJECTS = [
  {
    subjectId: 'maths',
    name: 'Quantitative Aptitude',
    shortName: 'Maths',
    icon: 'Calculator',
    color: '#3b82f6', // Blue
    description: 'Arithmetic & Advanced Mathematics for SSC CGL Tier 1 & Tier 2',
    weightage: 25,
    categories: ['Arithmetic', 'Advanced Maths'],
  },
  {
    subjectId: 'reasoning',
    name: 'General Intelligence & Reasoning',
    shortName: 'Reasoning',
    icon: 'Brain',
    color: '#8b5cf6', // Violet
    description: 'Verbal, Analytical & Non-Verbal Logic Reasoning',
    weightage: 25,
    categories: ['Verbal Reasoning', 'Non-Verbal Reasoning', 'Analytical Reasoning'],
  },
  {
    subjectId: 'english',
    name: 'English Language & Comprehension',
    shortName: 'English',
    icon: 'BookOpen',
    color: '#10b981', // Emerald
    description: 'Vocabulary, Grammar Rules, and Reading Comprehension',
    weightage: 25,
    categories: ['Vocabulary', 'Grammar', 'Comprehension'],
  },
  {
    subjectId: 'gk',
    name: 'General Awareness / GK',
    shortName: 'General Awareness',
    icon: 'Globe',
    color: '#f59e0b', // Amber
    description: 'History, Polity, Geography, Economics, General Science, Static GK & Current Affairs',
    weightage: 25,
    categories: ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Static GK', 'Current Affairs'],
  },
];

export const SSC_CHAPTERS = [
  // ==========================================
  // 1. QUANTITATIVE APTITUDE (25 Chapters)
  // ==========================================
  { id: 'math_1', subjectId: 'maths', name: 'Number System', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_2', subjectId: 'maths', name: 'Simplification', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_3', subjectId: 'maths', name: 'LCM & HCF', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_4', subjectId: 'maths', name: 'Percentage', category: 'Arithmetic', weightage: 'Very High' },
  { id: 'math_5', subjectId: 'maths', name: 'Ratio & Proportion', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_6', subjectId: 'maths', name: 'Average', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_7', subjectId: 'maths', name: 'Profit & Loss', category: 'Arithmetic', weightage: 'Very High' },
  { id: 'math_8', subjectId: 'maths', name: 'Discount', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_9', subjectId: 'maths', name: 'Simple Interest', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_10', subjectId: 'maths', name: 'Compound Interest', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_11', subjectId: 'maths', name: 'Partnership', category: 'Arithmetic', weightage: 'Low' },
  { id: 'math_12', subjectId: 'maths', name: 'Mixture & Alligation', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_13', subjectId: 'maths', name: 'Time & Work', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_14', subjectId: 'maths', name: 'Pipes & Cisterns', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_15', subjectId: 'maths', name: 'Time, Speed & Distance', category: 'Arithmetic', weightage: 'High' },
  { id: 'math_16', subjectId: 'maths', name: 'Boats & Streams', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_17', subjectId: 'maths', name: 'Trains', category: 'Arithmetic', weightage: 'Medium' },
  { id: 'math_18', subjectId: 'maths', name: 'Algebra', category: 'Advanced Maths', weightage: 'Very High' },
  { id: 'math_19', subjectId: 'maths', name: 'Geometry', category: 'Advanced Maths', weightage: 'Very High' },
  { id: 'math_20', subjectId: 'maths', name: 'Mensuration (2D & 3D)', category: 'Advanced Maths', weightage: 'Very High' },
  { id: 'math_21', subjectId: 'maths', name: 'Trigonometry & Heights/Distances', category: 'Advanced Maths', weightage: 'Very High' },
  { id: 'math_22', subjectId: 'maths', name: 'Data Interpretation (DI)', category: 'Arithmetic', weightage: 'Very High' },
  { id: 'math_23', subjectId: 'maths', name: 'Statistics', category: 'Advanced Maths', weightage: 'Medium' },
  { id: 'math_24', subjectId: 'maths', name: 'Probability', category: 'Advanced Maths', weightage: 'Medium' },
  { id: 'math_25', subjectId: 'maths', name: 'Permutation & Combination', category: 'Advanced Maths', weightage: 'Low' },

  // ==========================================
  // 2. GENERAL INTELLIGENCE & REASONING (25 Chapters)
  // ==========================================
  { id: 'reas_1', subjectId: 'reasoning', name: 'Analogy', category: 'Verbal Reasoning', weightage: 'Very High' },
  { id: 'reas_2', subjectId: 'reasoning', name: 'Classification', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_3', subjectId: 'reasoning', name: 'Series (Number & Alphabet)', category: 'Verbal Reasoning', weightage: 'Very High' },
  { id: 'reas_4', subjectId: 'reasoning', name: 'Coding-Decoding', category: 'Verbal Reasoning', weightage: 'Very High' },
  { id: 'reas_5', subjectId: 'reasoning', name: 'Blood Relations', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_6', subjectId: 'reasoning', name: 'Direction Sense', category: 'Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_7', subjectId: 'reasoning', name: 'Ranking & Order', category: 'Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_8', subjectId: 'reasoning', name: 'Order & Sequence', category: 'Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_9', subjectId: 'reasoning', name: 'Syllogism', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_10', subjectId: 'reasoning', name: 'Venn Diagrams', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_11', subjectId: 'reasoning', name: 'Statement & Conclusion', category: 'Analytical Reasoning', weightage: 'Medium' },
  { id: 'reas_12', subjectId: 'reasoning', name: 'Statement & Assumption', category: 'Analytical Reasoning', weightage: 'Medium' },
  { id: 'reas_13', subjectId: 'reasoning', name: 'Mathematical Operations', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_14', subjectId: 'reasoning', name: 'Missing Number', category: 'Verbal Reasoning', weightage: 'High' },
  { id: 'reas_15', subjectId: 'reasoning', name: 'Non-Verbal Series', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_16', subjectId: 'reasoning', name: 'Figure Classification', category: 'Non-Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_17', subjectId: 'reasoning', name: 'Mirror Images', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_18', subjectId: 'reasoning', name: 'Water Images', category: 'Non-Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_19', subjectId: 'reasoning', name: 'Paper Folding', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_20', subjectId: 'reasoning', name: 'Paper Cutting', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_21', subjectId: 'reasoning', name: 'Embedded Figures', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_22', subjectId: 'reasoning', name: 'Counting of Figures', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_23', subjectId: 'reasoning', name: 'Dice', category: 'Non-Verbal Reasoning', weightage: 'High' },
  { id: 'reas_24', subjectId: 'reasoning', name: 'Cubes', category: 'Non-Verbal Reasoning', weightage: 'Medium' },
  { id: 'reas_25', subjectId: 'reasoning', name: 'Logical Reasoning & Deduction', category: 'Analytical Reasoning', weightage: 'Medium' },

  // ==========================================
  // 3. ENGLISH LANGUAGE & COMPREHENSION
  // ==========================================
  // Vocabulary
  { id: 'eng_1', subjectId: 'english', name: 'Synonyms', category: 'Vocabulary', weightage: 'Very High' },
  { id: 'eng_2', subjectId: 'english', name: 'Antonyms', category: 'Vocabulary', weightage: 'Very High' },
  { id: 'eng_3', subjectId: 'english', name: 'One Word Substitution (OWS)', category: 'Vocabulary', weightage: 'Very High' },
  { id: 'eng_4', subjectId: 'english', name: 'Idioms & Phrases', category: 'Vocabulary', weightage: 'Very High' },
  { id: 'eng_5', subjectId: 'english', name: 'Spelling Correction & Errors', category: 'Vocabulary', weightage: 'High' },
  { id: 'eng_6', subjectId: 'english', name: 'Root Words & Vocabulary Building', category: 'Vocabulary', weightage: 'High' },

  // Grammar
  { id: 'eng_7', subjectId: 'english', name: 'Parts of Speech Overview', category: 'Grammar', weightage: 'Medium' },
  { id: 'eng_8', subjectId: 'english', name: 'Noun & Its Rules', category: 'Grammar', weightage: 'High' },
  { id: 'eng_9', subjectId: 'english', name: 'Pronoun', category: 'Grammar', weightage: 'Medium' },
  { id: 'eng_10', subjectId: 'english', name: 'Verb & Modals', category: 'Grammar', weightage: 'High' },
  { id: 'eng_11', subjectId: 'english', name: 'Adjective & Degrees of Comparison', category: 'Grammar', weightage: 'High' },
  { id: 'eng_12', subjectId: 'english', name: 'Adverb', category: 'Grammar', weightage: 'Medium' },
  { id: 'eng_13', subjectId: 'english', name: 'Preposition & Fixed Prepositions', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_14', subjectId: 'english', name: 'Conjunction', category: 'Grammar', weightage: 'Medium' },
  { id: 'eng_15', subjectId: 'english', name: 'Articles (A, An, The)', category: 'Grammar', weightage: 'Medium' },
  { id: 'eng_16', subjectId: 'english', name: 'Subject-Verb Agreement', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_17', subjectId: 'english', name: 'Tenses & Conditionals', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_18', subjectId: 'english', name: 'Active & Passive Voice', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_19', subjectId: 'english', name: 'Direct & Indirect Speech (Narration)', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_20', subjectId: 'english', name: 'Sentence Improvement / Correction', category: 'Grammar', weightage: 'Very High' },
  { id: 'eng_21', subjectId: 'english', name: 'Error Detection / Spotting the Error', category: 'Grammar', weightage: 'Very High' },

  // Comprehension
  { id: 'eng_22', subjectId: 'english', name: 'Reading Comprehension (RC)', category: 'Comprehension', weightage: 'Very High' },
  { id: 'eng_23', subjectId: 'english', name: 'Cloze Test', category: 'Comprehension', weightage: 'Very High' },
  { id: 'eng_24', subjectId: 'english', name: 'Fill in the Blanks', category: 'Comprehension', weightage: 'High' },
  { id: 'eng_25', subjectId: 'english', name: 'Para Jumbles & Sentence Rearrangement', category: 'Comprehension', weightage: 'Very High' },

  // ==========================================
  // 4. GENERAL AWARENESS / GK
  // ==========================================
  // History
  { id: 'gk_1', subjectId: 'gk', name: 'Ancient History', category: 'History', weightage: 'High' },
  { id: 'gk_2', subjectId: 'gk', name: 'Medieval History', category: 'History', weightage: 'Medium' },
  { id: 'gk_3', subjectId: 'gk', name: 'Modern History', category: 'History', weightage: 'Very High' },
  { id: 'gk_4', subjectId: 'gk', name: 'Indian Freedom Movement & Gandhian Era', category: 'History', weightage: 'Very High' },

  // Geography
  { id: 'gk_5', subjectId: 'gk', name: 'Physical Geography (Earth, Solar System)', category: 'Geography', weightage: 'Medium' },
  { id: 'gk_6', subjectId: 'gk', name: 'Indian Geography (States, Borders)', category: 'Geography', weightage: 'High' },
  { id: 'gk_7', subjectId: 'gk', name: 'World Geography (Continents, Oceans)', category: 'Geography', weightage: 'Medium' },
  { id: 'gk_8', subjectId: 'gk', name: 'Rivers, Lakes & Drainage System', category: 'Geography', weightage: 'Very High' },
  { id: 'gk_9', subjectId: 'gk', name: 'Mountains, Passes & Plateaus', category: 'Geography', weightage: 'High' },
  { id: 'gk_10', subjectId: 'gk', name: 'Climate, Monsoons & Seasons', category: 'Geography', weightage: 'Medium' },
  { id: 'gk_11', subjectId: 'gk', name: 'Soil & Vegetation', category: 'Geography', weightage: 'Medium' },
  { id: 'gk_12', subjectId: 'gk', name: 'Agriculture & Cropping Patterns', category: 'Geography', weightage: 'Medium' },
  { id: 'gk_13', subjectId: 'gk', name: 'Natural Resources, Minerals & Energy', category: 'Geography', weightage: 'Medium' },

  // Polity
  { id: 'gk_14', subjectId: 'gk', name: 'Constitution Framework & Preamble', category: 'Polity', weightage: 'Very High' },
  { id: 'gk_15', subjectId: 'gk', name: 'Fundamental Rights & Duties', category: 'Polity', weightage: 'Very High' },
  { id: 'gk_16', subjectId: 'gk', name: 'Parliament (Lok Sabha & Rajya Sabha)', category: 'Polity', weightage: 'Very High' },
  { id: 'gk_17', subjectId: 'gk', name: 'President & Prime Minister', category: 'Polity', weightage: 'High' },
  { id: 'gk_18', subjectId: 'gk', name: 'Judiciary: Supreme Court & High Courts', category: 'Polity', weightage: 'High' },
  { id: 'gk_19', subjectId: 'gk', name: 'Election System & Commission', category: 'Polity', weightage: 'Medium' },
  { id: 'gk_20', subjectId: 'gk', name: 'Constitutional & Non-Constitutional Bodies', category: 'Polity', weightage: 'High' },
  { id: 'gk_21', subjectId: 'gk', name: 'Important Articles, Schedules & Amendments', category: 'Polity', weightage: 'Very High' },

  // Economics
  { id: 'gk_22', subjectId: 'gk', name: 'Basic Economics (Demand, Supply, Market)', category: 'Economics', weightage: 'Medium' },
  { id: 'gk_23', subjectId: 'gk', name: 'Indian Economy & Five Year Plans', category: 'Economics', weightage: 'Medium' },
  { id: 'gk_24', subjectId: 'gk', name: 'Banking Sector, RBI & Monetary Policy', category: 'Economics', weightage: 'High' },
  { id: 'gk_25', subjectId: 'gk', name: 'Inflation, GDP & National Income', category: 'Economics', weightage: 'High' },
  { id: 'gk_26', subjectId: 'gk', name: 'Union Budget & Fiscal Policy', category: 'Economics', weightage: 'High' },
  { id: 'gk_27', subjectId: 'gk', name: 'Taxation System & GST', category: 'Economics', weightage: 'Medium' },

  // Science
  { id: 'gk_28', subjectId: 'gk', name: 'Physics (Units, Motion, Optics, Electricity)', category: 'Science', weightage: 'High' },
  { id: 'gk_29', subjectId: 'gk', name: 'Chemistry (Elements, Acids/Bases, Reactions)', category: 'Science', weightage: 'High' },
  { id: 'gk_30', subjectId: 'gk', name: 'Biology: Cell, Genetics, Classification', category: 'Science', weightage: 'Very High' },
  { id: 'gk_31', subjectId: 'gk', name: 'Human Body Systems & Diseases/Vitamins', category: 'Science', weightage: 'Very High' },
  { id: 'gk_32', subjectId: 'gk', name: 'Environment, Ecology & Biodiversity', category: 'Science', weightage: 'High' },
  { id: 'gk_33', subjectId: 'gk', name: 'Everyday Science & Inventions', category: 'Science', weightage: 'Medium' },

  // Static GK
  { id: 'gk_34', subjectId: 'gk', name: 'National Parks, Biosphere & Sanctuaries', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_35', subjectId: 'gk', name: 'Important Days, Themes & Weeks', category: 'Static GK', weightage: 'High' },
  { id: 'gk_36', subjectId: 'gk', name: 'Books, Authors & Autobiographies', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_37', subjectId: 'gk', name: 'Awards, Honours & Nobel Prizes', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_38', subjectId: 'gk', name: 'Sports, Trophies, Terms & Olympics', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_39', subjectId: 'gk', name: 'Folk Dances, Classical Dances & Festivals', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_40', subjectId: 'gk', name: 'Countries, Capitals & Currencies', category: 'Static GK', weightage: 'High' },
  { id: 'gk_41', subjectId: 'gk', name: 'International Organizations & Headquarters', category: 'Static GK', weightage: 'Very High' },
  { id: 'gk_42', subjectId: 'gk', name: 'Famous Personalities & First in India', category: 'Static GK', weightage: 'High' },

  // Current Affairs (Framework)
  { id: 'gk_43', subjectId: 'gk', name: 'Government Schemes & Portals', category: 'Current Affairs', weightage: 'Very High' },
  { id: 'gk_44', subjectId: 'gk', name: 'Latest Appointments & Who is Who', category: 'Current Affairs', weightage: 'High' },
  { id: 'gk_45', subjectId: 'gk', name: 'Sports Tournaments & Winners (Current)', category: 'Current Affairs', weightage: 'Very High' },
  { id: 'gk_46', subjectId: 'gk', name: 'National & International Summits', category: 'Current Affairs', weightage: 'High' },
  { id: 'gk_47', subjectId: 'gk', name: 'Military Exercises & Defence News', category: 'Current Affairs', weightage: 'High' },
  { id: 'gk_48', subjectId: 'gk', name: 'Monthly Current Affairs Digest', category: 'Current Affairs', weightage: 'Very High' },
];
