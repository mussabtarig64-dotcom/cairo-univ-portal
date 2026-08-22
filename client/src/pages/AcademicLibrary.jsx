import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  ExternalLink,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

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

const DEFAULT_RESOURCES = [
  {
    _id: 'res-1',
    title: '📘 مذكرة ملخص تجارب كيمياء عامة (Gen Chemistry Lab Manual 101)',
    dept: 'الكيمياء منفرد',
    category: 'الكيمياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'lab',
    typeName: 'مذكرات وتجارب المعامل',
    fileSize: '4.2 MB',
    format: 'PDF',
    downloads: 142,
    date: '2026-01-15',
    author: 'اللجنة الأكاديمية - قسم الكيمياء',
    description: 'شرح مفصل لكافة تجارب التحليل الحجمي والتجاري وقواعد الأمان داخل المعمل مع الأسئلة الإرشاديّة.',
    section: 'notes',
  },
  {
    _id: 'res-2',
    title: '⚡ مراجعة قوانين البصريات والفيزياء الحديثة (Optics & Modern Physics)',
    dept: 'الفيزياء منفرد',
    category: 'الفيزياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'summary',
    typeName: 'مذكرات ومحاضرات',
    fileSize: '5.8 MB',
    format: 'PDF',
    downloads: 219,
    date: '2026-02-01',
    author: 'نادي الفيزياء بالرابطة',
    description: 'ملخص شامل للقوانين والمعادلات البصرية وتطبيقاتها المعملية.',
    section: 'notes',
  },
  {
    _id: 'res-3',
    title: '📑 امتحان منتصف الفصل (Midterm Exam) - تفاضل وتكامل (Calculus 1)',
    dept: 'الكيمياء منفرد',
    category: 'الكيمياء منفرد',
    level: 'المستوى الأول (إعدادي علوم)',
    type: 'exam',
    typeName: 'امتحانات سابقة',
    fileSize: '2.1 MB',
    format: 'PDF',
    downloads: 310,
    date: '2025-12-10',
    author: 'أرشيف الرابطة الأكاديمي',
    description: 'نموذج امتحان الميدتيرم للسنوات الماضية مع الإجابة النموذجية المعتمدة.',
    section: 'exams',
  },
  {
    _id: 'res-4',
    title: '🧪 مذكرة الكيمياء العضوية والإنزيمات (Organic & Biochemistry Notes)',
    dept: 'مزدوج الكيمياء الحيوية',
    category: 'مزدوج الكيمياء الحيوية',
    level: 'المستوى الثاني',
    type: 'summary',
    typeName: 'مذكرات ومحاضرات',
    fileSize: '8.5 MB',
    format: 'PDF',
    downloads: 198,
    date: '2026-01-20',
    author: 'فريق التميز الأكاديمي',
    description: 'تجميعة شاملة لتفاعلات المركبات العضوية والإنزيمات الدقيقة مع المخططات التوضيحية.',
    section: 'notes',
  },
  {
    _id: 'res-5',
    title: '📑 بنك امتحانات التكنولوجيا الحيوية والجينوم (Biotech Final Exams Archive)',
    dept: 'التكنولوجيا الحيوية',
    category: 'التكنولوجيا الحيوية',
    level: 'المستوى الثالث',
    type: 'exam',
    typeName: 'امتحانات سابقة',
    fileSize: '11.4 MB',
    format: 'PDF',
    downloads: 265,
    date: '2026-01-18',
    author: 'الأمانة الأكاديمية',
    description: 'أسئلة الامتحانات النهائية لآخر 5 سنوات مع نماذج الإجابة لأساتذة القسم.',
    section: 'exams',
  },
  {
    _id: 'res-6',
    title: '🌿 أطلس تشريح النبات والميكروبيولوجي (Botany Microscopic Atlas)',
    dept: 'مزدوج كيمياء / نبات',
    category: 'مزدوج كيمياء / نبات',
    level: 'المستوى الثاني',
    type: 'lab',
    typeName: 'مذكرات وتجارب المعامل',
    fileSize: '12.1 MB',
    format: 'PDF',
    downloads: 134,
    date: '2026-02-10',
    author: 'قسم أحياء الرابطة',
    description: 'صور ميكروسكوبية عالية الجودة للقطاعات العرضية في أوراق وسقان النباتات والبكتيريا.',
    section: 'notes',
  },
];

