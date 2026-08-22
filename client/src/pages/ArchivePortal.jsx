import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Archive,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  FileText,
  Image,
  FolderArchive,
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_ARCHIVE_ITEMS = [
  {
    _id: 'arch-1',
    title: '📄 المجلة العلمية السنوية - العدد التذكاري الخامس',
    subtitle: 'مجلة تصدر عن اللجنة الأكاديمية برابطة الطلاب السودانيين',
    description: 'ملف توثيقي شامل للأبحاث الطلابية المتميزة، مقالات علمية في الكيمياء والبيولوجيا، وتكريم أوائل الخريجين.',
    category: 'مطبوعات ومجلات',
    year: '2025',
    date: 'نوفمبر 2025',
    badge: 'إصدار رسمي معتمد',
    fileSize: '8.4 MB PDF',
    link: '#',
    icon: '📰',
  },
  {
    _id: 'arch-2',
    title: '🖼️ الألبوم التاريخي المصور: مؤتمر الخريجين ويوم الوفاء',
    subtitle: 'قاعة الاحتفالات الكبرى - جامعة القاهرة',
    description: 'أرشيف الصور التذكارية لوفود الطلاب السودانيين مع عمداء وأساتذة كلية العلوم عبر السنوات الماضية.',
    category: 'صور تاريخية',
    year: '2024',
    date: 'ديسمبر 2024',
    badge: 'ألبوم صور عالي الدقة',
    fileSize: '15.2 MB ZIP',
    link: '#',
    icon: '📸',
  },
  {
    _id: 'arch-3',
    title: '📜 الميثاق التأسيسي واللوائح التنظيمية للرابطة (نسخة تاريخية مصدقة)',
    subtitle: 'المرجعية الدستورية المعتمدة',
    description: 'الوثيقة الأصلية المعتمدة لإنشاء رابطة طلاب كلية العلوم مع بنود التمثيل الطلابي واللجان التخصصية.',
    category: 'قرارات ووثائق رسمية',
    year: '2023',
    date: 'أكتوبر 2023',
    badge: 'وثيقة رسمية',
    fileSize: '3.1 MB PDF',
    link: '#',
    icon: '🏛️',
  },
  {
    _id: 'arch-4',
    title: '🏆 السجل التوثيقي لبطولات كأس الاستقلال ودوري العلوم',
    subtitle: 'الأمانة الرياضية',
    description: 'كتاب توثيقي يستعرض مسيرة الفرق الرياضية، أسماء التشكيلات الفائزة بالكؤوس، وسجل الهدافين منذ عام 2020.',
    category: 'سجلات رياضية',
    year: '2025',
    date: 'يناير 2025',
    badge: 'سجل الشرف',
    fileSize: '6.7 MB PDF',
    link: '#',
    icon: '⚽',
  },
  {
    _id: 'arch-5',
    title: '🌍 ملتقى التراث والأصالة السودانية الأول - كتيب المعرض',
    subtitle: 'أمانة الثقافة والإعلام',
    description: 'كتيب توثيقي للمقتنيات التراثية، أزياء الولايات السودانية، والمعارض الفنية المقامة بحرم الجامعة.',
    category: 'فعاليات ومؤتمرات',
    year: '2024',
    date: 'مارس 2024',
    badge: 'كتيب ثقافي',
    fileSize: '9.8 MB PDF',
    link: '#',
    icon: '🇸🇩',
  },
  {
    _id: 'arch-6',
    title: '📊 التقرير الختامي للدورات التدريبية والتأهيل المعملي',
    subtitle: 'الأمانة الأكاديمية بالتعاون مع المركز القومي للبحوث',
    description: 'توثيق نتائج برامج التدريب الصيفي لـ 140 طالباً في معامل التحليل الكيميائي والتقنية الحيوية.',
    category: 'تقارير أكاديمية',
    year: '2023',
    date: 'سبتمبر 2023',
    badge: 'تقرير تدريب',
    fileSize: '4.5 MB PDF',
    link: '#',
    icon: '🔬',
  },
];

const CATEGORIES = [
  'الكل',
  'مطبوعات ومجلات',
  'صور تاريخية',
  'قرارات ووثائق رسمية',
  'سجلات رياضية',
  'فعاليات ومؤتمرات',
  'تقارير أكاديمية',
];

const YEARS = ['الكل', '2026', '2025', '2024', '2023', '2022', 'ما قبل 2022'];

