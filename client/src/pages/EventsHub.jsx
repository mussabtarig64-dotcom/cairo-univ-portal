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
  CheckCircle2
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
  const [eventsList, setEventsList] = useState(DEFAULT_EVENTS);
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY);
  const [registeredEvents, setRegisteredEvents] = useState({});

  // CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'upcoming', label: 'تسجيل الفعاليات القادمة', icon: Ticket, desc: 'حجز الحضور والمؤتمرات' },
    { id: 'calendar', label: 'التقويم السنوي والجدول', icon: Calendar, desc: 'مواعيد الأنشطة والامتحانات' },
    { id: 'gallery', label: 'التغطيات والصور', icon: Camera, desc: 'أرشيف وتوثيق الفعاليات' },
  ];

  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('events');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicEvents = dynamicItems.filter((i) => i.section === 'upcoming');
        const dynamicGallery = dynamicItems.filter((i) => i.section === 'gallery');

        if (dynamicEvents.length > 0) {
          const ids = new Set(dynamicEvents.map((d) => d._id));
          setEventsList([...dynamicEvents, ...DEFAULT_EVENTS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicGallery.length > 0) {
          const ids = new Set(dynamicGallery.map((d) => d._id));
          setGalleryItems([...dynamicGallery, ...DEFAULT_GALLERY.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'gallery') {
      setGalleryItems(action === 'create' ? [item, ...galleryItems] : galleryItems.map((g) => (g._id === item._id ? item : g)));
    } else {
      setEventsList(action === 'create' ? [item, ...eventsList] : eventsList.map((e) => (e._id === item._id ? item : e)));
    }
    setNotification(action === 'create' ? 'تمت إضافة الفعالية بنجاح!' : 'تم تحديث الفعالية بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر؟')) {
      try {
        if (!id.startsWith('evt-') && !id.startsWith('gal-')) {
          await deleteHubContent(id);
        }
        if (section === 'gallery') {
          setGalleryItems(galleryItems.filter((g) => g._id !== id));
        } else {
          setEventsList(eventsList.filter((e) => e._id !== id));
        }
        setNotification('تم حذف العنصر بنجاح.');
        setTimeout(() => setNotification(''), 4000);
      } catch (err) {
        alert('فشل الحذف: ' + err.message);
      }
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
    </div>
  );
}
