# Basic Educational Platform — MVP PRD

**Version:** 1.0
**Product Type:** Basic White-Label Educational Platform
**Platforms:** Android + Web Admin + Public Landing Page
**Backend:** REST API + Database + File Storage

---

## 1. Objective

Build a simple, reusable educational application that can be sold to different educational institutes.

The system will provide:

* Public landing page
* Student Android application
* Course enrollment
* PDF/video course content
* Live classes
* Mains copy submission and evaluation
* Admin panel
* Backend APIs
* Organization branding/configuration

The initial version must remain simple and inexpensive while having an architecture that can support multiple customers later.

---

# 2. System Components

The MVP consists of four components:

```text
┌──────────────────────────────┐
│       Public Landing Page    │
│          Web / Next.js       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Backend API         │
│      Node.js / NestJS        │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────┐
│   Database   │  │ File Storage │
│ MySQL/PGSQL  │  │ MinIO / S3   │
└──────────────┘  └──────────────┘
        ▲
        │
┌───────┴──────────────────────┐
│       Admin Web Panel        │
└──────────────────────────────┘

        ▲
        │
┌───────┴──────────────────────┐
│      Student Android App     │
│            Flutter           │
└──────────────────────────────┘
```

---

# 3. Public Landing Page

The landing page is the public-facing website for the educational institute.

## Required Sections

### Header

* Organization logo
* Organization name
* Home
* Courses
* Live Classes
* About
* Contact
* Login

### Hero Section

* Organization branding
* Main headline
* Short description
* Primary CTA
* Secondary CTA
* Optional banner image

Example:

> Learn. Practice. Improve.

Buttons:

* Explore Courses
* Student Login

### About Section

* Organization introduction
* Short description
* Mission/education information

### Courses Section

Display selected courses:

* Course image
* Course name
* Short description
* Enroll/View button

### Live Classes Section

Display:

* Upcoming live classes
* Class title
* Date
* Time
* Course
* Login/join CTA

Students must authenticate before joining a protected class.

### Features Section

Example:

* Expert Courses
* Video Learning
* PDF Study Material
* Live Classes
* Mains Evaluation

### Contact Section

* Phone
* Email
* Address
* Website/social links if configured

### Footer

* Logo
* Organization name
* Quick links
* Contact information
* Copyright
* Privacy Policy
* Terms

---

# 4. Student Android Application

## Authentication

* Register
* Login
* Logout
* Forgot password/basic reset

## Home

Display:

* Organization logo/name
* Featured courses
* My courses
* Upcoming live class

## Courses

Student can:

* Browse courses
* View course details
* Enroll
* View enrolled courses

## Course Details

Display:

* Course title
* Thumbnail
* Description
* Instructor
* Sections/modules
* Available content

## Course Content

Initial supported content:

* PDF
* MP4/video
* Images/documents

Student can open/watch content belonging to enrolled courses.

---

# 5. Enrollment

For MVP, enrollment can be free or controlled by the admin.

Student flow:

```text
Course
   ↓
Course Details
   ↓
Enroll
   ↓
My Courses
   ↓
Access Content
```

Admin can also manually enroll students.

Payment integration is not part of this MVP.

---

# 6. Live Classes

Live classes are a core feature.

## Admin

Admin can create:

* Class title
* Course
* Description
* Date
* Start time
* Duration
* Meeting URL
* Status

Example:

```text
Live Class
UPSC Mains Answer Writing

Course:
UPSC Mains 2027

Date:
15 October 2026

Time:
7:00 PM

Meeting:
Google Meet / Zoom URL
```

## Student

Student sees:

* Upcoming classes
* Class details
* Date/time
* Course
* Join Class button

The Join Class button opens the external meeting platform.

### Important MVP limitation

The platform will **not build its own video-conferencing system**.

No custom:

* WebRTC
* Video server
* Audio server
* Live streaming infrastructure
* In-app video conference

Live classes will use external meeting links such as Google Meet or Zoom.

---

# 7. Mains Copy Evaluation

Basic Mains evaluation is included.

## Student

Student can:

* View available Mains assignment
* View instructions
* Upload answer copy
* Submit PDF/images
* View submission status
* View marks
* View evaluator feedback

## Submission Status

```text
Submitted
    ↓
Under Evaluation
    ↓
Evaluated
```

## Admin/Evaluator

Can:

* View submissions
* Open/download student copy
* Enter marks
* Add feedback
* Mark evaluation completed

Advanced handwritten annotation and AI evaluation are excluded.

---

# 8. Admin Panel

Web-based admin panel.

## Admin Login

* Secure login
* Logout
* Role-based access

## Dashboard

Display:

* Total students
* Total courses
* Total enrollments
* Upcoming live classes
* Pending Mains evaluations

---

# 9. Student Management

Admin can:

* Add student
* View students
* Edit student
* Activate/deactivate student
* View enrolled courses
* View submissions

---

# 10. Course Management

Admin can:

* Create course
* Edit course
* Publish/unpublish course
* Delete/deactivate course
* Upload thumbnail
* Add description
* Add instructor

---

# 11. Course Content Management

Admin can:

* Create sections
* Add PDF
* Add MP4/video
* Add documents/images
* Add text notes
* Reorder content
* Edit content
* Delete content

