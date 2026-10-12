# ⚡ HabitFlow — Modern Full-Stack Habit Tracker & SSC Prep SaaS

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/sachinhq/habitflow)

HabitFlow is a modern, production-quality productivity SaaS web application designed for seamless daily, weekly, and monthly habit tracking, comprehensive **SSC Exam Preparation**, and **Health / Weight Management**. Built with **React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Express.js, and MongoDB**, it features dynamic streak calculations, interactive GitHub-style contribution heatmaps, comprehensive charts, level progression, and 1-click demo account access.

---

## ✨ Features

- **📚 SSC Exam Preparation Suite**:
  - Full syllabus coverage for SSC CGL, CHSL, MTS, CPO, and GD.
  - Multi-level hierarchical tracking: Exam → Subject → Chapter → Topic → Checkpoint.
  - Study checkpoint stages: First Reading, Detailed Notes, Practice MCQs, PYQs, Mock Test, Revision 1/2/3.
  - Daily Study Planner, Study Logging with hour counters, and Subject-wise Analytics.
- **⚖️ Health & Weight Management Tracker**:
  - Weekly and daily weigh-in logs with body fat %, waist circumference, and reflection notes.
  - Target weight goals with automatic weekly rate-of-loss/gain calculation and projected target date.
  - Progress trend charts and BMI classification indicator.
- **🔥 Dynamic Frequency-Aware Streak System**:
  - Calculates current streak, best streak, total completed days, and consistency rate on the backend.
  - Frequency support: Daily, Specific Days of Week (e.g. Mon-Fri), Weekly target, Monthly target. Missing an unscheduled day does not break streaks.
- **✅ Today Checklist Page**:
  - Interactive animated checkbox with celebratory micro-interactions and confetti on 100% daily completion.
  - Date switcher to browse past/future days or return to today.
  - Filters: Status (All, Pending, Completed), Life Categories, and Search.
  - Quick notes and reflections for any habit entry.
- **📅 Weekly Tracker Matrix**:
  - Visual matrix showing all habits against days of the week (Mon–Sun).
  - Weekly score %, best performing habit, and habits requiring attention.
  - Seamless navigation across past and future weeks.
- **📈 GitHub-Style Monthly Contribution Heatmap**:
  - 5-tier color intensity heatmap representing completion density.
  - Click any date tile to open a breakdown modal showing completed vs. missed habits.
  - Monthly consistency KPIs and total completions.
- **📊 Analytics & Insights**:
  - Powered by **Recharts**:
    - Daily Completion Rate Trend Area Chart.
    - Category Distribution Donut Chart.
    - Day-of-the-Week Consistency Bar Chart.
  - Timeframe filters: Last 7 Days, Last 30 Days, Last 90 Days.
- **🏆 Lightweight Gamification**:
  - Player level progression, XP points (+15 XP per habit, bonus XP for 100% day, +100 XP for achievements).
  - Milestone Badges: First Step, Action Taker, 7-Day Warrior, 30-Day Legend, Century Club, Well Rounded.
  - Celebratory pop-up modal with particle confetti when unlocking badges.
- **🌓 Theme & Responsive Design**:
  - Polished Light, Dark, and System modes with persistent local storage.
  - Fully responsive: desktop collapsible sidebar and mobile 5-tab bottom navigation bar.
- **🔒 Authentication & Security**:
  - JWT authentication with HTTP-only cookies and Bearer token support.
  - Password hashing via `bcryptjs`.
  - Rate limiting on authentication routes and Helmet security headers.
  - **1-Click Demo Account Login** for instant evaluation without typing credentials.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Lucide React icons
- **State Management**: Zustand
- **Animations**: Framer Motion & Canvas Confetti
- **Charts**: Recharts
- **HTTP Client**: Axios with request/response interceptors
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security & Utilities**: `helmet`, `cors`, `cookie-parser`, `express-rate-limit`, `morgan`

---

## 📂 Project Architecture

