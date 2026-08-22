import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Users,
  Shield,
  FileCheck,
  Target,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export default function AdministrationHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('executive');

  const tabs = [
    { id: 'executive', label: 'المكتب التنفيذي', icon: Shield, desc: 'الهيئة الرئاسية والتنفيذية' },
    { id: 'committees', label: 'اللجان المتخصصة', icon: Users, desc: 'الأمانات ولجان العمل' },
    { id: 'mandates', label: 'الاختصاصات والمهام', icon: FileCheck, desc: 'التوصيف الإداري والوظيفي' },
    { id: 'plans', label: 'الخطط والمشاريع', icon: Target, desc: 'الخطة الاستراتيجية 2026' },
  ];

  const executiveBoard = [
    {
      title: 'رئيس الرابطة (المدير العام)',
      name: 'مصعب طارق',
      role: 'التمثيل الرسمي، إدارة السياسات العامة، والتنسيق مع عمادة الكلية وإدارة الوافدين.',
      email: 'president@ssa-cu.edu',
      badge: 'القيادة العليا',
    },
    {
      title: 'نائب رئيس الرابطة',
      name: 'عمر صديق',
      role: 'الإشراف المباشر على اللجان التنفيذية وتسيير الأعمال اليومية في غياب الرئيس.',
      email: 'vice-president@ssa-cu.edu',
      badge: 'إشراف تنفيذي',
    },
    {
      title: 'الأمين العام',
      name: 'ياسر محمد علي',
      role: 'توثيق المحاضر، ضبط السجلات الرسمية، ومتابعة تنفيذ القرارات الإدارية.',
      email: 'secretary@ssa-cu.edu',
      badge: 'شؤون إدارية',
    },
    {
      title: 'أمين المال والشؤون المالية',
      name: 'هيثم عبد الرحمن',
      role: 'إدارة الموازنة المالية، تحصيل الاشتراكات، والصرف على الأنشطة والمبادرات.',
      email: 'treasurer@ssa-cu.edu',
      badge: 'رقابة مالية',
    },
  ];

  const committees = [
    { name: 'الأمانة الأكاديمية وشؤون الطلاب', lead: 'د. سيف الدين (مشرف) + مصعب طارق', desc: 'إدارة المكتبة الرقمية، بنك الامتحانات، المراجعات، ومتابعة قضايا التسجيل والنتائج.' },
    { name: 'أمانة العلاقات العامة والإعلام', lead: 'أحمد البدوي', desc: 'إدارة المنصات الرسمية، التغطيات الصحفية، البيانات، والتواصل مع الروابط والجامعات.' },
    { name: 'أمانة النشاط الرياضي والبدني', lead: 'سامي عثمان', desc: 'تنظيم الدوريات الرياضية، معسكرات التدريب، وإدارة الفرق والبطولات الجامعية.' },
    { name: 'أمانة الشؤون الاجتماعية والعمل الميداني', lead: 'منصور آدم', desc: 'رعاية الطلاب الجدد، ملف الإسكان، صندوق التكافل، والخدمات الصحية والإنسانية.' },
    { name: 'أمانة الثقافة والمواهب والتراث', lead: 'روضة السر', desc: 'تنظيم المعارض، الأسابيع الثقافية، الأمسيات الشعرية، وتوثيق التراث السوداني.' },
  ];

  const plans = [
    { title: 'مشروع التحول الرقمي الشامل (SSA Digital 2026)', progress: '90% منجز', desc: 'إطلاق المنصة المركزية الذكية، بطاقة العضوية الرقمية، ونظام الحضور الذكي في الفعاليات.' },
    { title: 'توسيع بنك المراجع والمختبرات الافتراضية', progress: '75% منجز', desc: 'توفير مذكرات مترجمة ومراجع معتمدة لكافة مواد المستويات الأربعة بكلية العلوم.' },
    { title: 'اتفاقيات الرعاية الصحية والخصومات العلاجية', progress: '85% منجز', desc: 'توقيع مذكرات تفاهم مع 15 مركزاً طبياً ومعامل تحاليل لتقديم خصومات تصل إلى 40% للطلاب.' },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0b1e33 0%, #102a45 50%, #183b5d 100%)',
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
            <Shield size={16} />
            <span>الهيكل الإداري والمكتب التنفيذي للرابطة</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            إدارة الرابطة، اللجان، والخطط الاستراتيجية
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
            التعريف بأعضاء المكتب التنفيذي، وتوزيع المهام والاختصاصات بين اللجان والأمانات المتخصصة، ومتابعة تنفيذ الخطط السنوية لخدمة الطلاب.
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
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        {activeTab === 'executive' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {executiveBoard.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {item.badge}
                  </span>
                  <UserCheck size={18} color={activeTheme.accent} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '12px' }}>
                  {item.title}
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 14px' }}>
                  {item.role}
                </p>
                <div style={{ fontSize: '12px', color: activeTheme.textMain, background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color={activeTheme.accent} />
                  <span>{item.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'committees' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {committees.map((com, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 8px' }}>
                  {com.name}
                </h3>
                <div style={{ fontSize: '12px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '10px' }}>
                  👑 مقرر اللجنة: {com.lead}
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {com.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mandates' && (
          <div
            style={{
              backgroundColor: activeTheme.bgCard,
              borderRadius: '20px',
              border: `1px solid ${activeTheme.border}`,
              padding: '30px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: activeTheme.textMain, marginBottom: '16px' }}>
              المبادئ والاختصاصات العامة للعمل الإداري
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.8' }}>
              <div>• <strong>الشفافية والمساءلة:</strong> تخضع كافة القرارات والمصروفات المالية لتقارير دورية ترفع للجمعية العمومية.</div>
              <div>• <strong>التمثيل الأكاديمي الشامل:</strong> ضمان وجود ممثلين لكافة الأقسام والتخصصات الـ 11 بالكلية في لجان الرابطة.</div>
              <div>• <strong>التطوير المستمر:</strong> مواكبة أحدث التقنيات الرقمية لتسهيل وصول الخدمات لجميع الطلاب السودانيين.</div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plans.map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: 0 }}>
                    {p.title}
                  </h3>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {p.progress}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
