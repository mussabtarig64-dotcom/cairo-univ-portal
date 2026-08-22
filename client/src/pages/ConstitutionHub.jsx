import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Scale,
  FileText,
  BookOpen,
  FileCheck2,
  Download,
  CheckCircle,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function ConstitutionHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('constitution');

  const tabs = [
    { id: 'constitution', label: 'الدستور واللوائح المنظمة', icon: Scale, count: 'البنود والمواد' },
    { id: 'decisions', label: 'القرارات والمراسيم', icon: FileCheck2, count: 'قرارات نافذة' },
    { id: 'reports', label: 'التقارير الإدارية والمالية', icon: BookOpen, count: 'تقارير الأداء' },
    { id: 'minutes', label: 'محاضر الاجتماعات', icon: FileText, count: 'أرشيف الجلسات' },
  ];

  const articles = [
    { num: 'المادة (1)', title: 'الاسم والمقر والتبعية', text: 'تسمى هذه الهيئة "رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة"، ومقرها الرئيسي كلية العلوم، الجيزة، جمهورية مصر العربية.' },
    { num: 'المادة (2)', title: 'الأهداف والغايات العامة', text: 'رعاية مصالح الطلاب السودانيين الأكاديمية والثقافية والاجتماعية والرياضية، وتعميق أواصر الأخوة، وتسهيل اندماجهم في البيئة الجامعية المصرية.' },
    { num: 'المادة (3)', title: 'شروط العضوية وحقوق الأعضاء', text: 'يعد عضواً في الرابطة كل طالب سوداني مسجل رسمياً في كلية العلوم بجامعة القاهرة، ويتمتع بكافة الحقوق الأكاديمية والترشح والتصويت.' },
    { num: 'المادة (4)', title: 'الجمعية العمومية والمكتب التنفيذي', text: 'الجمعية العمومية هي السلطة التشريعية والرقابية العليا، وتنتخب المكتب التنفيذي لقيادة وتسيير أعمال الرابطة لدورة مدتها عام أكاديمي واحد.' },
  ];

  const decrees = [
    { num: 'قرار إداري رقم (08/2026)', date: '15 فبراير 2026', subject: 'تشكيل اللجنة العليا لتنظيم أسبوع العلوم والتراث وتعيين مقرري اللجان الفرعية.' },
    { num: 'قرار إداري رقم (07/2026)', date: '5 فبراير 2026', subject: 'اعتماد المنصة الرقمية الرسمية وقاعدة البيانات المركزية الموحدة لتسجيل وتوثيق الطلاب.' },
    { num: 'قرار إداري رقم (06/2026)', date: '25 يناير 2026', subject: 'إقرار حزمة التخفيضات الطبية والتكافلية مع المراكز الصحية المتعاقدة.' },
  ];

  const reports = [
    { title: 'تقرير الأداء الإداري والأنشطة النصف سنوي 2025/2026', date: 'يناير 2026', author: 'الأمانة العامة', size: '2.4 MB PDF' },
    { title: 'التقرير المالي والحساب الختامي للمصروفات والمبادرات', date: 'ديسمبر 2025', author: 'أمانة المال والرقابة', size: '1.8 MB PDF' },
    { title: 'تقرير تقييم الخدمات الأكاديمية ونتائج الاستبيان الطلابي', date: 'نوفمبر 2025', author: 'الأمانة الأكاديمية', size: '1.2 MB PDF' },
  ];

  const minutes = [
    { title: 'محضر اجتماع المكتب التنفيذي الدوري رقم (06)', date: '10 فبراير 2026', agenda: 'مناقشة خطة فعاليات شهر مارس، وتحديثات المكتبة الرقمية، وحصر الطلاب الجدد.' },
    { title: 'محضر الاجتماع التنسيقي المشترك مع ممثلي الأقسام الـ 11', date: '28 يناير 2026', agenda: 'تنسيق جداول المراجعات ونماذج الامتحانات وحصر الاحتياجات المعملية.' },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%)',
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
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              padding: '6px 18px',
              borderRadius: '30px',
              color: '#fbbf24',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <Scale size={16} />
            <span>المرجعية الدستورية واللوائح والقرارات التنظيمية</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            الدستور، اللوائح، والقرارات الإدارية
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
            المرجع القانوني والتنظيمي المعتمد لعمل رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة، متضمناً الدستور، المراسيم، ومحاضر الاجتماعات الرسمية.
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
        {activeTab === 'constitution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {articles.map((art, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                    {art.num}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: 0 }}>
                    {art.title}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.8', margin: 0 }}>
                  {art.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'decisions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {decrees.map((d, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {d.num}
                  </span>
                  <span style={{ fontSize: '12px', color: activeTheme.textMuted }}>{d.date}</span>
                </div>
                <p style={{ fontSize: '14px', color: activeTheme.textMain, lineHeight: '1.7', margin: 0, fontWeight: 'bold' }}>
                  {d.subject}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {reports.map((rep, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '6px' }}>
                    {rep.author} • {rep.date}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 14px' }}>
                    {rep.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${activeTheme.border}` }}>
                  <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>{rep.size}</span>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} />
                    <span>معتمد رسمياً</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'minutes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {minutes.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: 0 }}>
                    {m.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: activeTheme.textMuted }}>{m.date}</span>
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  <strong>جدول الأعمال والقرارات:</strong> {m.agenda}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
