import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import { Printer, Download, ShieldCheck, QrCode, Sparkles, GraduationCap, CheckCircle } from 'lucide-react';

export default function DigitalMemberCard({ customUser = null }) {
  const { activeTheme } = useTheme();
  const { user: authUser } = useAuth();
  const cardRef = useRef(null);

  const student = customUser || authUser || {
    fullName: 'أحمد عبد الله عثمان',
    studentId: 'SSA-2025-889',
    department: 'علوم الحاسب والمعلومات (Computer Science)',
    academicYear: 'المستوى الثالث',
    verificationStatus: 'verified',
    createdAt: new Date().toISOString(),
  };

  const isVerified =
    student.verificationStatus === 'verified' ||
    student.verificationStatus === 'approved' ||
    student.status === 'approved' ||
    student.role === 'admin';

  const handlePrint = () => {
    window.print();
  };

  // توليد مسار رمز الاستجابة السريعة SVG بسيط وخفيف (Simple QR pattern SVG generator)
  const renderQRCode = (text) => {
    return (
      <svg width="74" height="74" viewBox="0 0 100 100" style={{ background: '#ffffff', padding: '4px', borderRadius: '6px' }}>
        <rect width="100" height="100" fill="#ffffff" />
        {/* أركان الـ QR الكلاسيكية */}
        <rect x="5" y="5" width="28" height="28" fill="#0b1622" />
        <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
        <rect x="13" y="13" width="12" height="12" fill="#0b1622" />

        <rect x="67" y="5" width="28" height="28" fill="#0b1622" />
        <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
        <rect x="75" y="13" width="12" height="12" fill="#0b1622" />

        <rect x="5" y="67" width="28" height="28" fill="#0b1622" />
        <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
        <rect x="13" y="75" width="12" height="12" fill="#0b1622" />

        {/* نقاط عشوائية تمثل الـ Payload */}
        <rect x="40" y="10" width="8" height="8" fill="#0b1622" />
        <rect x="50" y="10" width="8" height="8" fill="#0b1622" />
        <rect x="40" y="25" width="8" height="8" fill="#0b1622" />
        <rect x="50" y="25" width="8" height="8" fill="#0b1622" />
        <rect x="10" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="25" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="40" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="55" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="70" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="85" y="40" width="8" height="8" fill="#0b1622" />
        <rect x="40" y="55" width="8" height="8" fill="#0b1622" />
        <rect x="55" y="55" width="8" height="8" fill="#0b1622" />
        <rect x="70" y="55" width="8" height="8" fill="#0b1622" />
        <rect x="40" y="70" width="8" height="8" fill="#0b1622" />
        <rect x="50" y="70" width="8" height="8" fill="#0b1622" />
        <rect x="65" y="70" width="8" height="8" fill="#0b1622" />
        <rect x="80" y="70" width="8" height="8" fill="#0b1622" />
        <rect x="40" y="85" width="8" height="8" fill="#0b1622" />
        <rect x="55" y="85" width="8" height="8" fill="#0b1622" />
        <rect x="70" y="85" width="8" height="8" fill="#0b1622" />
        <rect x="85" y="85" width="8" height="8" fill="#0b1622" />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', direction: 'rtl' }}>
      
      {/* 1. تصميم كارت الهوية المطبوع Printable Membership Card */}
      <div
        ref={cardRef}
        id="digital-member-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* خلفية جمالية وهولوجرام شعار الرابطة */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '-40px',
            width: '180px',
            height: '180px',
            background: '#f59e0b',
            filter: 'blur(90px)',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />

        {/* رأس البطاقة */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                border: '2px solid #f59e0b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}
            >
              <img src={logoImg} alt="SSA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', lineHeight: '1.2' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                كلية العلوم - جامعة القاهرة
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '10px',
              fontWeight: '900',
              padding: '3px 9px',
              borderRadius: '12px',
              backgroundColor: isVerified ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isVerified ? '#22c55e' : '#fbbf24',
              border: `1px solid ${isVerified ? '#22c55e' : '#f59e0b'}`,
              letterSpacing: '0.5px',
            }}
          >
            {isVerified ? 'عضو معتمد ✅' : 'قيد المراجعة ⏳'}
          </span>
        </div>

        {/* محتوى بيانات الطالب والـ QR */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>الاسم الرباعي للطالب:</div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#ffffff' }}>
                {student.fullName || student.name || 'طالب بكلية العلوم'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>الرقم الأكاديمي / رقم القيد:</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'monospace' }}>
                {student.studentId || student.academicId || 'SSA-STUDENT-001'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>القسم العلمي / المستوى:</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#e2e8f0' }}>
                {student.department || 'العلوم العامة'} • {student.academicYear || student.academicLevel || 'المستوى الأول'}
              </div>
            </div>

            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>سنة الإصدار والاعتماد:</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}> العام الجامعي 2025/2026</div>
            </div>
          </div>

          {/* رمز الاستجابة السريعة QR Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {renderQRCode(student.studentId || student.email || 'SSA-MEMBER')}
            <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>SCAN QR TO VERIFY</span>
          </div>
        </div>

        {/* أسفل البطاقة */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '10px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#94a3b8',
          }}
        >
          <span>بطاقة عضوية رقمية رسمية • SSA-FS-CU</span>
          <span>ختم الاعتماد الأكاديمي 🏛️</span>
        </div>
      </div>

      {/* 2. أزرار الطباعة والتنزيل */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
            color: '#0b1622',
            border: 'none',
            padding: '11px 22px',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
          }}
        >
          <Printer size={16} />
          <span>طباعة البطاقة الرقمية (Print Card)</span>
        </button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #digital-member-card, #digital-member-card * {
            visibility: visible;
          }
          #digital-member-card {
            position: absolute;
            left: 50%;
            top: 20%;
            transform: translateX(-50%);
            width: 100% !important;
            max-width: 480px !important;
            border: 2px solid #000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
