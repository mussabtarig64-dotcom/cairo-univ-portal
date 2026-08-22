import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import AcademicCalendar from '../components/AcademicCalendar';
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
  Sparkles,
  GraduationCap,
  FolderDown,
  CheckCircle,
  Users,
  Award,
  Globe,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const ACADEMIC_LEVELS = [
  'الكل',
  'المستوى الأول (إعدادي علوم)',
  'المستوى الثاني',
  'المستوى الثالث',
  'المستوى الرابع (تخرج)',
  'الدراسات العليا',
];

const DEPARTMENTS = [
  'جميع التخصصات',
  'الكيمياء منفرد',
  'الفيزياء منفرد',
  'الفيزياء الحيوية',
  'مزدوج كيمياء / نبات',
  'مزدوج كيمياء / حشرات',
  'مزدوج كيمياء / جيولوجيا',
  'مزدوج كيمياء / فيزياء',
  'مزدوج كيمياء / ميكرو',
  'مزدوج كيمياء / حيوان',
  'التكنولوجيا الحيوية',
  'مزدوج الكيمياء الحيوية',
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: '📘 مذكرة ملخص تجارب كيمياء عامة (Gen Chemistry Lab Manual 101)',
    dept: 'الكيمياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'lab',
    typeName: 'مذكرات وتجارب المعامل',
    fileSize: '4.2 MB',
    format: 'PDF',
    downloads: 142,
    date: '2026-01-15',
    author: 'اللجنة الأكاديمية - قسم الكيمياء',
    description: 'شرح مفصل لكافة تجارب التحليل الحجمي والتجاري وقواعد الأمان داخل المعمل مع الأسئلة الإرشاديّة.',
  },
  {
    id: 2,
    title: '⚡ مراجعة قوانين البصريات والفيزياء الحديثة (Optics & Modern Physics)',
    dept: 'الفيزياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'summary',
    typeName: 'مذكرات ومحاضرات',
    fileSize: '5.8 MB',
    format: 'PDF',
    downloads: 219,
    date: '2026-02-01',
    author: 'نادي الفيزياء بالرابطة',
    description: 'ملخص شامل للقوانين والمعادلات البصرية وتطبيقاتها المعملية.',
  },
  {
    id: 3,
    title: '📑 امتحان منتصف الفصل (Midterm Exam) - تفاضل وتكامل (Calculus 1)',
    dept: 'الكيمياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'exam',
    typeName: 'امتحانات سابقة',
    fileSize: '2.1 MB',
    format: 'PDF',
    downloads: 310,
    date: '2025-12-10',
    author: 'أرشيف الرابطة الأكاديمي',
    description: 'نموذج امتحان الميدتيرم للسنوات الماضية مع الإجابة النموذجية المعتمدة.',
  },
  {
    id: 4,
    title: '🧪 مذكرة الكيمياء العضوية والإنزيمات (Organic & Biochemistry Notes)',
    dept: 'مزدوج الكيمياء الحيوية',
    level: 'المستوى الثاني',
    type: 'summary',
    typeName: 'مذكرات ومحاضرات',
    fileSize: '8.5 MB',
    format: 'PDF',
    downloads: 198,
    date: '2026-01-20',
    author: 'فريق التميز الأكاديمي',
    description: 'تجميعة شاملة لتفاعلات المركبات العضوية والإنزيمات الدقيقة مع المخططات التوضيحية.',
  },
  {
    id: 5,
    title: '📑 بنك امتحانات التكنولوجيا الحيوية والجينوم (Biotech Final Exams Archive)',
    dept: 'التكنولوجيا الحيوية',
    level: 'المستوى الثالث',
    type: 'exam',
    typeName: 'امتحانات سابقة',
    fileSize: '11.4 MB',
    format: 'PDF',
    downloads: 265,
    date: '2026-01-18',
    author: 'الأمانة الأكاديمية',
    description: 'أسئلة الامتحانات النهائية لآخر 5 سنوات مع نماذج الإجابة لأساتذة القسم.',
  },
  {
    id: 6,
    title: '🌿 أطلس تشريح النبات والميكروبيولوجي (Botany Microscopic Atlas)',
    dept: 'مزدوج كيمياء / نبات',
    level: 'المستوى الثاني',
    type: 'lab',
    typeName: 'مذكرات وتجارب المعامل',
    fileSize: '12.1 MB',
    format: 'PDF',
    downloads: 134,
    date: '2026-02-10',
    author: 'قسم أحياء الرابطة',
    description: 'صور ميكروسكوبية عالية الجودة للقطاعات العرضية في أوراق وسقان النباتات والبكتيريا.',
  },
];

