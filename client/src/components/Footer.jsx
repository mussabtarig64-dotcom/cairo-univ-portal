import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.png';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const { activeTheme } = useTheme();

  return (
    <footer
      className="w-full bg-[#09131f] border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 mt-auto text-slate-300 text-sm"
      dir="rtl"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
        {/* معلومات الرابطة */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              className="logo-wrapper rounded-full overflow-hidden"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f59e0b',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              }}
            >
              <img
                src={logoImg}
                alt="SSA Logo"
                loading="lazy"
                decoding="async"
                width="46"
                height="46"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '16px' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 'bold' }}>
                كلية العلوم - جامعة القاهرة
              </div>
            </div>
          </div>
          <p style={{ lineHeight: '1.8', margin: 0, color: '#cbd5e1', maxWidth: '520px' }}>
            الهيئة الطلابية الأكاديمية والاجتماعية والثقافية الممثلة لطلاب جمهورية السودان بكلية العلوم جامعة القاهرة. منصة رقمية متكاملة لخدمة ورعاية الطلاب وتوثيق مسيرتهم.
          </p>
        </div>

        {/* صفحات التواصل الاجتماعي الرسمية */}
        <div className="md:flex md:flex-col md:items-start lg:items-end">
          <div className="w-full max-w-md">
            <h4 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
              صفحات وقنوات الرابطة الرسمية
            </h4>
            <SocialLinks variant="detailed" />
          </div>
        </div>
      </div>

      <div
        className="w-full max-w-7xl mx-auto border-t border-white/10 pt-5 text-center text-xs text-slate-400"
      >
        جميع الحقوق محفوظة © {new Date().getFullYear()} رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
      </div>

      {/* Developer Signature Credit */}
      <div className="text-center text-sm text-gray-400 mt-8 pb-4">
        تصميم وتطوير: مصعب طارق
      </div>
    </footer>
  );
}
