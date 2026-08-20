import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  FileCheck,
  Building,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: '📝 استمارة التسجيل المركزي واستبيان السكن',
    items: [
      {
        q: 'كيف يتم قبول وتدقيق استمارة القيد في رابطة الطلاب السودانيين؟',
        a: 'بعد تعبئة استمارة التسجيل المركزي ورفع صورة إثبات الهوية (جواز السفر، البطاقة القومية، أو كارنيه الكلية)، يقوم المكتب التنفيذي بالتحقق من البيانات ومطابقتها مع قوائم الوافدين بكلية العلوم خلال 24-48 ساعة، ويتم تفعيل الحساب فوراً لتتلقى شارة العضو المعتمد والبطاقة الرقمية.',
      },
      {
        q: 'ما هي الوثائق الرسمية المقبولة لإثبات الهوية عند التسجيل؟',
        a: 'يقبل النظام رفع صورة واضحة من: (1) جواز السفر السوداني الساري، (2) بطاقة الرقم الوطني، أو (3) كارنيه الكلية / إفادة القيد الصادرة من كلية العلوم جامعة القاهرة.',
      },
      {
        q: 'ماذا أفعل إذا ظهرت لي حالة الحساب (قيد المراجعة)؟',
        a: 'حالة "قيد المراجعة" تعني أن طلبك في طابور التدقيق لدى هيئة شؤون الطلاب. يمكنك الاستعلام المباشر باستخدام رقم القيد من الصفحة الرئيسية، أو تحديث الصفحة بعد فترة قصيرة.',
      },
    ],
  },
  {
    category: '🛂 إجراءات الإقامة والسكن في مصر',
    items: [
      {
        q: 'ما هي خطوات تجديد الإقامة الدراسية للطلاب السودانيين بمصر؟',
        a: 'الخطوة الأولى: استخراج إفادة قيد موجهة إلى مصلحة الجوازات من إدارة شؤون الطلاب بكلية العلوم. الخطوة الثانية: التوجه إلى مجمع الجوازات المختص (مجمع الجيزة أو العباسية) مرفقاً بها أصل وصورة الجواز، عقد إيجار موثق بالشهر العقاري، وصور شخصية.',
      },
      {
        q: 'أين تقع أفضل أماكن السكن الطلابي بالقرب من جامعة القاهرة؟',
        a: 'تعتبر مناطق (الدقي، بين السرايات، الجيزة، والمهندسين) هي الأقرب لبوابة كلية العلوم جامعة القاهرة وتتميز بتوفر الخدمات والمواصلات المباشرة والتجمعات الطلابية السودانية.',
      },
      {
        q: 'هل تقدم الرابطة مساعدة في توفير السكن الطلابي؟',
        a: 'نعم، من خلال استبيان السكن المرفق باستمارة التسجيل، نقوم بتجميع طلبات التسكين والربط بين الطلاب الجدد والسكنات الجماعية المتاحة بالقرب من الجامعة.',
      },
    ],
  },
  {
    category: '🔬 كلية العلوم ونظام الساعات المعتمدة',
    items: [
      {
        q: 'كيف يتم حساب المعدل التراكمي (GPA) ونظام الساعات المعتمدة؟',
        a: 'تعتمد كلية العلوم نظام Credit Hours؛ حيث يحسب تقدير كل مادة بناءً على درجات أعمال السنة، معامل العملي، والامتحان النهائي، ويضرب في عدد الساعات المعتمدة للمادة لتحديد المعدل التراكمي.',
      },
      {
        q: 'ما هي الأقسام والتخصصات المتاحة بكلية العلوم جامعة القاهرة؟',
        a: 'تضم الكلية تخصصات متنوعة تشمل: علوم الحاسب والمعلومات، الكيمياء، الكيمياء الحيوية، الفيزياء، البيوفيزياء، الرياضيات، الإحصاء وعلوم البيانات، النبات والميكروبيولوجي، علم الحيوان والحشرات، والجيولوجيا والجيوفيزياء.',
      },
      {
        q: 'كيف أصل إلى المذكرات العلمية وأرشيف الامتحانات السابقة؟',
        a: 'يوفر بوابة الرابطة قسم "المكتبة الأكاديمية" حيث يمكنك تصفح وتنزيل مذكرات المعامل، ملخصات المواد، والامتحانات السابقة مجاناً وبأعلى جودة.',
      },
    ],
  },
  {
    category: '💳 البطاقة الرقمية وخدمات المنصة',
    items: [
      {
        q: 'كيف يمكنني الحصول على بطاقة العضوية الرقمية (Digital ID Card)؟',
        a: 'بمجرد اعتماد قيدك وتأكيد حسابك، يمكنك التوجه إلى قسم "البطاقة الرقمية" في المنصة لعرض وتحميل بطاقة العضوية المطبوعة المزودة بـ QR Code رسمي.',
      },
      {
        q: 'كيف يمكنني التواصل مباشرة مع المكتب التنفيذي للرابطة؟',
        a: 'يمكنك التواصل معنا عبر صفحة "اتصل بنا" أو من خلال روابط الواتساب والتلغرام الرسمية، أو زيارة مقر الرابطة بكلية العلوم جامعة القاهرة.',
      },
    ],
  },
];