const STUDY_GROUPS = [
  {
    id: 1,
    title: 'مجموعة دراسة: الكيمياء العضوية المتقدمة والميكانيكية',
    dept: 'الكيمياء منفرد ومزدوج',
    level: 'المستوى الثالث',
    lead: 'مصعب طارق (المستوى الرابع)',
    schedule: 'كل سبت وثلاثاء - 5:00 مساءً (أونلاين + مكتبة الكلية)',
    members: '18 طالباً',
    link: 'https://chat.whatsapp.com/sample_chem',
  },
  {
    id: 2,
    title: 'حلقة مذاكرة: الفيزياء الحيوية والفيزياء الإشعاعية',
    dept: 'الفيزياء الحيوية',
    level: 'المستوى الثاني',
    lead: 'ياسر محمد علي',
    schedule: 'كل أحد وأربعاء - 4:30 عصراً',
    members: '14 طالباً',
    link: 'https://chat.whatsapp.com/sample_phys',
  },
  {
    id: 3,
    title: 'نادي البيوتكنولوجي والهندسة الوراثية',
    dept: 'التكنولوجيا الحيوية',
    level: 'المستويان الثالث والرابع',
    lead: 'سارة عبد الرحمن',
    schedule: 'كل جمعة - 7:00 مساءً (Zoom)',
    members: '25 طالباً',
    link: 'https://chat.whatsapp.com/sample_biotech',
  },
];

const SCHOLARSHIPS_TRAINING = [
  {
    id: 1,
    title: 'منح الماجستير والدكتوراه للطلاب السودانيين المتفوقين',
    provider: 'الجامعات الأوروبية ومعهد بحر التكنولوجيا (Erasmus+ & DAAD)',
    deadline: '30 إبريل 2026',
    type: 'منحة دراسية كاملة',
    desc: 'فرص ابتعاث ممولة بالكامل لخريجي كليات العلوم في تخصصات الكيمياء، الفيزياء الحيوية، والطاقة المتجددة.',
  },
  {
    id: 2,
    title: 'التدريب الصيفي في المركز القومي للبحوث (NRC - مصر)',
    provider: 'المركز القومي للبحوث بالقاهرة',
    deadline: '15 مايو 2026',
    type: 'تدريب عملي بمعامل الأبحاث',
    desc: 'تدريب معملي مكثف لطلاب السنوات النهائية في تحاليل الكروماتوجرافي والبيولوجيا الجزيئية ومطياف الكتلة.',
  },
  {
    id: 3,
    title: 'برنامج زمالة البحث العلمي والابتكار الصيدلاني',
    provider: 'مدينة زويل للعلوم والتكنولوجيا',
    deadline: '1 يونيو 2026',
    type: 'تدريب وتأهيل بحثي',
    desc: 'برنامج تدريبي صيفي مكثف مع مكافأة بحثية وشهادة معتمدة دولياً في تصنيع الدواء وتقنية النانو.',
  },
];

