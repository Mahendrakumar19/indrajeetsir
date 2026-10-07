export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  attempt?: string;
  token?: string;
}

// ── Student Auth Storage ───────────────────────────────────────────────────
export function getStudentSession(): StudentUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('indrajeet_student_session');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStudentSession(user: StudentUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('indrajeet_student_session', JSON.stringify(user));
}

export function clearStudentSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('indrajeet_student_session');
}

// ── Admin Auth Storage ────────────────────────────────────────────────────
export function getAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('indrajeet_admin_authenticated') === 'true';
}

export function setAdminSession(authStatus: boolean): void {
  if (typeof window === 'undefined') return;
  if (authStatus) {
    localStorage.setItem('indrajeet_admin_authenticated', 'true');
  } else {
    localStorage.removeItem('indrajeet_admin_authenticated');
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('indrajeet_admin_authenticated');
}
