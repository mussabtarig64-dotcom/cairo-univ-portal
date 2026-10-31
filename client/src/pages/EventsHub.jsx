import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Image,
  Ticket,
  Clock,
  MapPin,
  CheckCircle,
  Users,
  ChevronRight,
  Sparkles,
  Camera,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  X,
  ExternalLink,
  FileText
} from 'lucide-react';
import AcademicCalendar from '../components/AcademicCalendar';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_EVENTS = [
  {
    _id: 'evt-1',
    title: 'الملتقى العلمي والبحثي السنوي الثالث',
    category: 'أكاديمي وبحثي',
    date: '15 مارس 2026',
    time: '10:00 صباحاً - 3:00 عصراً',
    location: 'قاعة ابن الهيثم - كلية العلوم جامعة القاهرة',
    seats: 'باقي 35 مقعداً',
    description: 'مؤتمر طلابي يستعرض أحدث أبحاث الطلاب في الكيمياء، الفيزياء الحيوية، والطاقات المتجددة بحضور أساتذة وخبراء.',
    section: 'upcoming',
  },
  {
    _id: 'evt-2',
    title: 'يوم التراث والأصالة السودانية المفتوح',
    category: 'ثقافي واجتماعي',
    date: '28 مارس 2026',
    time: '1:00 ظهراً - 7:00 مساءً',
    location: 'ساحة الأنشطة والمسرح المفتوح بالجامعة',
    seats: 'مفتوح للجميع',
    description: 'معارض للأزياء التراثية، خيمة القهوة والجبنة، معارض تشكيلية، وأمسية شعرية وغنائية سودانية أصيلة.',
    section: 'upcoming',
  },
  {
    _id: 'evt-3',
    title: 'ورشة عمل: المهارات المتقدمة في البحث والنشر العلمي',
    category: 'تدريب وتطوير',
    date: '5 إبريل 2026',
    time: '4:00 عصراً - 6:30 مساءً',
    location: 'أونلاين عبر Zoom + معمل الحاسب الآلي',
    seats: 'باقي 15 مقعداً',
    description: 'تدريب عملي على برامج كتابة المراجع الأكاديمية (EndNote, Mendeley) وكيفية النشر في المجلات الدولية المصنفة (Q1, Q2).',
    section: 'upcoming',
  },
];

const DEFAULT_GALLERY = [
  {
    _id: 'gal-1',
    title: 'حفل تكريم المتفوقين وخريجي دفعة 2025',
    date: 'نوفمبر 2025',
    description: 'تكريم أوائل الأقسام العلمية وتسليم الدروع التذكارية بحضور وكيل الكلية.',
    tag: 'تخريج وتكريم',
    icon: '🎓',
    section: 'gallery',
  },
  {
    _id: 'gal-2',
    title: 'نهائي دوري كرة القدم وكأس الاستقلال',
    date: 'ديسمبر 2025',
    description: 'تتويج فريق الكيمياء بطلاً للنسخة الماضية في احتفالية رياضية مبهجة.',
    tag: 'رياضة وتتويج',
    icon: '🏆',
    section: 'gallery',
  },
  {
    _id: 'gal-3',
    title: 'معرض الإبداع العلمي والابتكارات الطلابية',
    date: 'أكتوبر 2025',
    description: 'عرض أكثر من 18 مشروعاً ابتكارياً لطلاب العلوم والتكنولوجيا الحيوية.',
    tag: 'ابتكار وبحث',
    icon: '🔬',
    section: 'gallery',
  },
];