Example:

```text
Course
│
├── Module 1
│   ├── Introduction PDF
│   └── Lecture 1.mp4
│
├── Module 2
│   ├── Notes.pdf
│   └── Lecture 2.mp4
│
└── Module 3
    └── Lecture 3.mp4
```

---

# 12. Enrollment Management

Admin can:

* View enrollments
* Manually enroll student
* Remove enrollment
* View students enrolled in a course

---

# 13. Live Class Management

Admin can:

* Create live class
* Select course
* Set date/time
* Add meeting URL
* Edit class
* Cancel class
* Delete class
* View upcoming classes

---

# 14. Mains Evaluation Management

Admin can:

* Create Mains paper/assignment
* Add title
* Add instructions
* Select course
* Set submission deadline
* View submissions
* Assign evaluator
* Enter marks
* Add feedback
* Complete evaluation

---

# 15. Branding

The MVP should support basic organization branding.

Admin/platform configuration:

* Organization name
* Logo
* Primary color
* Secondary color
* Contact information
* Landing-page content

The same application should be capable of being configured for different educational organizations.

---

# 16. Backend

Backend should expose REST APIs for:

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Courses

```text
GET    /courses
GET    /courses/:id
POST   /courses
PATCH  /courses/:id
DELETE /courses/:id
```

### Enrollment

```text
POST   /courses/:id/enroll
GET    /users/me/courses
GET    /courses/:id/students
```

### Content

```text
GET    /courses/:id/content
POST   /courses/:id/content
PATCH  /content/:id
DELETE /content/:id
```

### Live Classes

```text
GET    /live-classes
POST   /live-classes
PATCH  /live-classes/:id
DELETE /live-classes/:id
```

### Mains

```text
GET    /mains
POST   /mains
POST   /mains/:id/submissions
GET    /mains/submissions
POST   /submissions/:id/evaluate
```

The exact API structure can be adjusted during technical implementation.

---

# 17. Database

Minimum entities:

```text
users
courses
course_sections
course_contents
enrollments
live_classes
mains_assignments
mains_submissions
evaluations
organizations
```

Each organization-owned record should contain:

```text
organization_id
```

This allows the system to become multi-tenant without rebuilding the application later.

---

# 18. File Storage

PDFs, videos and submitted answer copies should be stored in object storage.

Recommended:

* MinIO
* S3-compatible storage

Example:

```text
storage/
├── organization/
│   ├── courses/
│   ├── videos/
│   ├── pdfs/
│   └── mains-submissions/
```

The database stores file metadata and references, not the actual large files.

---

# 19. Recommended Technology

### Android

**Flutter**

### Landing Page

**Next.js**

### Admin Panel

**Next.js**

### Backend

**NestJS / Node.js**

### Database

**MySQL or PostgreSQL**

### ORM

**Prisma**

### Storage

**MinIO / S3**

### Authentication

**JWT**

### Live Classes

**Google Meet / Zoom links**

---

# 20. MVP Exclusions

The following are intentionally excluded:

* Payment gateway
* Subscription billing
* Custom live streaming
* WebRTC
* Chat
* Attendance
* Quiz system
* Assignment system beyond Mains
* Certificates
* AI evaluation
* Handwritten annotation
* Advanced analytics
* Video DRM
* Offline video downloads
* iOS application
* Complex notification system

---

# 21. MVP User Flow

```text
                LANDING PAGE
                     │
          ┌──────────┴──────────┐
          │                     │
       Courses             Live Classes
          │                     │
          ▼                     ▼
      Student Login        Student Login
          │                     │
          ▼                     ▼
       Enroll               Join Class
          │
          ▼
      My Courses
          │
          ▼
    PDF / Video Content
          │
          ▼
   Mains Assignment
          │
          ▼
    Upload Answer Copy
          │
          ▼
      Evaluation
          │
          ▼
    Marks + Feedback
```

---

# 22. MVP Success Criteria

The application is complete when:

1. Admin can log in.
2. Admin can create courses.
3. Admin can upload PDF/video content.
4. Students can register/login.
5. Students can view and enroll in courses.
6. Students can access course content.
7. Admin can schedule live classes.
8. Students can view upcoming live classes.
9. Students can join an external live-class link.
10. Admin can create Mains assignments.
11. Students can upload answer copies.
12. Admin/evaluator can evaluate submissions.
13. Students can view marks and feedback.
14. Admin can manage basic organization branding.
15. Public landing page displays the organization's information, courses and live classes.
16. The backend securely connects the Android app, landing page and admin panel.
17. Organization data is isolated through `organization_id`.

---

# 23. Product Architecture Principle

The MVP should be built as a **reusable product**, not a one-off application.

```text
             CORE PLATFORM
                   │
       ┌───────────┼───────────┐
       │           │           │
    Android     Admin       Landing
       │           │           │
       └───────────┼───────────┘
                   │
              Backend API
                   │
          ┌────────┴────────┐
          │                 │
       Database          Storage
```

The initial implementation should remain simple, but the codebase must leave room for:

* Multiple organizations
* Different branding
* Feature-based access
* Different plans
* Additional educational modules

The objective is to build the **smallest commercially usable version first**, while avoiding architectural decisions that would make future white-label expansion expensive.
