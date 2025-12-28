# 🚀 RISE-Q Form System - Production Setup Guide

## Overview
This system supports both **JSON file storage** (development) and **Supabase** (production) for database operations.

---

## 📦 Quick Start (Development Mode)

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Start backend server
node server/index.js

# 3. Start frontend (new terminal)
npm run dev

# 4. Open browser
http://localhost:8081
```

---

## 🗄️ Supabase Setup (Production Mode)

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and wait for setup

### Step 2: Run Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy entire content from `supabase/schema.sql`
3. Paste and click **Run**

This creates:
- `uids` - Main UID tracking table
- `attendance` - Attendance sheet data
- `students` - Individual student submissions
- `moderation_pages` - Moderator form data
- `activity_log` - Audit trail

### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **service_role key** (NOT the anon key for backend)

### Step 4: Configure Environment

**Backend** (`server/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend** (`.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE=https://your-backend-domain.com
```

### Step 5: Deploy

**Backend (Railway/Render/Vercel):**
```bash
cd server
# Set environment variables in your hosting platform
# Deploy
```

**Frontend (Vercel):**
```bash
# Connect GitHub repo
# Add environment variables
# Deploy
```

---

## 🔧 Database Schema

### UIDs Table
| Column | Type | Description |
|--------|------|-------------|
| uid | VARCHAR(10) | Unique ID (1001, 2001, 3001...) |
| status | VARCHAR(50) | pending, assessor_started, user_submitted, ready_for_moderation, moderator_review, sent_to_admin, approved |
| assessor_name | VARCHAR(255) | Assigned assessor name |
| assessor_number | VARCHAR(20) | Assessor phone |
| assessor_age | VARCHAR(10) | Assessor age |
| student_count | INTEGER | Number of students under this UID |
| form_link | TEXT | Generated user form link |

### Students Table
| Column | Type | Description |
|--------|------|-------------|
| student_id | VARCHAR(50) | Unique student submission ID |
| uid | VARCHAR(10) | Parent UID (foreign key) |
| learner_name | VARCHAR(255) | Student name |
| company_name | VARCHAR(255) | Company name |
| form_data | JSONB | All 17 form pages data |
| status | VARCHAR(50) | pending_review, approved, rejected |

### Attendance Table
| Column | Type | Description |
|--------|------|-------------|
| uid | VARCHAR(10) | Related UID |
| date_from | DATE | Training start date |
| date_to | DATE | Training end date |
| client_name | VARCHAR(255) | Client name |
| attendees | JSONB | Array of attendee data |

### Moderation Pages Table
| Column | Type | Description |
|--------|------|-------------|
| uid | VARCHAR(10) | Related UID |
| form_data | JSONB | Moderation pages 1-6 data |
| status | VARCHAR(50) | pending, completed |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Dashboard statistics |
| POST | `/api/uid` | Create new UID |
| GET | `/api/uids` | List all UIDs |
| GET | `/api/uid/:uid` | Get single UID details |
| POST | `/api/attendance/:uid` | Save attendance |
| POST | `/api/user_form/:uid` | Submit user form |
| POST | `/api/moderation/:uid` | Save moderation |
| POST | `/api/send_to_moderator/:uid` | Send to moderator |
| POST | `/api/send_to_admin/:uid` | Send to admin |
| POST | `/api/admin_approve/:uid` | Final approval |
| POST | `/api/qr/:uid` | Generate QR/Link |

---

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `uid_created` | Server→Client | New UID created |
| `attendance_saved` | Server→Client | Attendance saved |
| `user_form_saved` | Server→Client | User form submitted |
| `send_to_moderator` | Server→Client | Sent to moderator |
| `moderation_saved` | Server→Client | Moderation completed |
| `sent_to_admin` | Server→Client | Sent to admin |
| `uid_approved` | Server→Client | Final approval |

---

## 🔐 Security Notes

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use service_role key only on backend** - Never expose in frontend
3. **Enable RLS in Supabase** - Row Level Security is enabled by default
4. **Use HTTPS in production** - Always use secure connections

---

## 📁 Project Structure

```
form/
├── src/                    # Frontend React code
│   ├── components/         # UI Components
│   ├── context/            # React Contexts
│   ├── lib/                # API & Supabase clients
│   └── pages/              # Page components
├── server/                 # Backend Express server
│   ├── index.js            # Main server file
│   ├── data.json           # JSON storage (development)
│   └── .env                # Environment variables
├── supabase/
│   └── schema.sql          # Database schema
├── .env.example            # Frontend env template
└── README.md               # This file
```

---

## 🎯 Workflow

```
1. Admin creates UID (1001) + assigns Assessor
         ↓
2. Assessor fills AttendanceSheet → Generates QR/Link
         ↓
3. Multiple Users fill FormPage 1-17 via link
         ↓
4. Assessor reviews → Sends to Moderator
         ↓
5. Moderator fills ModerationPage 1-6 → Sends to Admin
         ↓
6. Admin Final Review → Approve
```

---

## 🆘 Troubleshooting

**Server not starting?**
- Check if port 4000 is available
- Verify data.json exists and is valid JSON

**Supabase not connecting?**
- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
- Check if tables are created via schema.sql

**Socket not connecting?**
- Ensure VITE_API_BASE points to correct backend URL
- Check CORS settings in server

---

Built with ❤️ for RISE-Q Training System
