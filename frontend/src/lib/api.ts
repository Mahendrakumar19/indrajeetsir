export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// 7 days of inactivity limit in milliseconds (7 * 24 * 60 * 60 * 1000)
export const SESSION_INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000;

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  attempt?: string;
  optionalSubject?: string;
  bio?: string;
  avatarKey?: string;
  enrolledCourse?: string;
  token?: string;
  lastActiveAt?: number;
}

// ── Student Auth Storage (7-Day Rolling Inactivity Window) ───────────────────
export function getStudentSession(): StudentUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('indrajeet_student_session');
    if (!data) return null;

    const user: StudentUser = JSON.parse(data);
    const now = Date.now();

    // Check if session has exceeded 7 days of inactivity
    if (user.lastActiveAt && (now - user.lastActiveAt > SESSION_INACTIVITY_LIMIT_MS)) {
      // Inactivity timeout exceeded (7+ days since last user action)
      clearStudentSession();
      return null;
    }

    // Refresh rolling activity timestamp
    user.lastActiveAt = now;
    localStorage.setItem('indrajeet_student_session', JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

export function setStudentSession(user: StudentUser): void {
  if (typeof window === 'undefined') return;
  const userWithTimestamp: StudentUser = {
    ...user,
    lastActiveAt: Date.now(),
  };
  localStorage.setItem('indrajeet_student_session', JSON.stringify(userWithTimestamp));
}

export function touchStudentActivity(): void {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem('indrajeet_student_session');
    if (!data) return;
    const user: StudentUser = JSON.parse(data);
    user.lastActiveAt = Date.now();
    localStorage.setItem('indrajeet_student_session', JSON.stringify(user));
  } catch {}
}

export function clearStudentSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('indrajeet_student_session');
}

// ── Admin Auth Storage (7-Day Rolling Inactivity Window) ────────────────────
export function getAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isAuthed = localStorage.getItem('indrajeet_admin_authenticated') === 'true';
    if (!isAuthed) return false;

    const lastActiveStr = localStorage.getItem('indrajeet_admin_last_active');
    const now = Date.now();

    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (!isNaN(lastActive) && (now - lastActive > SESSION_INACTIVITY_LIMIT_MS)) {
        clearAdminSession();
        return false;
      }
    }

    // Refresh admin activity timestamp
    localStorage.setItem('indrajeet_admin_last_active', now.toString());
    return true;
  } catch {
    return false;
  }
}

export function setAdminSession(authStatus: boolean): void {
  if (typeof window === 'undefined') return;
  if (authStatus) {
    localStorage.setItem('indrajeet_admin_authenticated', 'true');
    localStorage.setItem('indrajeet_admin_last_active', Date.now().toString());
  } else {
    clearAdminSession();
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('indrajeet_admin_authenticated');
  localStorage.removeItem('indrajeet_admin_last_active');
}
