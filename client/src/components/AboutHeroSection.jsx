import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Users } from 'lucide-react';

export default function AboutHeroSection() {
  const { activeTheme } = useTheme?.() || {
    bgCard: '#0f172a',
    border: 'rgba(255, 255, 255, 0.1)',
    primary: '#38bdf8',
    accent: '#f59e0b',
    textMain: '#ffffff',
    textMuted: '#94a3b8'
  };

  return (
    <section className="about-hero-section" style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
      <div
        style={{
          maxWidth: '850px',
          margin: '0 auto 30px auto',
          borderRadius: '16px',
          overflow: 'hidden',
          border: `2px solid ${activeTheme.border || 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
          aspectRatio: '16 / 9',
          background: '#0b1622',
          position: 'relative'
        }}
      >
        <img
          src="/assets/team/team.jpg?v=2"
          alt="المكتب التنفيذي لرابطة الطلاب السودانيين"
          loading="lazy"
          decoding="async"
          width="850"
          height="478"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover'
          }}
        />
      </div>
    </section>
  );
}
