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
  FileCode,
  FlaskConical,
  Calculator,
  Cpu,
  Globe,
  Calendar
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
  'العلوم العامة',
  'علوم الحاسب والمعلومات (Computer Science)',
  'الكيمياء والكيمياء الحيوية',
  'الفيزياء والبيوفيزياء',
  'الرياضيات والإحصاء',
  'علم النبات والميكروبيولوجي',
  'علم الحيوان والحشرات',
  'الجيولوجيا والجيوفيزياء',
];

const RESOURCE_TYPES = [
  { id: 'all', label: 'جميع الملفات' },
  { id: 'summary', label: 'ملخصات المحاضرات' },
  { id: 'lab', label: 'مذكرات وتجارب المعامل' },
  { id: 'exam', label: 'امتحانات ومراجعات سابقة' },
  { id: 'book', label: 'مراجع وكتب علمية' },
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: '📘 مذكرة ملخص تجارب كيمياء عامة (Gen Chemistry Lab Manual 101)',
    dept: 'الكيمياء والكيمياء الحيوية',
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
    title: '💻 تجميعة مراجعات ومسائل البرمجة بـ Python & C++ - المستوى الأول',
    dept: 'علوم الحاسب والمعلومات (Computer Science)',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'summary',
    typeName: 'ملخصات المحاضرات',
    fileSize: '6.8 MB',
    format: 'ZIP',
    downloads: 289,
    date: '2026-02-01',
    author: 'نادي الحاسب بالرابطة',
    description: 'كود كامل مع الشرح لتمارين الخوارزميات وهياكل البيانات الأساسية الخاصة بمقررات الحاسب.',
  },
  {
    id: 3,
    title: '📑 امتحان منتصف الفصل (Midterm Exam) - تفاضل وتكامل (Calculus 1)',
    dept: 'الرياضيات والإحصاء',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'exam',
    typeName: 'امتحانات ومراجعات سابقة',
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
    dept: 'الكيمياء والكيمياء الحيوية',
    level: 'المستوى الثاني',
    type: 'summary',
    typeName: 'ملخصات المحاضرات',
    fileSize: '8.5 MB',
    format: 'PDF',
    downloads: 198,
    date: '2026-01-20',
    author: 'فريق التميز الأكاديمي',
    description: 'تجميعة شاملة لتفاعلات المركبات العضوية والإنزيمات الدقيقة مع المخططات التوضيحية.',
  },
  {
    id: 5,
    title: '⚡ كتاب الفيزياء الحديثة والبصرية (Modern Optics & Physics Reference)',
    dept: 'الفيزياء والبيوفيزياء',
    level: 'المستوى الثاني',
    type: 'book',
    typeName: 'مراجع وكتب علمية',
    fileSize: '15.4 MB',
    format: 'PDF',
    downloads: 95,
    date: '2025-11-28',
    author: 'دليل مراجع الرابطة',
    description: 'مرجع عالمي مبسط يشمل قوانين البصريات والكهرومغناطيسية المقررة بكلية العلوم.',
  },
  {
    id: 6,
    title: '🌿 أطلس تشريح النبات والميكروبيولوجي (Botany Microscopic Atlas)',
    dept: 'علم النبات والميكروبيولوجي',
    level: 'المستوى الثالث',
    type: 'lab',
    typeName: 'مذكرات وتجارب المعامل',
    fileSize: '12.1 MB',
    format: 'PDF',
    downloads: 134,
    date: '2026-02-10',
    author: 'قسم أحياء الرابطة',
    description: 'صور ميكروسكوبية عالية الجودة للقطاعات العرضية في أوراق وسقان النباتات والبكتيريا.',
  },
  {
    id: 7,
    title: '🎓 تجميعة مشاريع التخرج السابقة - علوم الحاسب (CS Graduation Projects)',
    dept: 'علوم الحاسب والمعلومات (Computer Science)',
    level: 'المستوى الرابع (تخرج)',
    type: 'summary',
    typeName: 'ملخصات المحاضرات',
    fileSize: '24.0 MB',
    format: 'ZIP',
    downloads: 412,
    date: '2026-01-05',
    author: 'خريجو الرابطة',
    description: 'ملفات وتوثيق المشاريع الفائزة بالمراكز الأولى بكلية العلوم في الذكاء الاصطناعي وشبكات البيانات.',
  },
  {
    id: 8,
    title: '📑 مراجعة الامتحانات الشاملة - الجيولوجيا وعلم الصخور (Geology Past Papers)',
    dept: 'الجيولوجيا والجيوفيزياء',
    level: 'المستوى الثالث',
    type: 'exam',
    typeName: 'امتحانات ومراجعات سابقة',
    fileSize: '5.3 MB',
    format: 'PDF',
    downloads: 167,
    date: '2026-01-28',
    author: 'أرشيف الرابطة الأكاديمي',
    description: 'تجميع أسئلة السنوات السابقة مع حل الخرائط الجيولوجية والتراكيب الصخرية.',
  },
];

