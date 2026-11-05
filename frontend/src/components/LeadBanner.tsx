'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LeadBanner() {
  const [directPhone, setDirectPhone] = useState('');
  const [directPhoneSubmitted, setDirectPhoneSubmitted] = useState(false);

  const handleDirectPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = directPhone.trim();
    if (!cleanPhone || cleanPhone.length < 10) return;

    try {
      const existing = JSON.parse(localStorage.getItem('indrajeet_callback_leads') || '[]');
      existing.unshift({
        id: `lead-${Date.now()}`,
        name: 'Aspirant (Quick Lead)',
        phone: `+91 ${cleanPhone}`,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('indrajeet_callback_leads', JSON.stringify(existing));
    } catch {}

    setDirectPhoneSubmitted(true);
    setTimeout(() => {
      setDirectPhone('');
      setDirectPhoneSubmitted(false);
    }, 4500);
  };

  return (
    <section className="section-wrap lead-banner-section">
      <div className="lead-banner-card">
        <div className="lead-banner-content">
          <h2 className="lead-banner-title">Crack UPSC with our Expert Guidance</h2>
          <p className="lead-banner-subtitle">Get a Callback by our UPSC Expert!</p>
          <p className="lead-banner-terms">
            By submitting your details, you agree to the <Link href="/terms">terms and conditions</Link>.
          </p>

          {directPhoneSubmitted ? (
            <div className="lead-banner-success">
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              <span>Thank you! Indrajeet Sir&apos;s desk counselor will call you back shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleDirectPhoneSubmit} className="lead-banner-form">
              <div className="lead-input-wrap">
                <span className="lead-input-prefix">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Your mobile number"
                  value={directPhone}
                  onChange={(e) => setDirectPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="lead-input-field"
                  aria-label="Your mobile number"
                />
              </div>
              <button type="submit" className="lead-submit-btn">
                Get started with Free Mentorship
              </button>
            </form>
          )}
        </div>

        <div className="lead-banner-visual">
          <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="lead-banner-illustration" aria-hidden="true">
            <circle cx="200" cy="180" r="110" fill="#E0F2FE" opacity="0.75" />
            <circle cx="200" cy="170" r="75" fill="#FEF3C7" opacity="0.65" />
            
            {/* Lightbulb at top */}
            <path d="M185 60 C185 45 215 45 215 60 C215 70 208 76 208 84 L192 84 C192 76 185 70 185 60 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="194" y="86" width="12" height="4" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
            <path d="M197 92 L203 92" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            <path d="M195 62 Q200 52 205 62" stroke="#D97706" strokeWidth="2" fill="none" />
            <line x1="200" y1="36" x2="200" y2="42" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="175" y1="46" x2="180" y2="51" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="225" y1="46" x2="220" y2="51" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

            {/* Idea nodes connecting to bulb */}
            <path d="M145 92 L185 70" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M255 92 L215 70" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="140" cy="95" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <path d="M132 98 L138 92 L142 96 L148 88" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="260" cy="95" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <path d="M255 90 H265 M255 95 H263 M255 100 H260" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

            {/* Meeting Table */}
            <ellipse cx="200" cy="245" rx="140" ry="24" fill="#0284C7" opacity="0.85" />
            <ellipse cx="200" cy="240" rx="135" ry="20" fill="#38BDF8" />
            
            {/* Mentor in center */}
            <circle cx="200" cy="180" r="15" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
            <path d="M190 178 Q200 166 210 178" fill="#0F172A" />
            <path d="M184 212 C184 198 216 198 216 212 L216 235 L184 235 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
            <path d="M187 180 A13 13 0 0 1 213 180" stroke="#0F172A" strokeWidth="2" fill="none" />
            <circle cx="187" cy="180" r="3" fill="#2563EB" />
            <circle cx="213" cy="180" r="3" fill="#2563EB" />
            <path d="M213 182 L208 190" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="188" y="222" width="24" height="15" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
            <line x1="184" y1="237" x2="216" y2="237" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

            {/* Student Left (Girl) */}
            <circle cx="140" cy="190" r="13" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
            <path d="M130 190 Q140 175 148 185 Q135 195 130 205" fill="#881337" />
            <path d="M125 218 C125 208 155 208 155 218 L160 250 L120 250 Z" fill="#FDA4AF" stroke="#0F172A" strokeWidth="2" />
            <path d="M112 210 Q112 255 125 270" stroke="#E11D48" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Student Right (Boy) */}
            <circle cx="260" cy="190" r="13" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
            <path d="M250 185 Q260 174 270 184" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <path d="M245 218 C245 208 275 208 275 218 L280 250 L240 250 Z" fill="#0284C7" stroke="#0F172A" strokeWidth="2" />
            <path d="M288 210 Q288 255 275 270" stroke="#0369A1" strokeWidth="4" fill="none" strokeLinecap="round" />
            
            {/* Table legs */}
            <line x1="150" y1="255" x2="145" y2="285" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="250" y1="255" x2="255" y2="285" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="200" y1="255" x2="200" y2="285" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
