import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DigitalMemberCard from '../components/DigitalMemberCard';
import { ShieldCheck, GraduationCap, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DigitalIDPage() {
  const { activeTheme } = useTheme();
  const { user, isAuthenticated, isPending } = useAuth();

  return (
    <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 20px 80px', direction: 'rtl' }}>
      
      {/* 1. هيدر البطاقة */}
      <div
        style={{
          background: `linear-gradient(135deg, ${activeTheme.bgCard} 0%, rgba(11, 19, 43, 0.95) 100%)`,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '24px',
          padding: '36px 28px',
          marginBottom: '32px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
            border: `2px solid ${activeTheme.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#ffffff',
            boxShadow: `0 8px 25px ${activeTheme.primary}50`,
          }}
        >
          <ShieldCheck size={32} />
        </div>

        <h1 style={{ color: activeTheme.textMain, fontSize: '26px', fontWeight: '900', margin: '0 0 10px' }}>
          بطاقة العضوية الرقمية (Digital Student ID)
        </h1>
        <p style={{ color: activeTheme.accentLight, fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
          رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
        </p>
        <p style={{ color: activeTheme.textMuted, fontSize: '13px', marginTop: '6px', maxWidth: '650px', margin: '8px auto 0' }}>
          البطاقة الرسمية الإلكترونية المعتمدة لأعضاء الرابطة بكلية العلوم مزودة بـ QR Code رسمي لإثبات العضوية والاستفادة من الخدمات الطلابية.
        </p>
      </div>

      {!isAuthenticated ? (
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '20px',
            padding: '36px 24px',
            textAlign: 'center',
            color: activeTheme.textMuted,
          }}
        >
          <AlertCircle size={40} color={activeTheme.accentLight} style={{ marginBottom: '12px' }} />
          <h3 style={{ color: activeTheme.textMain, fontSize: '18px', margin: '0 0 8px' }}>يرجى تسجيل الدخول لعرض بطاقتك الرقمية</h3>
          <p style={{ fontSize: '13px', margin: '0 0 20px' }}>يلزم تسجيل الدخول أو تعبئة استمارة التسجيل لاستخراج بطاقة العضوية.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/login"
              style={{
                background: activeTheme.primary,
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: activeTheme.textMain,
                border: `1px solid ${activeTheme.border}`,
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              استمارة التسجيل
            </Link>
          </div>
        </div>
      ) : (
        <DigitalMemberCard />
      )}
    </div>
  );
}
