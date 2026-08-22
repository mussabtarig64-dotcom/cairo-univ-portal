import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
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
  Camera
} from 'lucide-react';
import AcademicCalendar from '../components/AcademicCalendar';

export default function EventsHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState({});

  const tabs = [
    { id: 'upcoming', label: 'تسجيل الفعاليات القادمة', icon: Ticket, desc: 'حجز الحضور والمؤتمرات' },
    { id: 'calendar', label: 'التقويم السنوي والجدول', icon: Calendar, desc: 'مواعيد الأنشطة والامتحانات' },
    { id: 'gallery', label: 'التغطيات والصور', icon: Camera, desc: 'أرشيف وتوثيق الفعاليات' },
  ];

  const eventsList = [
    {
      id: 1,
      title: 'الملتقى العلمي والبحثي السنوي الثالث',
      category: 'أكاديمي وبحثي',
      date: '15 مارس 2026',
      time: '10:00 صباحاً - 3:00 عصراً',
      location: 'قاعة ابن الهيثم - كلية العلوم جامعة القاهرة',
      seats: 'باقي 35 مقعداً',
      desc: 'مؤتمر طلابي يستعرض أحدث أبحاث الطلاب في الكيمياء، الفيزياء الحيوية، والطاقات المتجددة بحضور أساتذة وخبراء.',
    },
    {
      id: 2,
      title: 'يوم التراث والأصالة السودانية المفتوح',
      category: 'ثقافي واجتماعي',
      date: '28 مارس 2026',
      time: '1:00 ظهراً - 7:00 مساءً',
      location: 'ساحة الأنشطة والمسرح المفتوح بالجامعة',
      seats: 'مفتوح للجميع',
      desc: 'معارض للأزياء التراثية، خيمة القهوة والجبنة، معارض تشكيلية، وأمسية شعرية وغنائية سودانية أصيلة.',
    },
    {
      id: 3,
      title: 'ورشة عمل: المهارات المتقدمة في البحث والنشر العلمي',
      category: 'تدريب وتطوير',
      date: '5 إبريل 2026',
      time: '4:00 عصراً - 6:30 مساءً',
      location: 'أونلاين عبر Zoom + معمل الحاسب الآلي',
      seats: 'باقي 15 مقعداً',
      desc: 'تدريب عملي على برامج كتابة المراجع الأكاديمية (EndNote, Mendeley) وكيفية النشر في المجلات الدولية المصنفة (Q1, Q2).',
    },
  ];

  const galleryItems = [
    {
      title: 'حفل تكريم المتفوقين وخريجي دفعة 2025',
      date: 'نوفمبر 2025',
      desc: 'تكريم أوائل الأقسام العلمية وتسليم الدروع التذكارية بحضور وكيل الكلية.',
      tag: 'تخريج وتكريم',
      icon: '🎓',
    },
    {
      title: 'نهائي دوري كرة القدم وكأس الاستقلال',
      date: 'ديسمبر 2025',
      desc: 'تتويج فريق الكيمياء بطلاً للنسخة الماضية في احتفالية رياضية مبهجة.',
      tag: 'رياضة وتتويج',
      icon: '🏆',
    },
    {
      title: 'معرض الإبداع العلمي والابتكارات الطلابية',
      date: 'أكتوبر 2025',
      desc: 'عرض أكثر من 18 مشروعاً ابتكارياً لطلاب العلوم والتكنولوجيا الحيوية.',
      tag: 'ابتكار وبحث',
      icon: '🔬',
    },
    {
      title: 'إفطار رمضان الجماعي ويوم الوفاء',
      date: 'رمضان 2025',
      desc: 'تجمع رمضاني ضم أكثر من 400 طالب وطالبة من مختلف كليات جامعة القاهرة.',
      tag: 'ملتقى اجتماعي',
      icon: '🌙',
    },
  ];

  const handleRegister = (id) => {
    setRegisteredEvents({ ...registeredEvents, [id]: true });
  };

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
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
            <Calendar size={16} />
            <span>قطاع المؤتمرات والفعاليات والأنشطة الطلابية</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            مركز الفعاليات، التقويم، والتغطيات
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
            بوابة تسجيل وحجز الفعاليات العلمية والملتقيات الثقافية، مع التقويم الزمني المتزامن، وأرشيف التغطيات المصورة لأنشطة الرابطة.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                  padding: '14px 18px',
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
        {activeTab === 'upcoming' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {eventsList.map((evt) => {
              const isRegistered = registeredEvents[evt.id];
              return (
                <div
                  key={evt.id}
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
                      <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid #3b82f6', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                        {evt.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                        {evt.seats}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                      {evt.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 16px' }}>
                      {evt.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.textMain }}>
                        <Calendar size={14} color={activeTheme.accent} />
                        <span><strong>التاريخ:</strong> {evt.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.textMain }}>
                        <Clock size={14} color={activeTheme.accent} />
                        <span><strong>التوقيت:</strong> {evt.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.textMain }}>
                        <MapPin size={14} color={activeTheme.accent} />
                        <span><strong>الموقع:</strong> {evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(evt.id)}
                    disabled={isRegistered}
                    style={{
                      background: isRegistered
                        ? 'rgba(16, 185, 129, 0.2)'
                        : `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                      color: isRegistered ? '#34d399' : '#0b1622',
                      border: isRegistered ? '1px solid #10b981' : 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: isRegistered ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle size={16} />
                        <span>تم تأكيد تسجيل حضورك بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <Ticket size={16} />
                        <span>حجز مقعد وحضور الفعالية</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'calendar' && (
          <AcademicCalendar />
        )}

        {activeTab === 'gallery' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {galleryItems.map((item, idx) => (
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
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '6px' }}>
                  {item.tag} • {item.date}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
