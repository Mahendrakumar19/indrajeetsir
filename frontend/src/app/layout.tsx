import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Google Fonts: Plus Jakarta Sans (Unified with Mobile App) with ultra-fast CDN delivery */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
        />

        {/* FontAwesome 6 CDN for modern crisp icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
