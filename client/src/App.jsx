import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import logoImg from './assets/logo.png';

import {
  VerifiedStudentRoute,
  PendingOrVerifiedRoute,
  AdminRoute,
  GuestOnlyRoute
} from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import Posts from './pages/Posts';
import Chat from './pages/Chat';
import AIChat from './pages/AIChat';
import AdminDashboard from './pages/AdminDashboard';
import AcademicLibrary from './pages/AcademicLibrary';
import SportsHub from './pages/SportsHub';
import SudanPortal from './pages/SudanPortal';
import SocialHub from './pages/SocialHub';
import EventsHub from './pages/EventsHub';
import MediaHub from './pages/MediaHub';
import AchievementsHub from './pages/AchievementsHub';
import AdministrationHub from './pages/AdministrationHub';
import ConstitutionHub from './pages/ConstitutionHub';
import ArchivePortal from './pages/ArchivePortal';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import DigitalIDPage from './pages/DigitalIDPage';
import AnnouncementTicker from './components/AnnouncementTicker';
import SocialLinks from './components/SocialLinks';
import FloatingAIChatWidget from './components/FloatingAIChatWidget';

import {
  Home as HomeIcon,
  UserPlus,
  LogIn,
  LogOut,
  MessageSquare,
  Users,
  Bot,
  ShieldCheck,
  Menu,
  X,
  Clock,
  CheckCircle,
  GraduationCap,
  Sun,
  Moon,
  BookOpen,
  HelpCircle,
  PhoneCall,
  QrCode,
  Trophy,
  HeartHandshake,
  Calendar,
  Newspaper,
  Award,
  Shield,
  Scale,
  Sparkles,
  ChevronDown,
  Globe,
  FolderArchive,
  Grid
} from 'lucide-react';