export default function EventsHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [eventsList, setEventsList] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState({});

  // CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'upcoming', label: 'تسجيل الفعاليات القادمة', icon: Ticket, desc: 'حجز الحضور والمؤتمرات' },
    { id: 'calendar', label: 'التقويم السنوي والجدول', icon: Calendar, desc: 'مواعيد الأنشطة والامتحانات' },
    { id: 'gallery', label: 'التغطيات والصور', icon: Camera, desc: 'أرشيف وتوثيق الفعاليات' },
  ];

  const loadDynamic = async () => {
    try {
      setIsLoading(true);
      const dynamicItems = await fetchHubContent('events');
      setEventsList((dynamicItems || []).filter((i) => i.section === 'upcoming' || !i.section));
      setGalleryItems((dynamicItems || []).filter((i) => i.section === 'gallery'));
    } catch (err) {
      console.error('Failed to load events hub content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'gallery') {
      setGalleryItems((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((g) => ((g._id || g.id) === (item._id || item.id) ? item : g))
      );
    } else {
      setEventsList((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((e) => ((e._id || e.id) === (item._id || item.id) ? item : e))
      );
    }
    setNotification(
      action === 'create'
        ? 'تمت إضافة الفعالية وحفظها في قاعدة البيانات بنجاح!'
        : 'تم تحديث الفعالية بنجاح!'
    );
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً من قاعدة البيانات؟')) {
      return;
    }
    try {
      await deleteHubContent(id, 'events');
      if (section === 'gallery') {
        setGalleryItems((prev) => prev.filter((g) => (g._id || g.id) !== id));
      } else {
        setEventsList((prev) => prev.filter((e) => (e._id || e.id) !== id));
      }
      setNotification('تم حذف العنصر بنجاح من قاعدة البيانات.');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Delete events item error:', err);
      alert('فشل الحذف من قاعدة البيانات: ' + (err.message || 'حدث خطأ في الخادم'));
    }
  };

  const handleRegister = (id) => {
    setRegisteredEvents({ ...registeredEvents, [id]: true });
  };

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '80px', direction: 'rtl' }}>
      
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '60px 20px 48px',
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
            <Calendar size={16} />
            <span>قطاع المؤتمرات والفعاليات والأنشطة الطلابية</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            مركز الفعاليات، التقويم، والتغطيات
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
            بوابة تسجيل وحجز الفعاليات العلمية والملتقيات الثقافية، مع التقويم الزمني المتزامن، وأرشيف التغطيات المصورة لأنشطة الرابطة.
          </p>

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
                <span>+ إضافة فعالية أو تغطية جديدة (Admin CMS)</span>
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

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            backgroundColor: '#0f172a',
            padding: '8px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #f59e0b' : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '14px',
                  textAlign: 'right',
                }}
              >
                <Icon size={20} color={isSelected ? '#f59e0b' : '#94a3b8'} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>
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
        {activeTab === 'upcoming' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {eventsList.map((evt) => {
              const isRegistered = registeredEvents[evt._id];
              return (
                <div
                  key={evt._id}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {evt.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                        {evt.seats || 'متاح للحجز'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                      {evt.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 16px' }}>
                      {evt.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
                        <Calendar size={15} color="#f59e0b" />
                        <span><strong>التاريخ:</strong> {evt.date}</span>
                      </div>
                      {evt.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
                          <Clock size={15} color="#38bdf8" />
                          <span><strong>التوقيت:</strong> {evt.time}</span>
                        </div>
                      )}
                      {evt.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
                          <MapPin size={15} color="#34d399" />
                          <span><strong>الموقع:</strong> {evt.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                    <button
                      onClick={() => handleRegister(evt._id)}
                      disabled={isRegistered}
                      style={{
                        background: isRegistered
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: isRegistered ? '#34d399' : '#0b1622',
                        border: isRegistered ? '1px solid #10b981' : 'none',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: isRegistered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle size={16} />
                          <span>تم تأكيد حضورك!</span>
                        </>
                      ) : (
                        <>
                          <Ticket size={16} />
                          <span>حجز مقعد</span>
                        </>
                      )}
                    </button>

                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => setPreviewItem(evt)}
                          title="معاينة تفاصيل وملف الفعالية"
                          style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          <Eye size={14} />
                          <span>معاينة</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(evt);
                            setIsModalOpen(true);
                          }}
                          style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(evt._id, 'upcoming')}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'calendar' && (
          <AcademicCalendar />
        )}

        {activeTab === 'gallery' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {galleryItems.map((item) => (
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
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                }}
              >
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon || '📸'}</div>
                  <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px' }}>
                    {item.tag || item.category || 'تغطية'} • {item.date}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <button
                      onClick={() => setPreviewItem(item)}
                      title="معاينة التغطية / الصورة المرفقة"
                      style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      <Eye size={14} />
                      <span>معاينة</span>
                    </button>
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
                      onClick={() => handleDeleteItem(item._id, 'gallery')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="events"
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

      {/* Admin Preview Modal for Uploaded Events and Coverages - Accessible only by Admin */}
      {isAdmin && previewItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              direction: 'rtl',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                  }}
                >
                  <Eye size={20} />
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 'bold', margin: '0 0 4px' }}>
                    معاينة ملف وتغطية الفعالية (لوحة الإدارة)
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {previewItem.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body: File Preview */}
            <div style={{ textAlign: 'center', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {previewItem.fileUrl ? (
                previewItem.fileUrl.startsWith('data:image') ||
                previewItem.fileUrl.match(/\.(jpeg|jpg|png|webp|gif)$/i) ? (
                  <div style={{ width: '100%' }}>
                    <img
                      src={previewItem.fileUrl}
                      alt={previewItem.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '65vh',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <iframe
                      src={previewItem.fileUrl}
                      title="Event File Preview"
                      style={{
                        width: '100%',
                        height: '55vh',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                )
              ) : (
                /* Fallback preview card for events / coverages */
                <div
                  style={{
                    padding: '30px 20px',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '12px' }}>
                    {previewItem.icon || '🎟️'}
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
                    {previewItem.title}
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 18px' }}>
                    {previewItem.description || 'تفاصيل الفعالية وبرنامج الحضور الرسمي المعتمد من إدارة الرابطة.'}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#38bdf8',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    {previewItem.date && <span>📅 التاريخ: {previewItem.date}</span>}
                    {previewItem.time && <span>⏰ الموعد: {previewItem.time}</span>}
                    {previewItem.location && <span>📍 المكان: {previewItem.location}</span>}
                    {previewItem.seats && <span>👥 المقاعد: {previewItem.seats}</span>}
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', color: '#10b981' }}>
                    ✓ فعالية معتمدة ومدرجة في السجل الإداري
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '10px',
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {previewItem.fileUrl && (
                <a
                  href={previewItem.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ExternalLink size={14} />
                  <span>فتح في نافذة كاملة</span>
                </a>
              )}
              <button
                onClick={() => setPreviewItem(null)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0b1622',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
