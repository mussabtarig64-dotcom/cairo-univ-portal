import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
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
  AlertCircle
} from 'lucide-react';

const CALENDAR_EVENTS = [
  {
    id: 1,
    title: '🏛️ بدء تسجيل المقررات الدراسية (Credit Hours Registration)',
    date: '2026-02-15',
    endDate: '2026-02-28',
    category: 'registration',
    catLabel: 'تسجيل وقيد',
    catColor: '#3b82f6',
    dept: 'جميع المستويات بكلية العلوم',
    description: 'فتح باب اختيار واعتلاء الساعات المعتمدة للفصل الدراسي الثاني تحت إشراف المرشد الأكاديمي.',
  },
  {
    id: 2,
    title: '🧪 امتحانات منتصف الفصل الدراسي (Midterm Exams)',
    date: '2026-03-25',
    endDate: '2026-04-05',
    category: 'exam',
    catLabel: 'امتحانات أكاديمية',
    catColor: '#ef4444',
    dept: 'كافة الأقسام والتخصصات',
    description: 'عقد الاختبارات النصفية التحريرية والتطبيقية في جميع مذكرات ومناهج الكلية.',
  },
  {
    id: 3,
    title: '🔬 امتحانات المعامل والعملي (Practical Lab Exams)',
    date: '2026-05-10',
    endDate: '2026-05-20',
    category: 'exam',
    catLabel: 'امتحانات عملي',
    catColor: '#f59e0b',
    dept: 'الكيمياء، الفيزياء، الأحياء، الحاسب',
    description: 'اختبارات الشفوي والتجارب المعملية بالساعات المعتمدة بالكلية.',
  },
  {
    id: 4,
    title: '🛂 موعد تقديم إفادات تجديد الإقامة الجماعية',
    date: '2026-03-01',
    endDate: '2026-03-15',
    category: 'association',
    catLabel: 'خدمات الرابطة',
    catColor: '#10b981',
    dept: 'الطلاب السودانيين المستجدين والقدامى',
    description: 'تجميع إفادات القيد وتسهيل التوجه إلى مجمع الجوازات بالجيزة والعباسية.',
  },
  {
    id: 5,
    title: '🎓 امتحانات نهاية الفصل الدراسي الثاني (Final Exams)',
    date: '2026-06-01',
    endDate: '2026-06-25',
    category: 'exam',
    catLabel: 'امتحانات فاينل',
    catColor: '#8b5cf6',
    dept: 'جميع الأقسام والمستويات',
    description: 'انطلاق امتحانات النهاية وتحديد التقدير التراكمي النهائي للعام الدراسي.',
  },
  {
    id: 6,
    title: '🌟 الملتقى الترحيبي والمعرض الأكاديمي السنوي',
    date: '2026-04-12',
    endDate: '2026-04-12',
    category: 'association',
    catLabel: 'فعاليات وثقافة',
    catColor: '#ec4899',
    dept: 'رابطة الطلاب السودانيين',
    description: 'مهرجان الترحيب بالطلاب الجدد وعرض المشاريع المتميزة والأبحاث المعملية.',
  },
];

export default function AcademicCalendar() {
  const { activeTheme } = useTheme();

  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = CALENDAR_EVENTS.filter((evt) => {
    const matchesCat = selectedCat === 'all' || evt.category === selectedCat;
    const matchesSearch =
      !searchQuery.trim() ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.dept.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ direction: 'rtl' }}>
      
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
            <h2 style={{ color: activeTheme.textMain, fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={22} color={activeTheme.accentLight} />
              <span>التقويم الأكاديمي وجدول امتحانات كلية العلوم</span>
            </h2>
            <p style={{ color: activeTheme.textMuted, fontSize: '12px', margin: 0 }}>
              مواعيد الامتحانات النصفية والعملية والفاينل + مواعيد التسجيل وفعاليات الرابطة للعام 2025/2026.
            </p>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <input
              type="text"
              placeholder="ابحث في مواعيد الامتحانات..."
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
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. شبكة الفعاليات والمواعيد */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '18px' }}>
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            style={{
              background: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRight: `4px solid ${item.catColor}`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span
                  style={{
                    backgroundColor: `${item.catColor}20`,
                    color: item.catColor,
                    border: `1px solid ${item.catColor}40`,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {item.catLabel}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: activeTheme.textMuted }}>
                  <Clock size={13} />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 style={{ color: activeTheme.textMain, fontSize: '15px', fontWeight: 'bold', lineHeight: '1.4', margin: '0 0 8px' }}>
                {item.title}
              </h3>

              <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.6', margin: '0 0 12px' }}>
                {item.description}
              </p>
            </div>

            <div style={{ paddingTop: '10px', borderTop: `1px dashed ${activeTheme.border}`, fontSize: '11px', color: activeTheme.accentLight, fontWeight: '600' }}>
              📍 المستهدفين: {item.dept}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
