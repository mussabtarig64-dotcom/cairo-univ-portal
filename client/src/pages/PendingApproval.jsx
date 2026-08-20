import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, CheckCircle, XCircle, Clock, UserCheck, RefreshCw, MapPin, Phone, GraduationCap } from 'lucide-react';

export default function PendingApproval() {
  const { user, isAdmin } = useAuth();
  const { activeTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '85vh',
        backgroundColor: activeTheme.bgDark,
        color: activeTheme.textMain,
        padding: '30px 20px',
        display: 'flex',
        justifyContent: 'center',
        direction: 'rtl',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        
        {/* الكارت الرئيسي لطلب القيد */}
        <div
          style={{
            backgroundColor: activeTheme.bgCard,
            borderRadius: '20px',
            border: `1px solid ${activeTheme.border}`,
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Clock color="#f59e0b" size={32} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
            طلب قيدك قيد المراجعة والاعتماد الأكاديمي
          </h2>
          <p style={{ color: activeTheme.textMuted, fontSize: '14px', marginBottom: '24px' }}>
            مرحباً بك، يتم حالياً تدقيق بيانات الاستبيان ووثيقة الهوية بواسطة هيئة شؤون الطلاب برابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة.
          </p>

          {/* مراحل المراجعة الثلاث */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', textAlign: 'right' }}>
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>1. استلام الاستمارة والوثيقة</div>
              <div style={{ fontSize: '12px', color: activeTheme.textMuted, marginTop: '4px' }}>تم تسجيل الاستبيان ورفع إثبات الهوية بنجاح.</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', textAlign: 'right' }}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '14px' }}>2. التدقيق ومطابقة الهوية</div>
              <div style={{ fontSize: '12px', color: activeTheme.textMuted, marginTop: '4px' }}>جاري التحقق بواسطة مسؤولي الرابطة.</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${activeTheme.border}`, textAlign: 'right', opacity: 0.6 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>3. الاعتماد ومنح الصلاحيات</div>
              <div style={{ fontSize: '12px', color: activeTheme.textMuted, marginTop: '4px' }}>فتح الغرف والملتقى بعد موافقة الإدارة.</div>
            </div>
          </div>

          {/* ملخص بيانات الاستبيان المسجلة */}
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderRadius: '14px',
              padding: '22px',
              textAlign: 'right',
              border: `1px solid ${activeTheme.border}`,
            }}
          >
            <h4 style={{ marginBottom: '14px', fontSize: '15px', fontWeight: 'bold', color: activeTheme.accentLight }}>
              📑 ملخص بيانات القيد والاستبيان المسجلة:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: activeTheme.textMuted }}>الاسم الكامل: </span>
                <strong>{user?.fullName || user?.name || 'طالب مسجل'}</strong>
              </div>
              <div>
                <span style={{ color: activeTheme.textMuted }}>البريد الإلكتروني: </span>
                <strong>{user?.email || 'غير محدد'}</strong>
              </div>
              <div>
                <span style={{ color: activeTheme.textMuted }}>هاتف التواصل: </span>
                <strong>{user?.phone || 'غير محدد'}</strong>
              </div>
              <div>
                <span style={{ color: activeTheme.textMuted }}>رقم القيد / الجلوس: </span>
                <strong>{user?.studentId || 'قيد المراجعة'}</strong>
              </div>
              <div>
                <span style={{ color: activeTheme.textMuted }}>القسم العلمي: </span>
                <strong>{user?.department || 'كلية العلوم'}</strong>
              </div>
              <div>
                <span style={{ color: activeTheme.textMuted }}>مكان السكن في مصر: </span>
                <strong>{user?.cairoAddress || 'القاهرة، مصر'}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${activeTheme.border}`,
                color: activeTheme.textMain,
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              <RefreshCw size={15} />
              <span>تحديث حالة المراجعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}