```
Habit Tracker/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Card, Modal, Input, Badge, ProgressBar
│   │   │   ├── layout/         # Sidebar, Header, MobileBottomNav, Layout, ProtectedRoute
│   │   │   ├── habits/         # HabitCard, HabitModal, HabitNotesModal
│   │   │   └── gamification/   # AchievementModal
│   │   ├── pages/              # Dashboard, Today, WeeklyView, MonthlyView, Analytics, HabitsManage, Achievements, Settings, Login, Register, ForgotPassword
│   │   ├── store/              # Zustand stores (useAuthStore, useHabitStore, useThemeStore, useNotificationStore)
│   │   ├── services/           # Axios API client with interceptors
│   │   ├── utils/              # constants, iconMap, cn
│   │   ├── App.jsx             # React Router routing
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Tailwind directives & custom scrollbars
│   ├── package.json
│   ├── vite.config.js          # Code-splitting chunks & API proxy
│   └── tailwind.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # auth, habit, completion, analytics, user
│   ├── middleware/             # authMiddleware, errorMiddleware
│   ├── models/                 # User, Habit, HabitCompletion, Achievement
│   ├── routes/                 # auth, habit, completion, analytics, user
│   ├── services/               # streakService, analyticsService, gamificationService
│   ├── utils/                  # dateHelper, seedData
│   ├── test/                   # e2eTest.js (Automated integration suite)
│   ├── server.js               # Express application entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string.

### 1. Install Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install inside `server/` and `client/` individually with `npm install`)*

### 2. Environment Configuration
The backend is preconfigured in `server/.env`. You can modify or create `server/.env` based on `server/.env.example`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/habitflow
JWT_SECRET=habitflow_super_secret_jwt_key_2026_modern_secure
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Realistic Demonstration Data
Populate 7 realistic habits (Morning Walk, Drink Water, Read 20 Pages, Practice Coding, Study DBMS, Sleep Before 11 PM, Mindful Meditation) with 60 days of historical completion data:
```bash
npm run seed
```

### 4. Run the Application

#### Option A: One Single Command (Recommended)
From the root directory (`/Users/sachinkumar/Downloads/Habit Tracker`):
```bash
npm run dev
```
*This starts both the backend API (port 5001) and the frontend Vite server (port 5173) together in one terminal.*

#### Option B: Two Separate Terminals
**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server runs on http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Client runs on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 🔑 Demo Account Credentials

You can use the **"1-Click Demo Account Login"** button on the Login page, or enter:
- **Email**: `alex.demo@habitflow.app`
- **Password**: `password123`

---

## 🧪 Testing & Verification

Run the comprehensive end-to-end integration test suite:
```bash
cd server
node test/e2eTest.js
```
This tests:
1. Server health check
2. User registration & JWT generation
3. Session verification (`/auth/me`)
4. Habit creation with custom target and reminders
5. Daily completion check-off & streak calculation
6. Weekly matrix analytics aggregation
7. Monthly heatmap data generation
8. Timeframe trends for Recharts
9. Achievement unlocks & XP awarding
10. Habit updates & deletions

To verify the client production bundle:
```bash
cd client
npm run build
```

---

## 📡 API Specification Summary

### Authentication (`/api/auth`)
- `POST /register`: Create account
- `POST /login`: Sign in with email & password
- `POST /demo`: 1-Click demo account session
- `POST /logout`: Sign out and clear cookies
- `GET /me`: Get authenticated user profile & XP

### Habits (`/api/habits`)
- `GET /`: Retrieve habits with calculated streak stats for reference date
- `POST /`: Create a new habit
- `GET /:id`: Retrieve single habit with completion history
- `PUT /:id`: Update habit configuration
- `DELETE /:id`: Delete habit and history
- `POST /:id/toggle`: Toggle habit completion for a specific date
- `PUT /:id/notes`: Record reflections or notes for a date

### Analytics (`/api/analytics`)
- `GET /overview`: Dashboard KPI cards data (today %, streaks, weekly %, monthly %)
- `GET /daily`: Daily completion metrics
- `GET /weekly`: 7-day habit matrix
- `GET /monthly`: Month-long contribution heatmap data
- `GET /trends?days=30`: Time-series trends for Recharts (Area, Donut, Bar)

### User & Gamification (`/api/users`)
- `GET /profile`: Get user profile and preferences
- `PUT /profile`: Update name, avatar, and preferences
- `GET /achievements`: Get all milestone badges with unlocked state
- `POST /seed-demo`: Re-seed user account with 60 days of demo data

---

## 🎨 UI/UX Design Details
- **Palette**: Slate, Indigo, Violet, Emerald, Amber, Rose, Cyan.
- **Micro-interactions**: Checkbox scale bounce, smooth Framer Motion list layouts, and subtle status rings.
- **Accessibility**: Semantic HTML5 elements, ARIA labels on buttons, high-contrast text ratios, and keyboard navigation support.