function NavigationBar() {
  const { currentThemeKey, activeTheme, switchTheme } = useTheme();
  const { user, isAuthenticated, isPending, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sectorsDropdownOpen, setSectorsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSectorsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const toggleThemeMode = () => {
    const nextTheme = activeTheme.isDark ? 'clean-light' : 'classic-gold-blue';
    switchTheme(nextTheme);
  };

  // Primary Student Sectors displayed in the clean "قطاعات الرابطة" dropdown
  const primarySectors = [
    { path: '/', label: 'الرئيسية', icon: HomeIcon, desc: 'الأخبار، الإعلانات، والفعاليات' },
    { path: '/academic', label: 'الأكاديمية', icon: BookOpen, desc: 'مذكرات، امتحانات، ومجموعات دراسة' },
    { path: '/sports', label: 'الرياضة', icon: Trophy, desc: 'البطولات، الفرق، النتائج والترتيب', badge: 'دوري 2026' },
    { path: '/social', label: 'الاجتماعي', icon: HeartHandshake, desc: 'المبادرات، التطوع، ونظام الأسر' },
    { path: '/events', label: 'الفعاليات', icon: Calendar, desc: 'التسجيل، التقويم، والتغطيات' },
    { path: '/media', label: 'الإعلام', icon: Newspaper, desc: 'البيانات والأخبار الرسمية' },
    { path: '/achievements', label: 'التكريم والإنجازات', icon: Award, desc: 'المتفوقون، المبتكرون، والرياضيون' },
    { path: '/administration', label: 'الإدارة', icon: Shield, desc: 'المكتب التنفيذي واللجان والخطط' },
    { path: '/constitution', label: 'الدستور واللوائح', icon: Scale, desc: 'الدستور والمراسيم والتقارير' },
    { path: '/sudan', label: 'سوداننا', icon: Sparkles, desc: 'التراث، الولايات، المواهب والأدب', badge: '🇸🇩 بوابة الوطن' },
    { path: '/archive', label: 'أرشيف الرابطة', icon: FolderArchive, desc: 'الوثائق التاريخية والمطبوعات والألبومات', badge: 'جديد' },
  ];

  return (
    <>
      {/* 1. شريط الإعلانات العاجلة المتحرك */}
      <AnnouncementTicker />

      {/* 2. شريط التنقل الرئيسي النظيف والموحد */}
      <nav
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          {/* شعار الرابطة والاسم */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div
              className="logo-wrapper rounded-full overflow-hidden"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f59e0b',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.35)',
              }}
            >
              <img
                src={logoImg}
                alt="SSA Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </div>

            <div>
              <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '15px', lineHeight: '1.2' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '700' }}>
                كلية العلوم جامعة القاهرة
              </div>
            </div>
          </Link>

          {/* روابط التنقل الرئيسية النظيفة (بدون تكرار القطاعات) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-menu">
            
            {/* زر قطاعات الرابطة الموحد والنظيف مع Mega Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setSectorsDropdownOpen(!sectorsDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: sectorsDropdownOpen ? '#fbbf24' : '#ffffff',
                  background: sectorsDropdownOpen ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  border: sectorsDropdownOpen ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: sectorsDropdownOpen ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none',
                }}
              >
                <Grid size={16} color="#fbbf24" />
                <span>قطاعات الرابطة</span>
                <ChevronDown size={15} style={{ transform: sectorsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* القائمة المنسدلة المصقولة والشفافة بتأثير Blur ناعم */}
              {sectorsDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    width: '360px',
                    backgroundColor: 'rgba(15, 23, 42, 0.96)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    zIndex: 60,
                    display: 'grid',
                    gap: '4px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ padding: '6px 12px', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '4px' }}>
                    اختر القطاع أو البوابة المطلوبة:
                  </div>

                  {primarySectors.map((sector) => {
                    const Icon = sector.icon;
                    const isCurrent = location.pathname === sector.path;
                    return (
                      <Link
                        key={sector.path}
                        to={sector.path}
                        onClick={() => setSectorsDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          color: isCurrent ? '#fbbf24' : '#ffffff',
                          backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                          border: isCurrent ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '7px', borderRadius: '8px', flexShrink: 0 }}>
                          <Icon size={16} color={isCurrent ? '#f59e0b' : '#38bdf8'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{sector.label}</span>
                            {sector.badge && (
                              <span style={{ fontSize: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 6px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                {sector.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{sector.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* روابط الأعضاء المعتمدين */}
            {isAuthenticated && !isPending && (
              <>
                <Link
                  to="/posts"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/posts' ? '700' : '500',
                    color: location.pathname === '/posts' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/posts' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <MessageSquare size={15} />
                  <span>الملتقى الأكاديمي</span>
                </Link>

                <Link
                  to="/digital-id"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/digital-id' ? '700' : '500',
                    color: location.pathname === '/digital-id' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/digital-id' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <QrCode size={15} />
                  <span>بطاقتي الرقمية</span>
                </Link>

                <Link
                  to="/chat"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/chat' ? '700' : '500',
                    color: location.pathname === '/chat' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/chat' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <Users size={15} />
                  <span>غرف المذاكرة</span>
                </Link>

                <Link
                  to="/ai"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/ai' ? '700' : '500',
                    color: location.pathname === '/ai' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/ai' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <Bot size={15} />
                  <span>المستشار الذكي</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid #f59e0b',
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* معلومات تسجيل الدخول وتغيير الثيم */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }} className="user-info-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>
                      {user?.fullName || user?.name}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        backgroundColor: isAdmin
                          ? 'rgba(245, 158, 11, 0.2)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(34, 197, 94, 0.2)',
                        color: isAdmin ? '#fbbf24' : isPending ? '#eab308' : '#34d399',
                      }}
                    >
                      {isAdmin ? 'أدمن' : isPending ? 'مراجعة' : 'معتمد'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogoutClick}
                  title="تسجيل الخروج"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  <LogOut size={14} />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  <UserPlus size={14} />
                  <span>تسجيل</span>
                </Link>

                <Link
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0b1622',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <LogIn size={14} />
                  <span>دخول الأعضاء</span>
                </Link>
              </div>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleThemeMode}
              title={activeTheme.isDark ? 'الوضع النهاري' : 'الوضع الداكن'}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fbbf24',
                padding: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTheme.isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px' }}>
              قطاعات ومراكز الرابطة الطلابية:
            </div>
            {primarySectors.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#ffffff',
                    backgroundColor: location.pathname === s.path ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    fontSize: '14px',
                    fontWeight: location.pathname === s.path ? 'bold' : 'normal',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} color="#fbbf24" />
                    <span>{s.label}</span>
                  </div>
                  {s.badge && (
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px' }}>
                      {s.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAuthenticated && !isPending && (
              <>
                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '10px 0' }} />
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' }}>
                  خدمات الأعضاء:
                </div>
                <Link to="/posts" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>
                  <MessageSquare size={16} /> <span>الملتقى الأكاديمي</span>
                </Link>
                <Link to="/digital-id" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>
                  <QrCode size={16} /> <span>بطاقة العضوية الرقمية</span>
                </Link>
                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>
                  <Users size={16} /> <span>غرف المذاكرة التفاعلية</span>
                </Link>
                <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#ffffff', textDecoration: 'none', fontSize: '14px' }}>
                  <Bot size={16} /> <span>المستشار الذكي (AI)</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#fbbf24', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                    <ShieldCheck size={16} /> <span>لوحة الإدارة</span>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 980px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .user-info-text { display: block !important; }
        }
        @media (max-width: 979px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .user-info-text { display: none !important; }
        }
      `}</style>
    </>
  );
}

function Footer() {
  const { activeTheme } = useTheme();
  return (
    <footer
      style={{
        background: '#09131f',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '45px 20px 24px',
        marginTop: 'auto',
        color: '#cbd5e1',
        fontSize: '14px',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}
      >
        {/* معلومات الرابطة */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              className="logo-wrapper rounded-full overflow-hidden"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f59e0b',
              }}
            >
              <img
                src={logoImg}
                alt="SSA Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '15px' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: '#fbbf24', fontSize: '12px' }}>
                كلية العلوم - جامعة القاهرة
              </div>
            </div>
          </div>
          <p style={{ lineHeight: '1.8', margin: 0, color: '#cbd5e1' }}>
            الهيئة الطلابية الأكاديمية والاجتماعية والثقافية الممثلة لطلاب جمهورية السودان بكلية العلوم جامعة القاهرة.
          </p>
        </div>

        {/* قطاعات المنصة */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            قطاعات ومراكز الرابطة
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Link to="/academic" style={{ color: '#cbd5e1', textDecoration: 'none' }}>📚 الأكاديمية</Link>
            <Link to="/sports" style={{ color: '#cbd5e1', textDecoration: 'none' }}>⚽ الرياضة</Link>
            <Link to="/social" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🤝 الاجتماعي</Link>
            <Link to="/events" style={{ color: '#cbd5e1', textDecoration: 'none' }}>📅 الفعاليات</Link>
            <Link to="/media" style={{ color: '#cbd5e1', textDecoration: 'none' }}>📢 الإعلام</Link>
            <Link to="/achievements" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🏆 الإنجازات</Link>
            <Link to="/administration" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🛡️ الإدارة</Link>
            <Link to="/constitution" style={{ color: '#cbd5e1', textDecoration: 'none' }}>⚖️ الدستور</Link>
            <Link to="/sudan" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>🇸🇩 سوداننا</Link>
            <Link to="/archive" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>🏛️ أرشيف الرابطة</Link>
          </div>
        </div>

        {/* صفحات التواصل الاجتماعي */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            صفحات الرابطة الرسمية
          </h4>
          <SocialLinks variant="detailed" />
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#cbd5e1',
        }}
      >
        جميع الحقوق محفوظة © {new Date().getFullYear()} رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
      </div>
    </footer>
  );
}

function MainAppLayout() {
  const { activeTheme } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0a101d',
        color: '#ffffff',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <NavigationBar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/academic" element={<AcademicLibrary />} />
          <Route path="/library" element={<AcademicLibrary />} />
          <Route path="/sports" element={<SportsHub />} />
          <Route path="/sudan" element={<SudanPortal />} />
          <Route path="/social" element={<SocialHub />} />
          <Route path="/events" element={<EventsHub />} />
          <Route path="/media" element={<MediaHub />} />
          <Route path="/achievements" element={<AchievementsHub />} />
          <Route path="/administration" element={<AdministrationHub />} />
          <Route path="/constitution" element={<ConstitutionHub />} />
          <Route path="/archive" element={<ArchivePortal />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/digital-id" element={<DigitalIDPage />} />
          <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
          <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
          <Route path="/pending-approval" element={<PendingOrVerifiedRoute><PendingApproval /></PendingOrVerifiedRoute>} />
          <Route path="/posts" element={<VerifiedStudentRoute><Posts /></VerifiedStudentRoute>} />
          <Route path="/chat" element={<VerifiedStudentRoute><Chat /></VerifiedStudentRoute>} />
          <Route path="/ai" element={<VerifiedStudentRoute><AIChat /></VerifiedStudentRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingAIChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainAppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}