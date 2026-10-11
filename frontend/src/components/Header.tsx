'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-brand">
          <Image
            src="/logo.png"
            alt="Indrajeet Sir"
            width={40}
            height={40}
            className="nav-brand-logo"
            priority
          />
          <div className="nav-title">Indrajeet Sir</div>
        </Link>
        <nav className="nav-links">
          <a href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#courses">Courses</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <a href="#courses" className="btn-primary">Enroll Now</a>
        </div>
      </div>
    </header>
  );
}
