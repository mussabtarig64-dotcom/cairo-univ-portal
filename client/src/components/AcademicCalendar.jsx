import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Layers,
  MapPin,
  Tag
} from 'lucide-react';
import AdminHubCMSModal from './AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_CALENDAR_EVENTS = [
  {
    _id: 'cal-1',
    title: '🏛️ بدء تسجيل المقررات الدراسية (Credit Hours Registration)',
    date: '2026-02-15',
    category: 'registration',
    badge: 'تسجيل وقيد',
    author: 'شؤون الطلاب',
    description: 'فتح باب اختيار واعتلاء الساعات المعتمدة للفصل الدراسي الثاني تحت إشراف المرشد الأكاديمي لجميع المستويات.',
    extraData: {
      dept: 'جميع المستويات بكلية العلوم',
      catColor: '#3b82f6',
      catLabel: 'تسجيل وقيد',
      endDate: '2026-02-28',
    },
    section: 'calendar',
  },
  {
    _id: 'cal-2',
    title: '🧪 امتحانات منتصف الفصل الدراسي (Midterm Exams)',
    date: '2026-03-25',
    category: 'exam',
    badge: 'امتحانات أكاديمية',
    author: 'وكالة الكلية للتعليم والطلاب',
    description: 'عقد الاختبارات النصفية التحريرية والتطبيقية في جميع مذكرات ومناهج الكلية لجميع الفرق الدراسية.',
    extraData: {
      dept: 'كافة الأقسام والتخصصات الـ 11',
      catColor: '#ef4444',
      catLabel: 'امتحانات أكاديمية',
      endDate: '2026-04-05',
    },
    section: 'calendar',
  },
  {
    _id: 'cal-3',
    title: '🔬 امتحانات المعامل والعملي (Practical Lab Exams)',
    date: '2026-05-10',
    category: 'exam',
    badge: 'امتحانات عملي',
    author: 'رؤساء الأقسام العلمية',
    description: 'اختبارات الشفوي والتجارب المعملية بالساعات المعتمدة بالكلية في معامل الكيمياء والفيزياء والأحياء.',
    extraData: {
      dept: 'الكيمياء، الفيزياء، الأحياء، الحاسب',
      catColor: '#f59e0b',
      catLabel: 'امتحانات عملي',
      endDate: '2026-05-20',
    },
    section: 'calendar',
  },
  {
    _id: 'cal-4',
    title: '🛂 موعد تقديم إفادات تجديد الإقامة الجماعية',
    date: '2026-03-01',
    category: 'association',
    badge: 'خدمات الرابطة',
    author: 'أمانة شؤون الهجرة والإقامة',
    description: 'تجميع إفادات القيد وتسهيل التوجه إلى مجمع الجوازات بالجيزة والعباسية لإنهاء الإقامات الرسمية.',
    extraData: {
      dept: 'الطلاب السودانيين المستجدين والقدامى',
      catColor: '#10b981',
      catLabel: 'خدمات الرابطة',
      endDate: '2026-03-15',
    },
    section: 'calendar',
  },
  {
    _id: 'cal-5',
    title: '🎓 امتحانات نهاية الفصل الدراسي الثاني (Final Exams)',
    date: '2026-06-01',
    category: 'exam',
    badge: 'امتحانات فاينل',
    author: 'عمادة كلية العلوم',
    description: 'انطلاق امتحانات النهاية وتحديد التقدير التراكمي النهائي للعام الجامعي 2025/2026.',
    extraData: {
      dept: 'جميع الأقسام والمستويات',
      catColor: '#8b5cf6',
      catLabel: 'امتحانات فاينل',
      endDate: '2026-06-25',
    },
    section: 'calendar',
  },
  {
    _id: 'cal-6',
    title: '🌟 الملتقى الترحيبي والمعرض الأكاديمي السنوي',
    date: '2026-04-12',
    category: 'association',
    badge: 'فعاليات وثقافة',
    author: 'إدارة الرابطة',
    description: 'مهرجان الترحيب بالطلاب الجدد وعرض المشاريع المتميزة والأبحاث المعملية والابتكارات الطلابية.',
    extraData: {
      dept: 'رابطة الطلاب السودانيين',
      catColor: '#ec4899',
      catLabel: 'فعاليات وثقافة',
      endDate: '2026-04-12',
    },
    section: 'calendar',
  },
];

