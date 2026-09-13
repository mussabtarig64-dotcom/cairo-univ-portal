import React, { useRef, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import {
  Printer,
  RotateCw,
  ShieldCheck,
  QrCode,
  Sparkles,
  GraduationCap,
  CheckCircle,
  Building2,
  FileCheck,
  Barcode
} from 'lucide-react';

export default function DigitalMemberCard({ customUser = null }) {
  const { activeTheme } = useTheme();
  const { user: authUser } = useAuth();
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const student = customUser || authUser || {
    fullName: 'أحمد عبد الله عثمان',
    studentId: 'SSA-2025-889',
    department: 'علوم الحاسب والمعلومات (Computer Science)',
    academicYear: 'المستوى الثالث',
    academicLevel: 'المستوى الثالث',
    verificationStatus: 'verified',
    phone: '01012345678',
    cairoAddress: 'الدقي - الجيزة',
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

  // توليد مسار رمز الاستجابة السريعة SVG
  const renderQRCode = (text) => {
    return (
      <svg width="74" height="74" viewBox="0 0 100 100" style={{ background: '#ffffff', padding: '4px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <rect width="100" height="100" fill="#ffffff" />
        <rect x="5" y="5" width="28" height="28" fill="#0b1622" />
        <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
        <rect x="13" y="13" width="12" height="12" fill="#0b1622" />

        <rect x="67" y="5" width="28" height="28" fill="#0b1622" />
        <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
        <rect x="75" y="13" width="12" height="12" fill="#0b1622" />

        <rect x="5" y="67" width="28" height="28" fill="#0b1622" />
        <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
        <rect x="13" y="75" width="12" height="12" fill="#0b1622" />

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

  // توليد الباركود الخلفي
  const renderBarcode = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: '#ffffff', padding: '6px 14px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '3px', height: '36px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
          {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 1, 2, 3, 4, 1, 2].map((w, i) => (
            <div
              key={i}
              style={{
                width: `${w * 1.5}px`,
                height: '100%',
                backgroundColor: i % 2 === 0 ? '#0b1622' : 'transparent',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '10px', color: '#0b1622', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '2px' }}>
          *{student.studentId || 'SSA-2025-889'}*
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', direction: 'rtl' }}>
      
      {/* 1. 3D Digital ID Card (Tilt & Flip) */}
      <Tilt
        tiltMaxAngleX={14}
        tiltMaxAngleY={14}
        perspective={1200}
        scale={1.02}
        transitionSpeed={1200}
        glareEnable={true}
        glareMaxOpacity={0.25}
        glareColor="#f59e0b"
        glarePosition="all"
        glareBorderRadius="24px"
        style={{
          width: '100%',
          maxWidth: '470px',
          cursor: 'pointer',
          perspective: '1200px',
        }}
      >
        <div
          ref={cardRef}
          id="digital-member-card"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            width: '100%',
            minHeight: '280px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.75s cubic-bezier(0.34, 1.4, 0.64, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ======================= الوجه الأمامي (Front Face) ======================= */}
          <div
            style={{
              width: '100%',
              minHeight: '280px',
              background: 'linear-gradient(135deg, #091224 0%, #152238 50%, #091224 100%)',
              border: '2px solid rgba(245, 158, 11, 0.75)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.18)',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Hologram Golden Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                left: '-40px',
                width: '190px',
                height: '190px',
                background: '#f59e0b',
                filter: 'blur(85px)',
                opacity: 0.22,
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.35)',
                  paddingBottom: '14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      padding: '2px',
                      border: '2px solid #f59e0b',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      flexShrink: 0,
                    }}
                  >
                    <img src={logoImg} alt="SSA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff', lineHeight: '1.2' }}>
                      رابطة الطلاب السودانيين
                    </div>
                    <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold', marginTop: '2px' }}>
                      كلية العلوم - جامعة القاهرة | SSA-FS-CU
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '900',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: isVerified ? 'rgba(34, 197, 94, 0.22)' : 'rgba(245, 158, 11, 0.22)',
                    color: isVerified ? '#86efac' : '#fbbf24',
                    border: `1px solid ${isVerified ? '#22c55e' : '#f59e0b'}`,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>{isVerified ? 'عضو معتمد ✅' : 'قيد المراجعة ⏳'}</span>
                </span>
              </div>

              {/* Student Details & QR */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>الاسم الرباعي للطالب:</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff' }}>
                      {student.fullName || student.name || 'طالب بكلية العلوم'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>الرقم الأكاديمي / القيد:</div>
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
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  {renderQRCode(student.studentId || student.email || 'SSA-MEMBER')}
                  <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>SCAN TO VERIFY</span>
                </div>
              </div>
            </div>

            {/* Front Footer */}
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
              <span>العام الجامعي 2025/2026</span>
              <span style={{ color: '#fbbf24', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCw size={11} />
                <span>انقر لقلب البطاقة 3D 🔄</span>
              </span>
            </div>
          </div>

          {/* ======================= الوجه الخلفي (Back Face) ======================= */}
          <div
            style={{
              width: '100%',
              minHeight: '280px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
              border: '2px solid rgba(56, 189, 248, 0.75)',
              borderRadius: '24px',
              padding: '22px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.2)',
              color: '#ffffff',
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              boxSizing: 'border-box',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Magnetic/Gold Hologram Stripe */}
            <div
              style={{
                background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 25%, #fbbf24 50%, #d97706 75%, #b45309 100%)',
                height: '32px',
                margin: '-22px -22px 14px -22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0b1622',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px',
              }}
            >
              ★ SUDANESE STUDENTS ASSOCIATION • FACULTY OF SCIENCE - CAIRO UNIVERSITY ★
            </div>

            {/* Back Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>🏛️ <strong>المقر الرسمي:</strong> كلية العلوم - جامعة القاهرة - الجيزة</div>
                <div>📞 <strong>رقم الطوارئ والرابطة:</strong> 01000000000</div>
                <div style={{ marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                  وثيقة رقمية معتمدة لإثبات الانتساب للرابطة ولتسهيل خدمات الإقامة والأنشطة الطلابية.
                </div>
              </div>

              {/* Barcode Strip */}
              {renderBarcode()}
            </div>

            {/* Back Footer with Stamps */}
            <div
              style={{
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#94a3b8',
              }}
            >
              <span>الختم الإداري: معتمد 🏛️</span>
              <span style={{ color: '#38bdf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCw size={11} />
                <span>انقر للوجه الأمامي 🔄</span>
              </span>
            </div>
          </div>
        </div>
      </Tilt>

      {/* 2. أزرار التحكم والطباعة والقلب */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '11px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RotateCw size={16} />
          <span>{isFlipped ? 'عرض الوجه الأمامي' : 'عرض الوجه الخلفي (Flip 3D)'}</span>
        </button>

        <button
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
            color: '#0b1622',
            border: 'none',
            padding: '11px 22px',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.2s',
          }}
        >
          <Printer size={16} />
          <span>طباعة البطاقة الرقمية (Print)</span>
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
            transform: translateX(-50%) !important;
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
