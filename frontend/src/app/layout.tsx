import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indrajeetsir.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Indrajeet Sir | UPSC & State PCS Mentorship',
    template: '%s | Indrajeet Sir UPSC',
  },
  description: 'Dedicated UPSC & State PCS Mentorship by Indrajeet Sir. Line-by-line Mains copy checking, 600+ micro notes, 16 test evaluations, and personal strategy sessions.',
  keywords: [
    'UPSC Mentorship',
    'Indrajeet Sir',
    'UPSC Mentorship Guidance',
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
    title: 'Indrajeet Sir | UPSC & State PCS Mentorship',
    description: 'Dedicated UPSC & State PCS Mentorship by Indrajeet Sir. Line-by-line Mains copy checking, 600+ micro notes, 16 test evaluations, and personal strategy sessions.',
    url: siteUrl,
    siteName: 'Indrajeet Sir UPSC Mentorship',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Indrajeet Sir UPSC Mentorship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indrajeet Sir | UPSC & State PCS Mentorship',
    description: 'Personalized UPSC Mentorship by Indrajeet Sir. Comprehensive guidance for Prelims, Mains answer writing, and Personality Test interview.',
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
      className={`${plusJakartaSans.variable} ${outfit.variable}`}
    >
      <head>
        {/* FontAwesome 6 CDN for modern crisp icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
