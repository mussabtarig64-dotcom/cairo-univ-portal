import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Newspaper,
  FileText,
  Bell,
  Share2,
  Calendar,
  Eye,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

export default function MediaHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('news');

  const tabs = [
    { id: 'news', label: 'الأخبار والأنشطة', icon: Newspaper, count: 'آخر المستجدات' },
    { id: 'statements', label: 'البيانات الرسمية', icon: FileText, count: 'المكتب التنفيذي' },
    { id: 'announcements', label: 'الإعلانات والتنبيهات', icon: Bell, count: 'إعلانات الطلاب' },
  ];

  const newsList = [
    {
      id: 1,
      title: 'رابطة الطلاب السودانيين تبحث مع إدارة كلية العلوم تسهيلات التسجيل والإرشاد الأكاديمي',
      date: '19 فبراير 2026',
      author: 'اللجنة الإعلامية',
      badge: 'خبر رئيسي',
      summary: 'عقد وفد المكتب التنفيذي للرابطة اجتماعاً مع إدارة الكلية وشؤون الطلاب لمناقشة تسريع إجراءات تسجيل المقررات وتسهيل استخراج الإثباتات والشهادات القيدية للطلاب السودانيين.',
    },
    {
      id: 2,
      title: 'افتتاح التسجيل في بطولات الألعاب الذهنية ودوري خماسيات كرة القدم',
      date: '17 فبراير 2026',
      author: 'أمانة الإعلام والرياضة',
      badge: 'نشاط طلابي',
      summary: 'أعلنت اللجنة الرياضية عن انطلاق مرحلة تسجيل الفرق المشاركة في دوري الكلية 2026 مع تخصيص جوائز كبرى للفرق الفائزة وأفضل الهدافين.',
    },
    {
      id: 3,
      title: 'تحديث منصة المكتبة الرقمية وإضافة أكثر من 500 ملزمة وامتحان سابق',
      date: '14 فبراير 2026',
      author: 'الأمانة الأكاديمية',
      badge: 'تطوير رقمي',
      summary: 'إطلاق النسخة المحدثة من المكتبة الرقمية التفاعلية مع دعم محرك بحث ذكي وسرعة تحميل الملازم والكتب لجميع المستويات الدراسية.',
    },
  ];

  const statements = [
    {
      id: 1,
      num: 'بيان رقم (04/2026)',
      title: 'بيان بشأن تمديد فترة سداد الرسوم الدراسية وتجديد الإقامات لطلاب العلوم',
      date: '12 فبراير 2026',
      issuer: 'المكتب التنفيذي للرابطة',
      body: 'تعلن رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة أنه بعد التنسيق مع الجهات المختصة، تم اعتماد مهلة إضافية لتوفيق أوضاع الطلاب الراغبين في سداد المصروفات وتجديد الإقامات دون أي غرامات تأخير.',
    },
    {
      id: 2,
      num: 'بيان رقم (03/2026)',
      title: 'بيان تهنئة بمناسبة بدء الفصل الدراسي الثاني 2025/2026',
      date: '1 فبراير 2026',
      issuer: 'أمانة العلاقات العامة والإعلام',
      body: 'يتقدم المكتب التنفيذي بأطيب التهاني والتبريكات لجميع الزملاء والزميلات بمناسبة انطلاق الفصل الدراسي الجديد، متمنين للجميع فصلاً حافلاً بالتميز والدرجات الرفيعة.',
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'تنبيه عاجل: مواعيد تسليم وثائق إثبات الهوية لاعتماد الحسابات في المنصة',
      date: 'مستمر حتى 1 مارس 2026',
      type: 'إعلان إداري',
      urgent: true,
      text: 'يرجى من جميع الطلاب المستجدين رفع صورة جواز السفر أو البطاقة الجامعية عبر الملف الشخصي لتفعيل بطاقة العضوية الرقمية (Digital ID).',
    },
    {
      id: 2,
      title: 'بدء مجموعات التقوية والمراجعات النهائية لمقررات الكيمياء العامة والفيزياء 101',
      date: 'كل يوم سبت وثلاثاء',
      type: 'أكاديمي',
      urgent: false,
      text: 'تنظم الأمانة الأكاديمية جلسات مراجعة مجانية يقدمها معيدون وطلاب متميزون من السنوات المتقدمة.',
    },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)',
          borderBottom: `2px solid ${activeTheme.accent}`,
          padding: '55px 20px 45px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid #3b82f6',
              padding: '6px 18px',
              borderRadius: '30px',
              color: '#60a5fa',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <Megaphone size={16} />
            <span>المركز الإعلامي والمتحدث الرسمي للرابطة</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            الأخبار، البيانات، والتغطيات الإعلامية
          </h1>

          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto 24px',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            المصدر الرسمي الموثوق لجميع أخبار وبيانات وقرارات رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            backgroundColor: activeTheme.bgCard,
            padding: '8px',
            borderRadius: '18px',
            border: `1px solid ${activeTheme.border}`,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${activeTheme.accent}` : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  color: isSelected ? activeTheme.accentLight : activeTheme.textMain,
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '13px',
                  textAlign: 'right',
                }}
              >
                <Icon size={20} color={isSelected ? activeTheme.accent : activeTheme.textMuted} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '11px', color: activeTheme.textMuted, fontWeight: 'normal' }}>
                    {tab.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        {activeTab === 'news' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {newsList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {item.badge}
                  </span>
                  <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>
                    {item.date} • {item.author}
                  </div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.8', margin: 0 }}>
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'statements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {statements.map((stmt) => (
              <div
                key={stmt.id}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {stmt.num}
                  </span>
                  <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>
                    {stmt.date} • {stmt.issuer}
                  </div>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 12px' }}>
                  {stmt.title}
                </h3>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: activeTheme.textMain, lineHeight: '1.8' }}>
                  {stmt.body}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: ann.urgent ? '1px solid #f59e0b' : `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: ann.urgent ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)', color: ann.urgent ? '#fbbf24' : activeTheme.textMuted, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {ann.type}
                  </span>
                  <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>{ann.date}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                  {ann.title}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {ann.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