export default function FAQ() {
  const { activeTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState({ '0-0': true, '1-0': true });

  const toggleAccordion = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_DATA.map((cat) => {
    const filteredItems = cat.items.filter(
      (item) =>
        !searchQuery.trim() ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items: filteredItems };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 20px 80px', direction: 'rtl' }}>
      
      {/* 1. هيدر الأسئلة الشائعة */}
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
          <HelpCircle size={32} />
        </div>

        <h1 style={{ color: activeTheme.textMain, fontSize: '26px', fontWeight: '900', margin: '0 0 10px' }}>
          الأسئلة الشائعة والدليل الإرشادي للطلاب
        </h1>
        <p style={{ color: activeTheme.accentLight, fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
          رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
        </p>
        <p style={{ color: activeTheme.textMuted, fontSize: '13px', marginTop: '6px', maxWidth: '650px', margin: '8px auto 0' }}>
          إجابات شاملة ومباشرة عن كافة الاستفسارات المتعلقة بإجراءات القيد، الإقامة والسكن بمصر، نظام الدراسة بكلية العلوم، وخدمات البطاقة الرقمية.
        </p>
      </div>

      {/* 2. شريط البحث في الأسئلة */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="ابحث عن سؤالك هنا (مثال: الإقامة، السكن، القيد، المعادل، المذكرات)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 44px 14px 16px',
            borderRadius: '16px',
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            color: activeTheme.textMain,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            direction: 'rtl',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }}
        />
        <Search
          size={20}
          color={activeTheme.accentLight}
          style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* 3. قائمة الأكورديون Accordion Sections */}
      {filteredCategories.length === 0 ? (
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            color: activeTheme.textMuted,
          }}
        >
          <HelpCircle size={40} color={activeTheme.accentLight} style={{ marginBottom: '12px' }} />
          <h3 style={{ color: activeTheme.textMain, fontSize: '17px', margin: '0 0 6px' }}>لم نجد نتائج مطابقة لبحثك</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>تواصل مباشرة مع المكتب التنفيذي عبر صفحة اتصل بنا.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {filteredCategories.map((cat, catIdx) => (
            <div key={catIdx}>
              <h2 style={{ color: activeTheme.accentLight, fontSize: '17px', fontWeight: 'bold', marginBottom: '14px', borderRight: `4px solid ${activeTheme.accent}`, paddingRight: '12px' }}>
                {cat.category}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openIndices[key];

                  return (
                    <div
                      key={itemIdx}
                      style={{
                        background: activeTheme.bgCard,
                        border: `1px solid ${isOpen ? activeTheme.accent : activeTheme.border}`,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <button
                        onClick={() => toggleAccordion(catIdx, itemIdx)}
                        style={{
                          width: '100%',
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'transparent',
                          border: 'none',
                          color: activeTheme.textMain,
                          fontWeight: 'bold',
                          fontSize: '15px',
                          cursor: 'pointer',
                          textAlign: 'right',
                          direction: 'rtl',
                          gap: '12px',
                        }}
                      >
                        <span style={{ lineHeight: '1.4' }}>{item.q}</span>
                        {isOpen ? <ChevronUp size={20} color={activeTheme.accentLight} /> : <ChevronDown size={20} color={activeTheme.textMuted} />}
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '0 20px 20px 20px',
                            color: activeTheme.textMain,
                            fontSize: '13px',
                            lineHeight: '1.8',
                            borderTop: `1px dashed ${activeTheme.border}`,
                            paddingTop: '14px',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. كارت المساعدة وتواصل معنا */}
      <div
        style={{
          marginTop: '40px',
          background: `linear-gradient(135deg, ${activeTheme.primary}25 0%, ${activeTheme.bgCard} 100%)`,
          border: `1px solid ${activeTheme.accent}`,
          borderRadius: '20px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px' }}>
            لم تجد إجابة لسؤالك؟
          </h3>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
            المكتب التنفيذي وهيئة الدعم الطلابي بالرابطة جاهزون للرد على كافة استفساراتك مباشرة.
          </p>
        </div>

        <Link
          to="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
            color: '#0b1622',
            padding: '11px 22px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: '0 6px 18px rgba(245, 158, 11, 0.3)',
          }}
        >
          <span>تواصل معنا الآن</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}