const DEFAULT_GROUPS = [
  {
    _id: 'grp-1',
    title: 'مجموعة دراسة: الكيمياء العضوية المتقدمة والميكانيكية',
    dept: 'الكيمياء منفرد ومزدوج',
    category: 'الكيمياء منفرد ومزدوج',
    level: 'المستوى الثالث',
    lead: 'مصعب طارق (المستوى الرابع)',
    author: 'مصعب طارق',
    schedule: 'كل سبت وثلاثاء - 5:00 مساءً (أونلاين + مكتبة الكلية)',
    members: '18 طالباً',
    link: 'https://chat.whatsapp.com/sample_chem',
    section: 'groups',
  },
  {
    _id: 'grp-2',
    title: 'حلقة مذاكرة: الفيزياء الحيوية والفيزياء الإشعاعية',
    dept: 'الفيزياء الحيوية',
    category: 'الفيزياء الحيوية',
    level: 'المستوى الثاني',
    lead: 'ياسر محمد علي',
    author: 'ياسر محمد علي',
    schedule: 'كل أحد وأربعاء - 4:30 عصراً',
    members: '14 طالباً',
    link: 'https://chat.whatsapp.com/sample_phys',
    section: 'groups',
  },
  {
    _id: 'grp-3',
    title: 'نادي البيوتكنولوجي والهندسة الوراثية',
    dept: 'التكنولوجيا الحيوية',
    category: 'التكنولوجيا الحيوية',
    level: 'المستويان الثالث والرابع',
    lead: 'سارة عبد الرحمن',
    author: 'سارة عبد الرحمن',
    schedule: 'كل جمعة - 7:00 مساءً (Zoom)',
    members: '25 طالباً',
    link: 'https://chat.whatsapp.com/sample_biotech',
    section: 'groups',
  },
];

const DEFAULT_GRANTS = [
  {
    _id: 'grn-1',
    title: 'منح الماجستير والدكتوراه للطلاب السودانيين المتفوقين',
    provider: 'الجامعات الأوروبية ومعهد بحر التكنولوجيا (Erasmus+ & DAAD)',
    deadline: '30 إبريل 2026',
    type: 'منحة دراسية كاملة',
    badge: 'منحة دراسية كاملة',
    category: 'منح دراسية',
    description: 'فرص ابتعاث ممولة بالكامل لخريجي كليات العلوم في تخصصات الكيمياء، الفيزياء الحيوية، والطاقة المتجددة.',
    section: 'grants',
  },
  {
    _id: 'grn-2',
    title: 'التدريب الصيفي في المركز القومي للبحوث (NRC - مصر)',
    provider: 'المركز القومي للبحوث بالقاهرة',
    deadline: '15 مايو 2026',
    type: 'تدريب عملي بمعامل الأبحاث',
    badge: 'تدريب عملي بمعامل الأبحاث',
    category: 'تدريب صيفي',
    description: 'تدريب معملي مكثف لطلاب السنوات النهائية في تحاليل الكروماتوجرافي والبيولوجيا الجزيئية ومطياف الكتلة.',
    section: 'grants',
  },
  {
    _id: 'grn-3',
    title: 'برنامج زمالة البحث العلمي والابتكار الصيدلاني',
    provider: 'مدينة زويل للعلوم والتكنولوجيا',
    deadline: '1 يونيو 2026',
    type: 'تدريب وتأهيل بحثي',
    badge: 'تدريب وتأهيل بحثي',
    category: 'زمالة بحثية',
    description: 'برنامج تدريبي صيفي مكثف مع مكافأة بحثية وشهادة معتمدة دولياً في تصنيع الدواء وتقنية النانو.',
    section: 'grants',
  },
];

