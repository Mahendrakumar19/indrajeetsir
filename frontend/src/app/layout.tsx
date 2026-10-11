import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indrajeetsir.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Indrajeet Sir | 1:1 UPSC & State PCS Mentorship',
    template: '%s | Indrajeet Sir UPSC',
  },
  description: '1:1 UPSC Mentorship by Indrajeet Sir. Line-by-line Mains copy checking, 600+ micro notes, 16 test evaluations, and personal strategy sessions.',
  keywords: [
    'UPSC Mentorship',
    'Indrajeet Sir',
    '1:1 UPSC Guidance',
    'Mains Answer Writing',
    'IAS Mentorship Program',
    'State PCS Coaching',
    'Public Administration Optional',
    'UPSC 2026-27 Preparation',
  ],
  authors: [{ name: 'Indrajeet Sir', url: siteUrl }],
  creator: 'Indrajeet Sir',
  publisher: 'Indrajeet Sir UPSC Mentorship',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Indrajeet Sir | 1:1 UPSC & State PCS Mentorship',
    description: '1:1 UPSC Mentorship by Indrajeet Sir. Line-by-line Mains copy checking, 600+ micro notes, 16 test evaluations, and personal strategy sessions.',
    url: siteUrl,
    siteName: 'Indrajeet Sir UPSC Mentorship',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Indrajeet Sir 1:1 UPSC Mentorship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indrajeet Sir | 1:1 UPSC & State PCS Mentorship',
    description: 'Personalized 1:1 UPSC Mentorship by Indrajeet Sir. Comprehensive guidance for Prelims, Mains answer writing, and Personality Test interview.',
    images: ['/og-image.png'],
    creator: '@indrajeetsir',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