export default function AcademicLibrary() {
  const { activeTheme } = useTheme();

  const [mainTab, setMainTab] = useState('library'); // 'library' | 'calendar'
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [selectedDept, setSelectedDept] = useState('جميع التخصصات');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const filteredResources = resources.filter((item) => {
    const matchesLevel = selectedLevel === 'الكل' || item.level === selectedLevel;
    const matchesDept = selectedDept === 'جميع التخصصات' || item.dept === selectedDept;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesDept && matchesType && matchesSearch;
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
      
      {/* 0. أزرار تبديل المحتوى: المكتبة vs التقويم الأكاديمي */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setMainTab('library')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: `1px solid ${mainTab === 'library' ? activeTheme.accent : activeTheme.border}`,
            background: mainTab === 'library' ? activeTheme.primary : activeTheme.bgCard,
            color: mainTab === 'library' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            boxShadow: mainTab === 'library' ? '0 6px 20px rgba(245, 158, 11, 0.3)' : 'none',
          }}
        >
          <BookOpen size={18} />
          <span>📚 المكتبة الأكاديمية وأرشيف المذكرات</span>
        </button>

        <button
          onClick={() => setMainTab('calendar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: `1px solid ${mainTab === 'calendar' ? activeTheme.accent : activeTheme.border}`,
            background: mainTab === 'calendar' ? activeTheme.primary : activeTheme.bgCard,
            color: mainTab === 'calendar' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            boxShadow: mainTab === 'calendar' ? '0 6px 20px rgba(245, 158, 11, 0.3)' : 'none',
          }}
        >
          <Calendar size={18} />
          <span>🗓️ التقويم الأكاديمي وجدول امتحانات الكلية</span>
        </button>
      </div>

      {mainTab === 'calendar' ? (
        <AcademicCalendar />
      ) : (
        <>
          {/* 1. هيدر المكتبة الرقمية */}
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
              overflow: 'hidden',
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
          <BookOpen size={30} />
        </div>

        <h1 style={{ color: activeTheme.textMain, fontSize: '26px', fontWeight: '900', margin: '0 0 10px' }}>
          المكتبة الأكاديمية الرقمية وأرشيف الامتحانات
        </h1>
        <p style={{ color: activeTheme.accentLight, fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
          رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
        </p>
        <p style={{ color: activeTheme.textMuted, fontSize: '13px', marginTop: '6px', maxWidth: '700px', margin: '8px auto 0' }}>
          منصة متكاملة لتصفح وتنزيل مذكرات المعامل، ملخصات المحاضرات، المراجع العلمية، وأرشيف الامتحانات السابقة مقسمة حسب المستويات والأقسام الأكاديمية.
        </p>

        {/* تنبيه نجاح التحميل */}
        {downloadSuccess && (
          <div
            style={{
              marginTop: '20px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#22c55e',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FolderDown size={18} />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. أدوات التصفية والبحث */}
      <div
        style={{
          background: activeTheme.bgCard,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        {/* شريط البحث */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="ابحث عن اسم المذكرة، الدكتور، التخصص، أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 44px 13px 16px',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: `1px solid ${activeTheme.border}`,
              color: activeTheme.textMain,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              direction: 'rtl',
            }}
          />
          <Search
            size={20}
            color={activeTheme.accentLight}
            style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)' }}
          />
        </div>

        {/* فلاتر الأقسام والمستويات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              🏛️ المستوى الأكاديمي:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={selectStyle(activeTheme)}
            >
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              🔬 القسم / التخصص العلمي:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={selectStyle(activeTheme)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* تبويبات أنواع الملفات */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {RESOURCE_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 'bold' : '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: `1px solid ${isSelected ? activeTheme.accent : activeTheme.border}`,
                  background: isSelected ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
                  color: isSelected ? '#ffffff' : activeTheme.textMuted,
                  transition: 'all 0.2s ease',
                }}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. شبكة عرض المذكرات والملفات */}
      {filteredResources.length === 0 ? (
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '20px',
            padding: '48px 24px',
            textAlign: 'center',
            color: activeTheme.textMuted,
          }}
        >
          <BookOpen size={48} color={activeTheme.accentLight} style={{ marginBottom: '14px' }} />
          <h3 style={{ color: activeTheme.textMain, fontSize: '18px', margin: '0 0 8px' }}>لم يتم العثور على مذكرات مطابقة</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>جرب ضبط فلاتر البحث أو اختيار مستوى أكاديمي آخر.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {filteredResources.map((item) => (
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
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div>
                {/* رأس الكارت */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '3px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    {item.typeName}
                  </span>

                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: activeTheme.textMuted,
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {item.format} • {item.fileSize}
                  </span>
                </div>

                {/* عنوان وصفي */}
                <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', lineHeight: '1.5', margin: '0 0 10px' }}>
                  {item.title}
                </h3>

                <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.7', margin: '0 0 16px' }}>
                  {item.description}
                </p>

                {/* معلومات التخصص والمستوى */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: activeTheme.accentLight, marginBottom: '16px', fontWeight: '600' }}>
                  <div>🏛️ {item.level}</div>
                  <div>🔬 {item.dept}</div>
                </div>
              </div>

              {/* أسفل الكارت ورابط التنزيل */}
              <div style={{ borderTop: `1px solid ${activeTheme.border}`, paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '11px', color: activeTheme.textMuted }}>
                  <span>📥 {item.downloads} تنزيل</span>
                </div>

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
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Download size={15} />
                  <span>تنزيل الملف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
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
