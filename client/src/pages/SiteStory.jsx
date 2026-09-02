import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Lightbulb,
  Compass,
  Palette,
  Code2,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Heart,
  Users,
  Award,
  Globe,
  Quote,
  Clock,
  Layers,
  ChevronLeft
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import mubaashirImg from '../assets/team/mubaashir.jpg';
import mohammedRabieImg from '../assets/team/mohamed_rabi.jpg';
import mussabImg from '../assets/team/mussabtarig.jpg';

export default function SiteStory() {
  const { activeTheme } = useTheme();
  const [lang, setLang] = useState('ar'); // 'ar' or 'en'

  const milestonesAr = [
    {
      step: '01',
      title: 'البداية | الفكرة',
      subtitle: 'The Beginning | The Idea',
      roleLabel: 'صاحب الفكرة',
      person: 'مباشر عمر عثمان الطاهر',
      personEn: 'Mubaashir Omer Osman Al-Tahir',
      image: mubaashirImg,
      icon: Lightbulb,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      description:
        'بدأت فكرة إنشاء الموقع من الحاجة إلى وجود منصة إلكترونية رسمية تجمع وجود الرابطة في مكان واحد، وتكون مرجعاً للطلاب، ووسيلة للتعريف بأنشطتها وخدماتها ومبادراتها. لم تكن الفكرة مجرد إنشاء موقع، بل كانت رؤية لتأسيس مساحة رقمية تمثل الرابطة وتستمر في خدمة الطلاب وتوثيق ما يُقدّم لهم.',
      keyTakeaway: 'رؤية رقمية موحدة لخدمة طلاب العلوم وتوثيق أثر الرابطة المستدام.'
    },
    {
      step: '02',
      title: 'من الفكرة إلى الرؤية',
      subtitle: 'From Idea to Vision',
      roleLabel: 'التخطيط وهندسة المتطلبات',
      person: 'فريق التخطيط وممثلو الطلاب',
      personEn: 'Planning & Requirements Team',
      icon: Compass,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      description:
        'بعد طرح الفكرة، بدأت مرحلة التخطيط لتحديد شكل الموقع ووظيفته، والعمل على تحديد أهداف المنصة، وأقسامها، واحتياجات الطلاب، وتنظيم المحتوى، والهوية البصرية، وتجربة المستخدم (UX). كانت هذه المرحلة بمثابة تحويل الفكرة من مجرد تصور عام إلى مشروع محدد المعالم.',
      keyTakeaway: 'تحديد الأقسام، دراسة احتياجات الطلاب، ورسم الهيكل المعماري للمنصة.'
    },
    {
      step: '03',
      title: 'التصميم | عندما تشكلت الفكرة',
      subtitle: 'Design | When the Idea Took Shape',
      roleLabel: 'المصمم',
      person: 'محمد ربيع محمد عبدالمطلب',
      personEn: 'Mohammed Rabie Mohammed Abdel-Muttalib',
      image: mohammedRabieImg,
      icon: Palette,
      color: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      description:
        'في هذه المرحلة، تحولت الرؤية إلى واجهة استخدام وهوية بصرية. تم العمل على تصميم يجمع بين البساطة والوضوح وسهولة الاستخدام، مع الحفاظ على طابع يعكس هوية الرابطة ومكانتها. كان الهدف ألا يكون الموقع مجرد شكل جميل، بل منصة عملية وواضحة وسهلة في الوصول إلى المعلومة.',
      keyTakeaway: 'بناء هوية بصرية أنيقة، تجربة مستخدم سلسلة، وتصميم يليق بعراقة الكلية.'
    },
    {
      step: '04',
      title: 'التنفيذ | تحويل التصميم إلى واقع',
      subtitle: 'Execution | Turning Design into Reality',
      roleLabel: 'التنفيذ والبرمجة والتطوير',
      person: 'مصعب طارق عوض محمد',
      personEn: 'Mussab Tarig Awad Mohammed',
      image: mussabImg,
      icon: Code2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      description:
        'بعد اكتمال التصور والتصميم، بدأت مرحلة التنفيذ الفعلي، حيث تم بناء صفحات الموقع، إعداد المحتوى، ربط الأقسام، معالجة التفاصيل التقنية والبصرية، واختبار تجربة المستخدم. شيئاً فشيئاً، بدأت الرؤية تتحول إلى موقع حقيقي يعمل على أرض الواقع.',
      keyTakeaway: 'بناء الواجهات التفاعلية، تكامل الأنظمة، واختبار الأداء والسرعة.'
    },
    {
      step: '05',
      title: 'المتابعة | التفاصيل التي صنعت الصورة النهائية',
      subtitle: 'Follow-up | The Details That Crafted the Final Image',
      roleLabel: 'الإشراف والمتابعة المستمرة',
      person: 'أعضاء المكتب التنفيذي',
      personEn: 'Executive Committee Members',
      icon: CheckCircle2,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      description:
        'لم يكن انتهاء التصميم والتنفيذ يعني نهاية العمل، بل رافقت مراحل إنشاء الموقع متابعة مستمرة وتدقيق وملاحظات وتعديلات، من أصغر التفاصيل إلى الشكل النهائي. تمت مراجعة النصوص، وضبط المحتوى، واختبار الصفحات، وتحسين التفاصيل لضمان خروج الموقع بصورة تليق برابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة. كانت هذه المرحلة جزءاً أساسياً من الرحلة، لأن النتيجة النهائية لم تكن لتكتمل إلا بهذه التفاصيل والعمل الجماعي المستمر.',
      keyTakeaway: 'مراجعة وتدقيق مستمر، اختبار شامل للوظائف، وضبط أدق التفاصيل.'
    }
  ];

  const milestonesEn = [
    {
      step: '01',
      title: 'The Beginning | The Idea',
      subtitle: 'البداية | الفكرة',
      roleLabel: 'Idea Originator',
      person: 'Mubaashir Omer Osman Al-Tahir',
      personAr: 'مباشر عمر عثمان الطاهر',
      image: mubaashirImg,
      icon: Lightbulb,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      description:
        "The idea of creating the website started from the need for an official electronic platform that brings together the association's presence in one space, serves as a reference for students, and acts as a medium to introduce the association's activities, services, and initiatives. The idea was not just to build a website, but a vision to establish a digital space representing the association that continues to serve students and document what is offered to them.",
      keyTakeaway: 'A unified digital vision to serve science students and sustain the legacy of student initiatives.'
    },
    {
      step: '02',
      title: 'From Idea to Vision',
      subtitle: 'من الفكرة إلى الرؤية',
      roleLabel: 'Planning & Requirements Engineering',
      person: 'Planning & Requirements Team',
      personAr: 'فريق التخطيط وهندسة المتطلبات',
      icon: Compass,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      description:
        "After pitching the idea, the planning phase began to determine how the website should look and function. Work was done to define the platform's goals, sections, student needs, content organization, visual identity, and user experience (UX). This stage transformed the idea from a mere concept into a well-defined project.",
      keyTakeaway: 'Defining platform hubs, student needs analysis, and blueprint architectural design.'
    },
    {
      step: '03',
      title: 'Design | When the Idea Took Shape',
      subtitle: 'التصميم | عندما تشكلت الفكرة',
      roleLabel: 'Designer',
      person: 'Mohammed Rabie Mohammed Abdel-Muttalib',
      personAr: 'محمد ربيع محمد عبدالمطلب',
      image: mohammedRabieImg,
      icon: Palette,
      color: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      description:
        'In this stage, the vision turned into a user interface and visual identity. The design was crafted to combine simplicity, clarity, and ease of use, while preserving the character that reflects the association\'s identity and standing. The goal was not only for the site to look beautiful, but also to be practical, clear, and easy to navigate for information.',
      keyTakeaway: 'Crafting clean UI aesthetics, intuitive UX pathways, and dignified visual branding.'
    },
    {
      step: '04',
      title: 'Execution | Turning Design into Reality',
      subtitle: 'التنفيذ | تحويل التصميم إلى واقع',
      roleLabel: 'Implementation & Development',
      person: 'Mussab Tarig Awad Mohammed',
      personAr: 'مصعب طارق عوض محمد',
      image: mussabImg,
      icon: Code2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      description:
        'Following the completion of the concept and design, the actual implementation phase began. The website pages were built, content prepared, components integrated, and technical and visual details addressed, alongside UX testing. Gradually, the vision began turning into a real, functional website.',
      keyTakeaway: 'Building modern responsive components, database integration, and high-performance engineering.'
    },
    {
      step: '05',
      title: 'Follow-up | The Details That Crafted the Final Image',
      subtitle: 'المتابعة | التفاصيل التي صنعت الصورة النهائية',
      roleLabel: 'Supervision & Quality Assurance',
      person: 'Executive Committee Members',
      personAr: 'أعضاء المكتب التنفيذي',
      icon: CheckCircle2,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      description:
        'Completing the design and development did not mean the work was over. Throughout its creation, the website underwent continuous monitoring, review, and adjustments—from minor details to the final layout. Content was proofread, feedback addressed, pages tested, and details refined to ensure the website reached a standard worthy of representing the Sudanese Students Association at the Faculty of Science, Cairo University. This phase was an essential part of the journey because the final outcome came from countless details and continuous teamwork.',
      keyTakeaway: 'Meticulous reviews, comprehensive UX testing, and unified teamwork excellence.'
    }
  ];

  const milestones = lang === 'ar' ? milestonesAr : milestonesEn;

  return (
    <div
      className="min-h-screen w-full py-10 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        background: 'radial-gradient(circle at 50% 10%, #172554 0%, #0b1329 55%, #050b14 100%)',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation & Language Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors"
          >
            {lang === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setLang('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'ar'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇸🇩 العربية
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 English
            </button>
          </div>
        </div>

        {/* 1. Main Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-4 shadow-sm backdrop-blur-md">
            <Sparkles size={16} className="text-amber-400" />
            <span>
              {lang === 'ar'
                ? 'وثيقة التأسيس ومسيرة البناء'
                : 'Founding Document & Platform Journey'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-300 leading-tight">
            {lang === 'ar' ? 'قصة الموقع' : 'Site Story'}
          </h1>

          <p className="text-lg sm:text-2xl text-amber-400 font-semibold max-w-3xl mx-auto mb-6">
            {lang === 'ar'
              ? 'من فكرة على ورق… إلى منصة على أرض الواقع'
              : 'From an idea on paper… to a platform on the ground'}
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 2. Introduction Card */}
        <div className="relative mb-16">
          <div className="relative bg-slate-900/70 border border-amber-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <Quote size={28} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {lang === 'ar' ? 'المقدمة والهدف السامي' : 'Introduction & Noble Goal'}
                </h2>
                <div className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة'
                    : 'Sudanese Students Association at the Faculty of Science, Cairo University'}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed text-justify">
              {lang === 'ar' ? (
                <>
                  <p>
                    لم يكن إنشاء هذا الموقع مجرد واجهة إلكترونية لرابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة، بل خطوة نحو حضور رقمي يليق بالرابطة وطلابها، ومساحة تجمع المعلومات والخدمات والأنشطة، وتسهل الوصول إليها، وتوثق أثر العمل الطلابي بصورة منظمة ومستدامة.
                  </p>
                  <p className="font-semibold text-amber-200/90 pt-2 border-t border-white/10">
                    وراء هذه المنصة فكرة، وراء الفكرة أشخاص بذلوا وقتهم وجهدهم، وراء الوصول إلى هذه الصورة النهائية رحلة من التخطيط والتصميم والتنفيذ والمتابعة.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    "This website was not created to be merely an electronic interface for the Sudanese Students Association at the Faculty of Science, Cairo University, but rather a step towards a digital presence worthy of the association and its students. It provides a space that gathers information, services, and activities, facilitates access to them, and preserves the impact of student work in an organized and sustainable manner.
                  </p>
                  <p className="font-semibold text-amber-200/90 pt-2 border-t border-white/10">
                    Behind this platform lies an idea, behind the idea are people who dedicated their time and effort, and behind reaching this final image is a journey of planning, design, execution, and follow-up."
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. Sections and Milestones Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {lang === 'ar' ? 'المراحل والمحطات التأسيسية' : 'Milestones & Key Phases'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'رحلة خطوة بخطوة صنعت الفارق وجسدت العمل الجماعي بأبهى صوره'
                : 'A step-by-step journey of dedicated teamwork that brought the vision to life'}
            </p>
          </div>

          <div className="space-y-8 relative">
            {/* Timeline vertical line on desktop */}
            <div
              className={`hidden md:block absolute top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500/50 via-sky-500/40 to-purple-500/50 ${
                lang === 'ar' ? 'right-1/2 -mr-[1px]' : 'left-1/2 -ml-[1px]'
              }`}
            />

            {milestones.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge in Center */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center bg-slate-900 border-2 shadow-lg z-10"
                    style={{ borderColor: item.color, boxShadow: `0 0 20px ${item.bgGlow}` }}
                  >
                    <Icon size={20} style={{ color: item.color }} />
                  </div>

                  {/* Empty side for spacing */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className="w-full md:w-1/2">
                    <div
                      className="group relative bg-slate-900/80 border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                      style={{
                        boxShadow: `0 8px 30px rgba(0,0,0,0.3)`
                      }}
                    >
                      {/* Top Accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                        style={{ backgroundColor: item.color }}
                      />

                      {/* Header of Card */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-xl border flex items-center justify-center md:hidden"
                            style={{
                              backgroundColor: item.bgGlow,
                              borderColor: `${item.color}55`,
                              color: item.color,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <span
                              className="text-xs font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                              style={{
                                backgroundColor: item.bgGlow,
                                color: item.color,
                                border: `1px solid ${item.color}44`,
                              }}
                            >
                              المرحلة {item.step}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Contributor Pill with Profile Photo */}
                      {item.person && (
                        <div className="mb-4 flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
                          {item.image ? (
                            <div className="relative shrink-0">
                              <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 shadow-md transition-transform group-hover:scale-105"
                                style={{
                                  borderColor: item.color,
                                  boxShadow: `0 0 14px ${item.bgGlow}`,
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.person}
                                  className="w-full h-full object-cover object-center"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                              style={{
                                backgroundColor: item.bgGlow,
                                borderColor: `${item.color}55`,
                                color: item.color,
                              }}
                            >
                              <Users size={18} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] text-slate-400 font-medium">{item.roleLabel}</div>
                            <div className="text-sm sm:text-base font-bold text-amber-300">
                              {item.person}
                            </div>
                            {item.personEn && lang === 'ar' && (
                              <div className="text-[11px] text-slate-400/80">{item.personEn}</div>
                            )}
                            {item.personAr && lang === 'en' && (
                              <div className="text-[11px] text-slate-400/80">{item.personAr}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 text-justify">
                        {item.description}
                      </p>

                      {/* Key takeaway */}
                      <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                        <Sparkles size={14} style={{ color: item.color }} />
                        <span className="italic">{item.keyTakeaway}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Core Team Showcase (فريق صناعة المنصة وصناع الأثر) */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Users size={14} />
              <span>
                {lang === 'ar' ? 'فريق العمل وصناع المنصة' : 'Platform Core Creators'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {lang === 'ar' ? 'صناع الفكرة والمسيرة الرقمية' : 'The Team Behind The Vision'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'جهود شبابية متكاملة جمعت بين الرؤية، الإبداع البصري، والهندسة البرمجية'
                : 'A dedicated student synergy combining vision, creative design, and software engineering.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* 1. مباشر عمر عثمان الطاهر (صاحب الفكرة) */}
            <div className="group relative bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <div className="relative mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-500/50 shadow-xl shadow-amber-500/20 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300">
                  <img
                    src={mubaashirImg}
                    alt="مباشر عمر عثمان الطاهر"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute bottom-0 right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow">
                  💡 فكرة
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                {lang === 'ar' ? 'صاحب الفكرة والمبادرة' : 'Idea & Vision Originator'}
              </span>

              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                {lang === 'ar' ? 'مباشر عمر عثمان الطاهر' : 'Mubaashir Omer Osman Al-Tahir'}
              </h3>
              <div className="text-xs text-slate-400 mb-4 font-mono">
                {lang === 'ar' ? 'Mubaashir Omer Osman' : 'مباشر عمر عثمان الطاهر'}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify sm:text-center mt-auto">
                {lang === 'ar'
                  ? 'صاحب المبادرة التأسيسية التي أطلقت شرارة المشروع، وحوّلت الحاجة إلى منصة موحدة تجمع كافة خدمات وأنشطة الرابطة إلى هدف استراتيجي متحقق.'
                  : 'Originated the foundational initiative that catalyzed the platform project, transforming student needs into an enduring digital ecosystem.'}
              </p>
            </div>

            {/* 2. محمد ربيع محمد عبدالمطلب (المصمم) */}
            <div className="group relative bg-slate-900/80 border border-pink-500/30 hover:border-pink-400 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
              <div className="relative mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-xl shadow-pink-500/20 group-hover:scale-105 group-hover:border-pink-400 transition-all duration-300">
                  <img
                    src={mohammedRabieImg}
                    alt="محمد ربيع محمد عبدالمطلب"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute bottom-0 right-1 px-2 py-0.5 rounded-full bg-pink-500 text-slate-950 text-[10px] font-extrabold shadow">
                  🎨 تصميم
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
                {lang === 'ar' ? 'المصمم والهوية البصرية' : 'UI/UX & Brand Designer'}
              </span>

              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                {lang === 'ar' ? 'محمد ربيع محمد عبدالمطلب' : 'Mohammed Rabie Mohammed Abdel-Muttalib'}
              </h3>
              <div className="text-xs text-slate-400 mb-4 font-mono">
                {lang === 'ar' ? 'Mohammed Rabie' : 'محمد ربيع محمد عبدالمطلب'}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify sm:text-center mt-auto">
                {lang === 'ar'
                  ? 'مهندس الهوية البصرية وتجربة المستخدم، الذي صاغ للمنصة واجهاتها الأنيقة وتوزيعها المتناسق مع الحفاظ على روح وهوية طلاب العلوم جامعة القاهرة.'
                  : 'Engineered the visual branding and user experience architecture, shaping aesthetic interfaces that reflect the dignified identity of science students.'}
              </p>
            </div>

            {/* 3. مصعب طارق عوض محمد (التنفيذ والتطوير) */}
            <div className="group relative bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="relative mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-emerald-500/50 shadow-xl shadow-emerald-500/20 group-hover:scale-105 group-hover:border-emerald-400 transition-all duration-300">
                  <img
                    src={mussabImg}
                    alt="مصعب طارق عوض محمد"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute bottom-0 right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold shadow">
                  💻 تطوير
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                {lang === 'ar' ? 'التنفيذ والبرمجة والتطوير' : 'Implementation & Fullstack Dev'}
              </span>

              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                {lang === 'ar' ? 'مصعب طارق عوض محمد' : 'Mussab Tarig Awad Mohammed'}
              </h3>
              <div className="text-xs text-slate-400 mb-4 font-mono">
                {lang === 'ar' ? 'Mussab Tarig Awad' : 'مصعب طارق عوض محمد'}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify sm:text-center mt-auto">
                {lang === 'ar'
                  ? 'المطور والمهندس البرمجي الذي حوّل التصميم والرؤية إلى منصة تفاعلية سريعة، متكاملة الخوادم وقواعد البيانات، ومجهزة بأحدث الأنظمة والذكاء الاصطناعي.'
                  : 'Engineered the codebase, system architecture, database integrations, and dynamic capabilities, breathing life into a robust modern platform.'}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Metadata / Dates Box */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Calendar size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'سجل المحطات والتواريخ التأسيسية' : 'Key Milestones & Launch Dates'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'توثيق المراحل الزمنية للمشروع' : 'Chronological project records'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">
                  {lang === 'ar' ? '💡 انطلاق الفكرة' : '💡 Idea Started'}
                </div>
                <div className="text-base sm:text-lg font-bold text-amber-400">
                  {lang === 'ar' ? 'يناير 2026' : 'January 2026'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {lang === 'ar' ? 'طرح المبادرة ودراسة المتطلبات' : 'Initiative Pitch & Requirements'}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">
                  {lang === 'ar' ? '⚙️ اكتمال العمل والتطوير' : '⚙️ Work Completed'}
                </div>
                <div className="text-base sm:text-lg font-bold text-sky-400">
                  {lang === 'ar' ? 'فبراير 2026' : 'February 2026'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {lang === 'ar' ? 'انتهاء البرمجة والتصميم والتجربة' : 'Design, Code & QA Complete'}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">
                  {lang === 'ar' ? '🚀 تاريخ الإطلاق الرسمي' : '🚀 Launch Date'}
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-400">
                  {lang === 'ar' ? 'فبراير 2026' : 'February 2026'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {lang === 'ar' ? 'تدشين المنصة الموحدة رسمياً' : 'Official Portal Inauguration'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Conclusion Card */}
        <div className="relative mb-16">
          <div className="relative bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-blue-950/30 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-lg shadow-amber-500/10">
              <Award size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
              {lang === 'ar' ? 'الخاتمة والعهد المستمر' : 'Conclusion & Lasting Commitment'}
            </h2>

            <div className="max-w-3xl mx-auto space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed text-justify sm:text-center">
              {lang === 'ar' ? (
                <>
                  <p>
                    هذا الموقع ليس مجرد مشروع تقني، بل هو توثيق لفكرة آمن بها أصحابها، وجهد بُذل خلف الكواليس، ووقت استُثمر حتى يخرج العمل بهذه الصورة أمام الجميع.
                  </p>
                  <p>
                    من أول سطر في الفكرة، إلى كل تصميم وتعديل ومراجعة، وحتى لحظة الإطلاق، كان الهدف واحداً:
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-300 py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 my-4 inline-block">
                    أن يكون للرابطة حضور رقمي يليق بها، ويخدم طلابها، ويوثق أثر عملها.
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-slate-300">
                    من فكرة على ورق… إلى منصة على أرض الواقع.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    "This website is not just a technical project. It is the documentation of an idea believed in by its creators, an effort expended behind the scenes, and an investment of time until the result appeared before everyone.
                  </p>
                  <p>
                    From the first line of the idea, through every design, modification, and review, until the moment of launch, the goal was one:
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-300 py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 my-4 inline-block">
                    To give the association a digital presence that suits its standing, serves its students, and preserves the impact of its work.
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-slate-300">
                    From an idea on paper… to a platform on the ground."
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 6. Signature / Dedicated Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white p-1 border-2 border-amber-500 mb-4 shadow-lg">
            <img src={logoImg} alt="SSA Logo" className="w-full h-full object-contain rounded-full" />
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white mb-1">
            {lang === 'ar'
              ? 'رابطة الطلاب السودانيين – كلية العلوم، جامعة القاهرة'
              : 'Sudanese Students Association – Faculty of Science, Cairo University'}
          </h4>

          <p className="text-sm sm:text-base font-semibold text-amber-400 flex items-center justify-center gap-2">
            <Sparkles size={16} />
            <span>
              {lang === 'ar'
                ? 'نصنع الأثر… ونوثّق المسيرة'
                : 'We make an impact… and document the journey.'}
            </span>
            <Sparkles size={16} />
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/academic"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              📚 {lang === 'ar' ? 'المكتبة الأكاديمية' : 'Academic Library'}
            </Link>
            <Link
              to="/archive"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              🏛️ {lang === 'ar' ? 'أرشيف الرابطة' : 'SSA Archive'}
            </Link>
            <Link
              to="/administration"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              🛡️ {lang === 'ar' ? 'المكتب التنفيذي' : 'Executive Board'}
            </Link>
            <Link
              to="/sudan"
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all"
            >
              🇸🇩 {lang === 'ar' ? 'بوابة سوداننا' : 'Sudan Portal'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
