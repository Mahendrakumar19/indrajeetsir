import type { Metadata } from 'next';
import DisclaimersPage from '../disclaimer/page';

export const metadata: Metadata = {
  title: 'Cookie Policy | Indrajeet Sir UPSC Mentorship',
  description: 'Official cookie and session usage guidelines for Indrajeet Sir UPSC Mentorship portal.',
};

export default function CookiePolicy() {
  return <DisclaimersPage />;
}
