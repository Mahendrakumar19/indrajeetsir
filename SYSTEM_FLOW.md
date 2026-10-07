# 🇮🇳 Indrajeet Sir UPSC — System Architecture & Workflow Document

**Application Name:** Indrajeet Sir UPSC  
**Platform Scope:** 1:1 Live UPSC Mentorship & Personal Guidance  
**Components:** Web Frontend (Next.js) + Student Mobile App (Flutter) + Backend API (NestJS/Prisma)  
**Theme:** Light Mode (White background `#ffffff`) / Dark Mode (Navy Blue background `#0f172a`)  
**Navigation:** iOS Floating Glassmorphic Dock  

---

## 1. System Overview

`Indrajeet Sir UPSC` is a specialized, white-label educational platform focused strictly on **1:1 Live Mentorship Sessions** and **Direct Student-to-Mentor Communication**.

```text
                        ┌──────────────────────────────┐
                        │     Indrajeet Sir UPSC       │
                        │    Public Web Landing Page   │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │      Student Authentication  │
                        │     Login / Registration     │
                        └──────────────┬───────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
                ▼                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│    1:1 Live Video Sessions   │              │   Direct Student-to-Mentor   │
│   (Google Meet / Zoom Links) │              │          Chat System         │
└──────────────────────────────┘              └──────────────────────────────┘
                ▲                                             ▲
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │
                        ┌──────────────┴───────────────┐
                        │     Passcode Protected       │
                        │    Web Admin Portal (/admin) │
                        └──────────────────────────────┘
```

---

## 2. Core User Flows

### A. Student User Flow (Web & Mobile App)

```text
                  [ Student Opens App / Website ]
                                 │
                                 ▼
                     [ Home Dashboard Screen ]
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
[ View 1:1 Live Sessions ]  [ Meet Indrajeet Sir ]   [ Direct Mentor Chat ]
        │                                                 │
        ▼                                                 ▼
[ Click "Join 1:1 Live" ]                         [ Ask UPSC Doubts ]
        │                                                 │
        ▼                                                 ▼
[ Redirects to Meet/Zoom ]                         [ Indrajeet Sir Replies ]
```

1. **Student Registration / Login**:
   - Accesses student portal via `/login` or `/register` (or guest student mode).
2. **Dashboard Overview**:
   - Displays assigned personal mentor (**Indrajeet Sir**).
   - Banner for active **LIVE NOW** 1:1 session with direct join action.
3. **1:1 Live Video Mentorship**:
   - Students view scheduled 1:1 sessions (Title, Scheduled Time, Mentor Name).
   - Tapping **"Join 1:1 Live"** opens the dedicated Google Meet or Zoom meeting link.
4. **1:1 Mentor Chat System**:
   - Students send private questions regarding UPSC Mains strategy directly to Indrajeet Sir.
   - View chat history and mentor replies in real-time.

---

### B. Admin User Flow (Indrajeet Sir / Mentorship Director)

```text
                   [ Navigate to /admin Route ]
                                │
                                ▼
                   [ Admin Passcode Lock Screen ]
                   (Enter: admin123 / admin)
                                │
                                ▼
                   [ Authenticated Admin Console ]
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
        ▼                                               ▼
[ 1:1 Live Sessions Scheduler ]               [ Student Chat Console ]
        │                                               │
        ├─ Enter Session Agenda                         ├─ Select Student Thread
        ├─ Enter Student Name                           ├─ Read Student Query
        ├─ Select Mentor (Indrajeet Sir)                └─ Type & Send Reply
        ├─ Pick Date & Time
        └─ Input Google Meet / Zoom Link
```

1. **Restricted Admin Gate**:
   - `/admin` route is completely hidden from public/student navigation bars.
   - Requires Passcode Authentication (`admin123`).
2. **Schedule 1:1 Live Sessions**:
   - Admin schedules 1:1 video sessions specifically assigned to individual students.
   - Publishes meeting links for Google Meet or Zoom.
3. **Manage Student Communications**:
   - Admin views all active student chat threads.
   - Responds directly to student questions on strategy and preparation.

---

## 3. Technology Stack & Directory Structure

```text
d:\Live-Class-App\
├── SYSTEM_FLOW.md        # Complete System Architecture & Workflow Document
├── frontend/             # Next.js 16 Web Application (Landing Page + Protected /admin)
│   ├── src/app/
│   │   ├── page.tsx      # Public Landing Page with Floating iOS Dock & 1:1 Sessions
│   │   ├── home.css      # Vanilla CSS styling with White/Navy Blue theme support
│   │   ├── admin/
│   │   │   ├── page.tsx  # Protected Admin Portal (Passcode Gate + Session Scheduler + Chat)
│   │   │   └── admin.css # Admin console layout & lock screen styles
│   │   ├── login/        # Student Login page
│   │   └── register/     # Student Registration page
│   └── package.json
│
├── student_app/          # Flutter Mobile Application (iOS/Android)
│   ├── lib/
│   │   └── main.dart     # Full Flutter app with Cupertino Floating Glass Dock, 1:1 Live & Chat
│   ├── test/
│   └── pubspec.yaml
│
└── backend/              # NestJS REST API & Database Layer
    ├── src/
    │   ├── main.ts       # NestJS Entry point (Configured on Port 4000)
    │   └── app.controller.ts # REST Endpoints for Auth, 1:1 Live Sessions, and Chat
    ├── prisma/
    │   └── schema.prisma # PostgreSQL Multi-tenant database schema
    └── package.json
```

---

## 4. Key UI & Aesthetics Highlights

* **iOS Floating Dock Navigation Bar**:
  - Web & Mobile apps feature a custom frosted glassmorphic pill bar with smooth fluid tab physics.
* **White & Navy Blue Theme System**:
  - Light mode uses pure white background (`#ffffff`).
  - Dark mode uses deep navy blue background (`#0f172a` / `#0F172A`).
* **Zero External Dependencies / Clean Builds**:
  - Mobile app verified clean via `flutter analyze` (**0 issues**).
  - Web frontend compiled successfully via `npm run build` (**0 errors**).