export default function ArchivePortal() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();

  const [items, setItems] = useState(DEFAULT_ARCHIVE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedYear, setSelectedYear] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // CMS Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  // جلب المحتوى الحي من السجل المركزي (MongoDB)
  useEffect(() => {
    async function loadDynamicContent() {
      const dynamicItems = await fetchHubContent('archive');
      if (dynamicItems && dynamicItems.length > 0) {
        // الدمج مع الافتراضي لتجنب التكرار
        const customIds = new Set(dynamicItems.map((d) => d._id));
        const filteredDefault = DEFAULT_ARCHIVE_ITEMS.filter((def) => !customIds.has(def._id));
        setItems([...dynamicItems, ...filteredDefault]);
      }
    }
    loadDynamicContent();
  }, []);

  const handleSaved = (savedItem, action) => {
    if (action === 'create') {
      setItems([savedItem, ...items]);
      showNotification('تمت إضافة الوثيقة إلى الأرشيف التاريخي بنجاح!');
    } else {
      setItems(items.map((i) => (i._id === savedItem._id ? savedItem : i)));
      showNotification('تم تحديث بيانات الوثيقة بنجاح!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر من الأرشيف؟')) {
      try {
        if (!id.startsWith('arch-')) {
          await deleteHubContent(id);
        }
        setItems(items.filter((i) => i._id !== id));
        showNotification('تم حذف العنصر من الأرشيف.');
      } catch (err) {
        alert('فشل في حذف العنصر: ' + err.message);
      }
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // الفلترة
  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesYear =
      selectedYear === 'الكل' ||
      (selectedYear === 'ما قبل 2022' ? parseInt(item.year, 10) < 2022 : item.year === selectedYear);
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesYear && matchesSearch;
  });

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '80px', direction: 'rtl' }}>
      
      {/* 1. Hero Section الأرشيفي والتاريخي */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #091a2f 0%, #0f2744 50%, #16365c 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '60px 20px 50px',
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
              padding: '6px 20px',
              borderRadius: '30px',
              color: '#fbbf24',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <FolderArchive size={16} />
            <span>السجل التاريخي والتوثيقي المركزي للرابطة</span>
            <span>🏛️</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            أرشيف الرابطة والذاكرة التوثيقية
          </h1>

          <p
            style={{
              maxWidth: '780px',
              margin: '0 auto 26px',
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e1',
            }}
          >
            حفظ وتوثيق كافة المطبوعات الرسمية، الإصدارات الدورية، ألبومات الصور التاريخية، ومحاضر الإنجازات الطلابية لطلاب كلية العلوم - جامعة القاهرة عبر الأجيال المتعاقبة.
          </p>

          {/* زر إضافة محتوى مخصص للأدمن */}
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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
                  padding: '12px 26px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                }}
              >
                <PlusCircle size={18} />
                <span>+ إضافة وثيقة أو ملف للأرشيف (Admin CMS)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px' }}>
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#34d399', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* 2. شريط البحث والفلترة المتقدمة (سنة / تصنيف / بحث) */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '22px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* حقل البحث */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
              🔍 البحث في الأرشيف والوثائق:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ابحث بالاسم، التاريخ، أو الكلمات الدلالية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={filterInputStyle}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* فلتر التصنيف */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
              📁 نوع الوثيقة والمحتوى:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={filterInputStyle}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر السنة */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', fontWeight: '600', marginBottom: '8px' }}>
              📅 السنة الأكاديمية والتاريخ:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={filterInputStyle}
            >
              {YEARS.map((yr) => (
                <option key={yr} value={yr} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. شبكة عرض الوثائق والملفات الأرشيفية */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: 'bold' }}>
            عدد الوثائق المعروضة: <span style={{ color: '#fbbf24' }}>{filteredItems.length}</span> وثيقة وملف
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '60px 20px',
              textAlign: 'center',
              color: '#cbd5e1',
            }}
          >
            <Archive size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', color: '#ffffff', margin: '0 0 8px' }}>لا توجد وثائق مطابقة للبحث</h3>
            <p style={{ fontSize: '14px', margin: 0 }}>جرب تعديل خيارات الفلترة أو كتابة كلمات بحث أخرى.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {filteredItems.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div>
                  {/* رأس الكارت */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.category}
                    </span>

                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.year}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.5', margin: '0 0 8px' }}>
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600', marginBottom: '10px' }}>
                      {item.subtitle}
                    </div>
                  )}

                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 16px' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#94a3b8', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="#f59e0b" />
                      <span>{item.date}</span>
                    </div>
                    {item.fileSize && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} color="#38bdf8" />
                        <span>{item.fileSize}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                    <a
                      href={item.link || '#'}
                      onClick={(e) => {
                        if (!item.link || item.link === '#') {
                          e.preventDefault();
                          alert(`جاري تحميل ملف "${item.title}" من خادم الأرشيف المركزي...`);
                        }
                      }}
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
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Download size={15} />
                      <span>تحميل واستعراض</span>
                    </a>

                    {/* أدوات الأدمن: تعديل وحذف */}
                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          title="تعديل في السجل"
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid #3b82f6',
                            color: '#60a5fa',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="حذف من الأرشيف"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* مودال الأدمن CMS */}
      <AdminHubCMSModal
        hub="archive"
        section="publications"
        sectionsList={CATEGORIES.filter((c) => c !== 'الكل').map((c) => ({ id: c, label: c }))}
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