export default function AcademicLibrary() {
  const { activeTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'exams' | 'groups' | 'grants' | 'calendar'
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [selectedDept, setSelectedDept] = useState('جميع التخصصات');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const tabs = [
    { id: 'notes', label: 'مذكرات ومراجع', icon: BookOpen, count: 'ملخصات ومعامل' },
    { id: 'exams', label: 'امتحانات سابقة', icon: FileText, count: 'نماذج وحلول' },
    { id: 'groups', label: 'مجموعات دراسة', icon: Users, count: 'حلقات مذاكرة' },
    { id: 'grants', label: 'منح وتدريب', icon: Award, count: 'فرص أكاديمية' },
    { id: 'calendar', label: 'التقويم وجدول الامتحانات', icon: Calendar, count: 'مواعيد الكلية' },
  ];

  const filteredNotesAndExams = resources.filter((item) => {
    if (activeTab === 'notes' && item.type === 'exam') return false;
    if (activeTab === 'exams' && item.type !== 'exam') return false;

    const matchesLevel = selectedLevel === 'الكل' || item.level === selectedLevel;
    const matchesDept = selectedDept === 'جميع التخصصات' || item.dept === selectedDept;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesDept && matchesSearch;
  });

  const handleDownload = (item) => {
    setResources((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, downloads: r.downloads + 1 } : r))
    );

    setDownloadSuccess(`جاري بدء تحميل "${item.title}"...`);
    setTimeout(() => {
      setDownloadSuccess('');
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px 80px', direction: 'rtl' }}>
      
      {/* رأس الصفحة الأكاديمية */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            marginBottom: '12px',
          }}
        >
          <GraduationCap size={16} />
          <span>القطاع الأكاديمي - كلية العلوم جامعة القاهرة</span>
        </div>
        <h1 style={{ color: activeTheme.textMain, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', margin: '0 0 10px' }}>
          المنصة الأكاديمية والمكتبة المركزية
        </h1>
        <p style={{ color: activeTheme.textMuted, fontSize: '14px', maxWidth: '700px', margin: '0 auto' }}>
          مذكرات المحاضرات، بنك الامتحانات المحلولة، مجموعات المذاكرة التفاعلية، وفرص المنح والتدريب الصيفي لجميع الأقسام العلمية الـ 11.
        </p>
      </div>

      {/* التبويبات الرئيسية الخمسة */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          backgroundColor: activeTheme.bgCard,
          padding: '8px',
          borderRadius: '18px',
          border: `1px solid ${activeTheme.border}`,
          marginBottom: '26px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
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
                padding: '12px 14px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${activeTheme.accent}` : '2px solid transparent',
                background: isSelected
                  ? `linear-gradient(135deg, ${activeTheme.primary}40, ${activeTheme.secondary}40)`
                  : 'transparent',
                color: isSelected ? activeTheme.accentLight : activeTheme.textMain,
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : '600',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                textAlign: 'right',
              }}
            >
              <Icon size={18} color={isSelected ? activeTheme.accent : activeTheme.textMuted} />
              <div>
                <div>{tab.label}</div>
                <div style={{ fontSize: '10px', color: activeTheme.textMuted, fontWeight: 'normal' }}>
                  {tab.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {downloadSuccess && (
        <div
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#22c55e',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          <CheckCircle size={18} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 1. المذكرات & 2. الامتحانات السابقة */}
      {(activeTab === 'notes' || activeTab === 'exams') && (
        <>
          {/* فلاتر البحث السريعة */}
          <div
            style={{
              backgroundColor: activeTheme.bgCard,
              borderRadius: '18px',
              border: `1px solid ${activeTheme.border}`,
              padding: '20px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: activeTheme.textMuted, marginBottom: '6px' }}>
                🔍 البحث في المذكرات والامتحانات:
              </label>
              <input
                type="text"
                placeholder="ابحث باسم المادة أو التخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={selectStyle(activeTheme)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: activeTheme.textMuted, marginBottom: '6px' }}>
                🏛️ المستوى الدراسي:
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={selectStyle(activeTheme)}
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} style={{ background: activeTheme.isDark ? '#0f172a' : '#ffffff' }}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: activeTheme.textMuted, marginBottom: '6px' }}>
                🔬 القسم العلمي / التخصص:
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                style={selectStyle(activeTheme)}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} style={{ background: activeTheme.isDark ? '#0f172a' : '#ffffff' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* شبكة المذكرات / الامتحانات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredNotesAndExams.map((item) => (
              <div
                key={item.id}
                style={{
                  background: activeTheme.bgCard,
                  border: `1px solid ${activeTheme.border}`,
                  borderRadius: '18px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                      {item.typeName}
                    </span>
                    <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>
                      {item.format} • {item.fileSize}
                    </span>
                  </div>

                  <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px', lineHeight: '1.5' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {item.description}
                  </p>

                  <div style={{ fontSize: '12px', color: activeTheme.accentLight, marginBottom: '14px', fontWeight: '600' }}>
                    <div>🏛️ {item.level}</div>
                    <div>🔬 {item.dept}</div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${activeTheme.border}`, paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>📥 {item.downloads} تنزيل</span>
                  <button
                    onClick={() => handleDownload(item)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                      color: '#0b1622',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={14} />
                    <span>تنزيل الملف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. مجموعات الدراسة */}
      {activeTab === 'groups' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {STUDY_GROUPS.map((grp) => (
            <div
              key={grp.id}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                    {grp.dept}
                  </span>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{grp.members}</span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                  {grp.title}
                </h3>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px', fontSize: '12px', color: activeTheme.textMain, marginBottom: '16px', lineHeight: '1.7' }}>
                  <div>👑 <strong>منسق المجموعة:</strong> {grp.lead}</div>
                  <div>⏰ <strong>المواعيد:</strong> {grp.schedule}</div>
                  <div>🎯 <strong>المستوى المستهدف:</strong> {grp.level}</div>
                </div>
              </div>

              <a
                href={grp.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>الانضمام لمجموعة الواتساب / التليجرام</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 4. منح وتدريب */}
      {activeTab === 'grants' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {SCHOLARSHIPS_TRAINING.map((g) => (
            <div
              key={g.id}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                    {g.type}
                  </span>
                  <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>
                    آخر موعد: {g.deadline}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                  {g.title}
                </h3>

                <div style={{ fontSize: '12px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '10px' }}>
                  🏛️ الجهة المانحة: {g.provider}
                </div>

                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {g.desc}
                </p>
              </div>

              <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: `1px solid ${activeTheme.border}` }}>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                    color: '#0b1622',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textDecoration: 'none',
                  }}
                >
                  <span>التقديم والاستفسار عبر الأمانة الأكاديمية</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. التقويم الأكاديمي */}
      {activeTab === 'calendar' && (
        <AcademicCalendar />
      )}
    </div>
  );
}

const selectStyle = (theme) => ({
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.textMain,
  fontSize: '13px',
  outline: 'none',
  direction: 'rtl',
  boxSizing: 'border-box',
});