export default function AcademicLibrary() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'exams' | 'groups' | 'grants' | 'calendar'
  const [resources, setResources] = useState(DEFAULT_RESOURCES);
  const [studyGroups, setStudyGroups] = useState(DEFAULT_GROUPS);
  const [grantsList, setGrantsList] = useState(DEFAULT_GRANTS);

  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [selectedDept, setSelectedDept] = useState('جميع التخصصات');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'notes', label: 'مذكرات ومراجع', icon: BookOpen, count: 'ملخصات ومعامل' },
    { id: 'exams', label: 'امتحانات سابقة', icon: FileText, count: 'نماذج وحلول' },
    { id: 'groups', label: 'مجموعات دراسة', icon: Users, count: 'حلقات مذاكرة' },
    { id: 'grants', label: 'منح وتدريب', icon: Award, count: 'فرص أكاديمية' },
    { id: 'calendar', label: 'التقويم وجدول الامتحانات', icon: Calendar, count: 'مواعيد الكلية' },
  ];

  // Fetch Live Academic Content from MongoDB
  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('academic');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicRes = dynamicItems.filter((i) => i.section === 'notes' || i.section === 'exams');
        const dynamicGrps = dynamicItems.filter((i) => i.section === 'groups');
        const dynamicGrants = dynamicItems.filter((i) => i.section === 'grants');

        if (dynamicRes.length > 0) {
          const ids = new Set(dynamicRes.map((d) => d._id));
          setResources([...dynamicRes, ...DEFAULT_RESOURCES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicGrps.length > 0) {
          const ids = new Set(dynamicGrps.map((d) => d._id));
          setStudyGroups([...dynamicGrps, ...DEFAULT_GROUPS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicGrants.length > 0) {
          const ids = new Set(dynamicGrants.map((d) => d._id));
          setGrantsList([...dynamicGrants, ...DEFAULT_GRANTS.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'groups') {
      setStudyGroups(action === 'create' ? [item, ...studyGroups] : studyGroups.map((g) => (g._id === item._id ? item : g)));
    } else if (item.section === 'grants') {
      setGrantsList(action === 'create' ? [item, ...grantsList] : grantsList.map((g) => (g._id === item._id ? item : g)));
    } else {
      setResources(action === 'create' ? [item, ...resources] : resources.map((r) => (r._id === item._id ? item : r)));
    }
    setNotification(action === 'create' ? 'تمت إضافة المحتوى الأكاديمي بنجاح!' : 'تم تحديث المحتوى الأكاديمي بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المحتوى الأكاديمي؟')) {
      try {
        if (!id.startsWith('res-') && !id.startsWith('grp-') && !id.startsWith('grn-')) {
          await deleteHubContent(id);
        }
        if (section === 'groups') {
          setStudyGroups(studyGroups.filter((g) => g._id !== id));
        } else if (section === 'grants') {
          setGrantsList(grantsList.filter((g) => g._id !== id));
        } else {
          setResources(resources.filter((r) => r._id !== id));
        }
        setNotification('تم حذف العنصر بنجاح.');
        setTimeout(() => setNotification(''), 4000);
      } catch (err) {
        alert('فشل الحذف: ' + err.message);
      }
    }
  };

  const filteredNotesAndExams = resources.filter((item) => {
    if (activeTab === 'notes' && (item.type === 'exam' || item.section === 'exams')) return false;
    if (activeTab === 'exams' && (item.type !== 'exam' && item.section !== 'exams')) return false;

    const matchesLevel = selectedLevel === 'الكل' || item.level === selectedLevel;
    const matchesDept = selectedDept === 'جميع التخصصات' || (item.dept === selectedDept || item.category === selectedDept);
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.dept && item.dept.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLevel && matchesDept && matchesSearch;
  });

  const handleDownload = (item) => {
    setResources((prev) =>
      prev.map((r) => (r._id === item._id ? { ...r, downloads: (r.downloads || 0) + 1 } : r))
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
            padding: '6px 20px',
            borderRadius: '30px',
            color: '#fbbf24',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '14px',
          }}
        >
          <GraduationCap size={16} />
          <span>القطاع الأكاديمي - كلية العلوم جامعة القاهرة</span>
        </div>
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '900', margin: '0 0 12px' }}>
          المنصة الأكاديمية والمكتبة المركزية
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '750px', margin: '0 auto 20px', lineHeight: '1.8' }}>
          مذكرات المحاضرات، بنك الامتحانات المحلولة، مجموعات المذاكرة التفاعلية، وفرص المنح والتدريب الصيفي لجميع الأقسام العلمية الـ 11.
        </p>

        {/* Admin CMS Trigger */}
        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
              }}
            >
              <PlusCircle size={18} />
              <span>+ إضافة مذكرة أو امتحان أو منحة (لوحة الإدارة)</span>
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#34d399', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* التبويبات الرئيسية الخمسة */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          backgroundColor: '#0f172a',
          padding: '8px',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '26px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
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
                border: isSelected ? '2px solid #f59e0b' : '2px solid transparent',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: isSelected ? '#fbbf24' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : '600',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                textAlign: 'right',
              }}
            >
              <Icon size={18} color={isSelected ? '#f59e0b' : '#94a3b8'} />
              <div>
                <div>{tab.label}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>
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
            color: '#34d399',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
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
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '22px',
              marginBottom: '26px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
                🔍 البحث في المذكرات والامتحانات:
              </label>
              <input
                type="text"
                placeholder="ابحث باسم المادة أو التخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={filterInputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
                🏛️ المستوى الدراسي:
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={filterInputStyle}
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
                🔬 القسم العلمي / التخصص:
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                style={filterInputStyle}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* شبكة المذكرات / الامتحانات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {filteredNotesAndExams.map((item) => (
              <div
                key={item._id}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '4px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                      {item.typeName || (item.type === 'exam' ? 'امتحانات سابقة' : 'مذكرات')}
                    </span>
                    <span style={{ fontSize: '12px', color: '#cbd5e1', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>
                      {item.format || 'PDF'} • {item.fileSize || '3.5 MB'}
                    </span>
                  </div>

                  <h3 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px', lineHeight: '1.5' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }}>
                    {item.description}
                  </p>

                  <div style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '16px', fontWeight: '600' }}>
                    <div>🏛️ {item.level || 'المستوى الأكاديمي'}</div>
                    <div style={{ marginTop: '3px' }}>🔬 {item.dept || item.category || 'كلية العلوم'}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>📥 {item.downloads || 0} تنزيل</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleDownload(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#0b1622',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Download size={15} />
                      <span>تنزيل الملف</span>
                    </button>

                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id, activeTab)}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. مجموعات الدراسة */}
      {activeTab === 'groups' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          {studyGroups.map((grp) => (
            <div
              key={grp._id}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                    {grp.dept || grp.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>{grp.members || '15 طالباً'}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                  {grp.title}
                </h3>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', fontSize: '13px', color: '#ffffff', marginBottom: '16px', lineHeight: '1.8' }}>
                  <div>👑 <strong>منسق المجموعة:</strong> {grp.lead || grp.author}</div>
                  <div>⏰ <strong>المواعيد:</strong> {grp.schedule || 'أسبوعياً'}</div>
                  <div>🎯 <strong>المستوى المستهدف:</strong> {grp.level || 'جميع المستويات'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                <a
                  href={grp.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>الانضمام للمجموعة</span>
                  <ExternalLink size={14} />
                </a>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(grp);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(grp._id, 'groups')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. منح وتدريب */}
      {activeTab === 'grants' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          {grantsList.map((g) => (
            <div
              key={g._id}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                    {g.badge || g.type || 'فرصة تدريب'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 'bold' }}>
                    آخر موعد: {g.deadline || 'مستمر'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                  {g.title}
                </h3>

                {g.provider && (
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px' }}>
                    🏛️ الجهة المانحة: {g.provider}
                  </div>
                )}

                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                  {g.description}
                </p>
              </div>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0b1622',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  <span>التقديم والاستفسار الأكاديمي</span>
                  <ChevronRight size={16} />
                </a>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(g);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(g._id, 'grants')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. التقويم الأكاديمي */}
      {activeTab === 'calendar' && (
        <AcademicCalendar />
      )}

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="academic"
        section={activeTab}
        sectionsList={tabs}
        editingItem={editingItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}

const filterInputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  direction: 'rtl',
  boxSizing: 'border-box',
};
