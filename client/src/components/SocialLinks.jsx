import React from 'react';

export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    name: 'فيسبوك',
    fullName: 'صفحة الفيسبوك الرسمية',
    url: 'https://www.facebook.com/profile.php?id=61573705268127',
    color: '#1877F2',
    bg: 'rgba(24, 119, 242, 0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'واتساب',
    fullName: 'مجتمع وقنوات الواتساب',
    url: 'https://chat.whatsapp.com/HTGYuTGSQwqDBtOTSUlyUO?s=cl&p=i&ilr=0',
    color: '#25D366',
    bg: 'rgba(37, 211, 102, 0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.333 5.008L2 22l5.223-1.332a9.92 9.92 0 0 0 4.789 1.228h.004c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.925 9.925 0 0 0 12.012 2zm0 18.151h-.003a8.27 8.27 0 0 1-4.217-1.157l-.302-.18-3.132.798.812-3.053-.197-.314a8.272 8.272 0 0 1-1.272-4.46c0-4.568 3.718-8.283 8.287-8.283 2.213 0 4.293.863 5.858 2.428a8.225 8.225 0 0 1 2.425 5.856c0 4.569-3.717 8.285-8.285 8.285z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'انستغرام',
    fullName: 'حساب الانستغرام الرسمي',
    url: 'https://www.instagram.com/sudaneseassociation67?igsh=engzOXJ5bHJiMnli&utm_source=ig_contact_invite',
    color: '#E4405F',
    bg: 'rgba(228, 64, 95, 0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
];

export default function SocialLinks({ variant = 'compact' }) {
  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.fullName}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: item.bg,
              color: item.color,
              border: `1px solid ${item.color}50`,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', direction: 'rtl' }}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${item.color}40`,
            color: '#ffffff',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: item.color, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
            <span>{item.fullName}</span>
          </div>
          <span style={{ color: item.color, fontSize: '11px', fontWeight: 'bold' }}>متابعة ←</span>
        </a>
      ))}
    </div>
  );
}