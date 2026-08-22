import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../config/api';

export default function AnnouncementTicker() {
  const { activeTheme } = useTheme();
  const [announcements, setAnnouncements] = useState([
    '📢 مرحباً بكم في البوابة الرسمية لرابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)',
    '✨ فتح باب التسجيل المركزي واستبيان السكن لجميع الطلاب للعام الجامعي 2025/2026',
    '🔬 غرف المذاكرة المتخصصة والمستشار الأكاديمي الذكي متاحان الآن للجميع',
    '🛂 تنويه للطلاب المستجدين: يرجى مراجعة دليل إجراءات الإقامة والسكن في قسم غرف المذاكرة',
  ]);

  useEffect(() => {
    // محاولة جلب الإعلانات النشطة من السيرفر أو التخزين المحلي
    axios
      .get(`${API_BASE}/admin/announcements`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const titles = res.data.map((a) => `📢 ${a.title}: ${a.content}`);
          setAnnouncements(titles);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('ssa_announcements');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            if (list.length > 0) {
              setAnnouncements(list.map((a) => `📢 ${a.title || a.content}`));
            }
          } catch (e) {}
        }
      });
  }, []);

  return (
    <div
      className="announcement-ticker-container"
      style={{
        background: 'linear-gradient(90deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)',
        borderBottom: `1px solid ${activeTheme.border || 'rgba(255,255,255,0.1)'}`,
        color: '#ffffff',
        padding: '6px 12px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 40,
        direction: 'rtl',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
    >
      {/* شارة الشريط */}
      <div
        className="ticker-badge"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#0b1622',
          fontWeight: '900',
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '6px',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
          marginLeft: '10px',
          zIndex: 2,
          whiteSpace: 'nowrap',
        }}
      >
        <Megaphone size={13} />
        <span>أخبار الرابطة</span>
      </div>

      {/* الشريط المتحرك Marquee */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          position: 'relative',
          display: 'flex',
        }}
      >
        <div className="ticker-track">
          {announcements.map((text, idx) => (
            <span
              key={`ann-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '32px',
                color: '#f8fafc',
                fontWeight: '500',
              }}
            >
              <span>{text}</span>
              <span style={{ color: '#f59e0b', fontSize: '10px' }}>✦</span>
            </span>
          ))}
          {/* تكرار لضمان انسيابية واستمرارية الحركة */}
          {announcements.map((text, idx) => (
            <span
              key={`repeat-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '32px',
                color: '#f8fafc',
                fontWeight: '500',
              }}
            >
              <span>{text}</span>
              <span style={{ color: '#f59e0b', fontSize: '10px' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-anim 35s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-anim {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        @media (max-width: 640px) {
          .announcement-ticker-container {
            padding: 4px 8px;
            font-size: 11px;
            overflow-x: hidden !important;
          }
          .ticker-badge {
            padding: 3px 6px;
            font-size: 10px;
            margin-left: 6px;
          }
          .ticker-badge span {
            font-size: 10px;
          }
          .ticker-track span {
            font-size: 11px;
            padding-left: 20px;
          }
        }
      `}</style>
    </div>
  );
}