export default function AcademicCalendar() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Data Persistence (GET): Fetch live dynamic calendar data from MongoDB Atlas on mount
  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const data = await fetchHubContent('academic', { section: 'calendar' });
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load academic calendar events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  // 2. Delete Functionality: Show confirmation, call DELETE API, and update state upon success
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الموعد / الفعالية من التقويم الأكاديمي؟')) {
      return;
    }

    try {
      await deleteHubContent(id, 'academic');
      setEvents((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setNotification('تم حذف الموعد من التقويم الأكاديمي بنجاح!');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Delete Calendar Event Error:', err);
      alert('فشل حذف الموعد من قاعدة البيانات: ' + (err.message || 'حدث خطأ في الخادم'));
    }
  };

  // 3. Edit Functionality: Pre-fill modal with card's data and open modal
  const handleEditEvent = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 4. State Synchronization: Handle Added or Updated item from CMS Modal
  const handleSaved = (savedItem, action) => {
    if (action === 'create') {
      setEvents((prev) => [savedItem, ...prev]);
      setNotification('تمت إضافة الموعد الجديد إلى التقويم الأكاديمي وحفظه في MongoDB بنجاح!');
    } else {
      setEvents((prev) =>
        prev.map((item) => ((item._id || item.id) === (savedItem._id || savedItem.id) ? savedItem : item))
      );
      setNotification('تم تحديث بيانات الموعد وحفظها في قاعدة البيانات بنجاح!');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const getCategoryColor = (item) => {
    if (item.extraData?.catColor) return item.extraData.catColor;
    const cat = item.category?.toLowerCase() || '';
    if (cat.includes('exam') || cat.includes('امتحان')) return '#ef4444';
    if (cat.includes('reg') || cat.includes('تسجيل') || cat.includes('قيد')) return '#3b82f6';
    if (cat.includes('assoc') || cat.includes('رابطة') || cat.includes('إقامة')) return '#10b981';
    if (cat.includes('lab') || cat.includes('عملي')) return '#f59e0b';
    return '#8b5cf6';
  };

  const getCategoryLabel = (item) => {
    return (
      item.badge ||
      item.extraData?.catLabel ||
      item.category ||
      'موعد أكاديمي'
    );
  };

  const getTargetDept = (item) => {
    return (
      item.extraData?.dept ||
      item.subtitle ||
      item.author ||
      'كافة طلاب كلية العلوم'
    );
  };

  const filteredEvents = events.filter((evt) => {
    const catVal = evt.category?.toLowerCase() || '';
    const matchesCat =
      selectedCat === 'all' ||
      catVal === selectedCat ||
      (selectedCat === 'exam' && (catVal.includes('exam') || catVal.includes('امتحان'))) ||
      (selectedCat === 'registration' && (catVal.includes('reg') || catVal.includes('تسجيل'))) ||
      (selectedCat === 'association' && (catVal.includes('assoc') || catVal.includes('رابطة') || catVal.includes('إقامة')));

    const targetDept = getTargetDept(evt);
    const matchesSearch =
      !searchQuery.trim() ||
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetDept?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const calendarSectionsList = [
    { id: 'calendar', label: 'التقويم وجدول الامتحانات' },
    { id: 'notes', label: 'مذكرات ومراجع' },
    { id: 'exams', label: 'امتحانات سابقة' },
    { id: 'groups', label: 'مجموعات دراسة' },
    { id: 'grants', label: 'منح وتدريب' },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.18)',
            border: '1px solid #22c55e',
            color: '#86efac',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
          }}
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. هيدر التقويم الأكاديمي */}
      <div
        style={{
          background: activeTheme.bgCard,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Calendar size={22} color="#f59e0b" />
              </div>
              <div>
                <h2 style={{ color: activeTheme.textMain, fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>
                  التقويم الأكاديمي وجدول امتحانات كلية العلوم (مربوط بقاعدة البيانات)
                </h2>
                <p style={{ color: activeTheme.textMuted, fontSize: '12px', margin: 0 }}>
                  مواعيد الامتحانات النصفية والعملية والفاينل، مواعيد التسجيل وفعاليات الرابطة للعام 2025/2026.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Admin Add Event Button */}
            {isAdmin && (
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
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                  transition: 'all 0.2s',
                }}
              >
                <PlusCircle size={16} />
                <span>+ إضافة موعد أو امتحان جديد</span>
              </button>
            )}

            <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
              <input
                type="text"
                placeholder="ابحث في المواعيد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeTheme.border}`,
                  color: activeTheme.textMain,
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  direction: 'rtl',
                }}
              />
              <Search
                size={16}
                color={activeTheme.textMuted}
                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>
        </div>

        {/* فلاتر التصنيفات */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'جميع المواعيد والفعاليات' },
            { id: 'exam', label: 'الامتحانات والأعمال الفصلية' },
            { id: 'registration', label: 'تسجيل المواد والقيد' },
            { id: 'association', label: 'فعاليات الرابطة والإقامة' },
          ].map((cat) => {
            const isSel = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: isSel ? 'bold' : '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: `1px solid ${isSel ? activeTheme.accent : activeTheme.border}`,
                  background: isSel ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
                  color: isSel ? '#ffffff' : activeTheme.textMuted,
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. حالة التحميل */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: activeTheme.textMuted }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: '#f59e0b' }} />
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: activeTheme.textMain }}>جاري مزامنة وجلب مواعيد التقويم الأكاديمي من السجل المركزي...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: activeTheme.bgCard,
            border: `1px dashed ${activeTheme.border}`,
            borderRadius: '16px',
            color: activeTheme.textMuted,
          }}
        >
          <Calendar size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: activeTheme.textMain }}>لا توجد مواعيد تطابق بحثك حالياً</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>جرّب تغيير فئة البحث أو إضافة مواعيد جديدة كمسؤول.</div>
        </div>
      ) : (
        /* 3. شبكة الفعاليات والمواعيد مع أزرار الإدارة الحصرية */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '18px' }}>
          {filteredEvents.map((item) => {
            const catColor = getCategoryColor(item);
            const catLabel = getCategoryLabel(item);
            const dept = getTargetDept(item);

            return (
              <div
                key={item._id}
                style={{
                  background: activeTheme.bgCard,
                  border: `1px solid ${activeTheme.border}`,
                  borderRight: `4px solid ${catColor}`,
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  {/* Top Bar: Badge & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                    <span
                      style={{
                        backgroundColor: `${catColor}20`,
                        color: catColor,
                        border: `1px solid ${catColor}40`,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '3px 9px',
                        borderRadius: '6px',
                      }}
                    >
                      {catLabel}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: activeTheme.textMuted }}>
                      <Clock size={13} />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ color: activeTheme.textMain, fontSize: '15px', fontWeight: 'bold', lineHeight: '1.4', margin: '0 0 8px' }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.6', margin: '0 0 14px' }}>
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Target Audience Footer */}
                  <div style={{ paddingTop: '10px', borderTop: `1px dashed ${activeTheme.border}`, fontSize: '11px', color: activeTheme.accentLight, fontWeight: '600', marginBottom: isAdmin ? '12px' : '0' }}>
                    📍 المستهدفين: {dept}
                  </div>

                  {/* Admin Controls (حذف / تعديل) - Rendered ONLY for Admins */}
                  {isAdmin && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <button
                        onClick={() => handleEditEvent(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          color: '#38bdf8',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Edit size={12} />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(item._id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          color: '#f87171',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Trash2 size={12} />
                        <span>حذف</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin CMS Modal for Adding / Editing Calendar Events */}
      <AdminHubCMSModal
        hub="academic"
        section="calendar"
        sectionsList={calendarSectionsList}
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
