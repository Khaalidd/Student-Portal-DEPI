# Student Portal DEPI

A role-based student management portal built with React, Vite, and Supabase. Three user roles — **admin**, **instructor**, and **student** — each with their own dashboard and capabilities.

## Tech Stack

- **Frontend**: React 19, Vite 8, React Router 7, Tailwind CSS 4
- **Backend**: Supabase (Postgres + auto-generated REST API)
- **Validation**: Zod
- **Icons**: lucide-react

## Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd Student-Portal-DEPI
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard under **Settings → API**.

### 3. Set up the database

Run these SQL files in your Supabase SQL Editor **in order**:

1. **`agent-instructions.md`** — copy the full SQL block (lines 179–379) and run it. This creates all 18 tables.
2. **`migration-v2.sql`** — adds `password`, `instructor_id`, `course_id`, `user_id` columns and the `assignments`/`assignment_submissions` tables. Also seeds the initial admin account.

### 4. Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173` and log in with:

- **Email**: `admin@depi.com`
- **Password**: `admin123`

## How It Works

### Admin Flow

1. **Log in** as admin → lands on `/admin/dashboard`
2. **Create users** → click "Add New User" or "Manage Roles" → go to `/admin/users` → create instructor and student accounts with passwords
3. **Create courses** → click "Create Course" → go to `/admin/courses/new` → fill in course details, assign an instructor from the dropdown, add schedule times (day + start/end hour)
4. **Send announcements** → click "System Announcement" → modal opens → message goes to all users' notification inbox

### Instructor Flow

1. **Log in** as an instructor (created by admin) → lands on `/instructor/dashboard`
2. **See assigned courses** → the dashboard shows only courses where this instructor was assigned by the admin
3. **Create assignments** → click "Create Assignment" → modal opens → select a course, add title/description/due date → students see it in their course detail page
4. **Post announcements** → select a course from the dropdown → type a message → "Post Now" sends notifications to all students enrolled in that course
5. **Manage courses** → click into a course → `/instructor/courses/:courseId` → see enrolled students, upcoming sessions, and create/delete assignments inline
6. **Grade students** → go to `/instructor/courses/:courseId/gradebook` → see all enrolled students → click any score cell to edit → saves on blur or Enter

### Student Flow

1. **Log in** as a student (created by admin) → lands on `/student/dashboard`
2. **Browse and register for courses** → click "Register for Spring" or go to `/student/courses` → click "Browse Catalog" → click "Register" on any available course → the course appears in your list and a notification is generated
3. **View schedule** → `/student/schedule` shows your weekly timetable (only for courses you're enrolled in)
4. **View course details** → click into a course → `/student/courses/:courseId` → see materials (weekly PDFs/videos/code), assignments, and grades
5. **Submit assignments** → go to the "Assignments" tab → click "Submit" on an assignment → type your response or paste a file URL (Google Drive, Dropbox, etc.) → submit
6. **Check notifications** → click the bell icon in the top bar → see your last 3 notifications → click "Go to Notification Center" for the full inbox
7. **View grades** → `/student/grades` shows your transcript (N/A if no grades recorded yet)

### Shared Features

- **Profile** (`/profile`) — any logged-in user can update their personal info (name, phone)
- **Notifications** (`/notifications`) — accessible from the bell icon in the top bar, shows all notifications for the logged-in user
- **Logout** — click your avatar → "Sign Out"

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
  api/            → Supabase API functions (one file per resource)
  components/     → Shared UI (AppLayout, SideNavBar, TopAppBar, ProtectedRoute, StatCard)
  context/        → AuthContext (authentication state)
  lib/            → supabaseClient.js (shared Supabase client)
  pages/          → Route-level page components (14 pages)
  validation/     → Zod schemas for form validation
```

## Database Tables

| Table | Purpose |
|---|---|
| `users` | All portal users (students, instructors, admins) + authentication |
| `courses` | Course catalog with instructor assignment |
| `course_students` | Enrollment roster linking students to courses |
| `schedule_classes` | Weekly timetable entries per course |
| `my_courses` | Student's personal enrolled course list |
| `assignments` | Instructor-created assignments per course |
| `assignment_submissions` | Student submissions (text + file URL) |
| `gradebook_entries` | Per-student grade records |
| `notifications` | User notifications and system announcements |
| `semesters` / `semester_courses` | Transcript/grade history |
| `course_weeks` / `course_materials` / `course_files` | Course content structure |
| `course_sessions` | Upcoming class sessions |
| `student_metrics` | Dashboard KPI cards |
| `instructor_alerts` | Instructor sidebar alerts |

## Known Limitations

- **Plaintext passwords** — no hashing; must be replaced before production
- **No Supabase Auth** — uses custom auth against the `users` table directly
- **File attachments are URL-only** — no actual file upload to Supabase Storage
- **No real-time updates** — data fetched on page mount only
- **No pagination** — all records loaded at once

## License

This project was built for educational purposes as part of the DEPI program.
