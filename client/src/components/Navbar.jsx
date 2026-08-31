import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
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
  BookOpen,
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
  FolderArchive,
  Grid,
  Sun,
  Moon,
  History
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const { activeTheme, switchTheme } = useTheme();
  const { user, isAuthenticated, isPending, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sectorsDropdownOpen, setSectorsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // إغلاق القائمة المنسدلة عند النقر في الخارج
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSectorsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // إغلاق قائمة الموبايل عند تغيير المسار
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSectorsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const toggleThemeMode = () => {
    const nextTheme = activeTheme.isDark ? 'clean-light' : 'classic-gold-blue';
    switchTheme(nextTheme);
  };

  // قطاعات الرابطة الأساسية
  const primarySectors = [
    { path: '/', label: 'الرئيسية', icon: HomeIcon, desc: 'الأخبار، الإعلانات، والفعاليات' },
    { path: '/story', label: 'قصة الموقع', icon: History, desc: 'من فكرة على ورق… إلى منصة على أرض الواقع', badge: 'مميز' },
    { path: '/academic', label: 'الأكاديمية', icon: BookOpen, desc: 'مذكرات، امتحانات، ومجموعات دراسة' },
    { path: '/sports', label: 'الرياضة', icon: Trophy, desc: 'البطولات، الفرق، النتائج والترتيب', badge: 'دوري 2026' },
    { path: '/social', label: 'الاجتماعي', icon: HeartHandshake, desc: 'المبادرات، التطوع، ونظام الأسر' },
    { path: '/events', label: 'الفعاليات', icon: Calendar, desc: 'التسجيل، التقويم، والتغطيات' },
    { path: '/media', label: 'الإعلام', icon: Newspaper, desc: 'البيانات والأخبار الرسمية' },
    { path: '/achievements', label: 'التكريم والإنجازات', icon: Award, desc: 'المتفوقون، المبتكرون، والرياضيون' },
    { path: '/administration', label: 'الإدارة', icon: Shield, desc: 'المكتب التنفيذي واللجان والخطط' },
    { path: '/constitution', label: 'الدستور واللوائح', icon: Scale, desc: 'الدستور والمراسيم والتقارير', badge: 'أدمن 🔒', adminOnly: true },
    { path: '/sudan', label: 'سوداننا', icon: Sparkles, desc: 'التراث، الولايات، المواهب والأدب', badge: '🇸🇩 بوابة الوطن' },
    { path: '/archive', label: 'أرشيف الرابطة', icon: FolderArchive, desc: 'الوثائق التاريخية والمطبوعات والألبومات', badge: 'جديد' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111827] border-b border-slate-800" style={{ direction: 'rtl' }}>
      <nav
        className="navbar-main"
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="navbar-container"
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* شعار الرابطة والاسم */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <div
              className="logo-wrapper"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f59e0b',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.35)',
                flexShrink: 0,
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

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div
                className="logo-title-text"
                style={{
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '14px',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                رابطة الطلاب السودانيين
              </div>
              <div
                className="logo-subtitle-text"
                style={{
                  color: '#fbbf24',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                }}
              >
                كلية العلوم جامعة القاهرة
              </div>
            </div>
          </Link>

          {/* روابط التنقل للشاشات الكبيرة (Desktop Menu) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-menu">
            
            {/* زر قطاعات الرابطة الموحد مع Mega Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSectorsDropdownOpen(!sectorsDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 'bold',
                  color: sectorsDropdownOpen ? '#fbbf24' : '#ffffff',
                  background: sectorsDropdownOpen ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  border: sectorsDropdownOpen ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: sectorsDropdownOpen ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none',
                }}
              >
                <Grid size={15} color="#fbbf24" />
                <span>قطاعات الرابطة</span>
                <ChevronDown size={14} style={{ transform: sectorsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* القائمة المنسدلة المصقولة */}
              {sectorsDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    width: '350px',
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
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
                          padding: '9px 12px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          color: isCurrent ? '#fbbf24' : '#ffffff',
                          backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                          border: isCurrent ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
                          <Icon size={15} color={isCurrent ? '#f59e0b' : '#38bdf8'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{sector.label}</span>
                            {sector.badge && (
                              <span style={{ fontSize: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 6px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                {sector.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>{sector.desc}</div>
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
                    padding: '8px 11px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/posts' ? '700' : '500',
                    color: location.pathname === '/posts' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/posts' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <MessageSquare size={14} />
                  <span>الملتقى الأكاديمي</span>
                </Link>

                <Link
                  to="/digital-id"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 11px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/digital-id' ? '700' : '500',
                    color: location.pathname === '/digital-id' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/digital-id' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <QrCode size={14} />
                  <span>بطاقتي الرقمية</span>
                </Link>

                <Link
                  to="/chat"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 11px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/chat' ? '700' : '500',
                    color: location.pathname === '/chat' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/chat' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <Users size={14} />
                  <span>غرف المذاكرة</span>
                </Link>

                <Link
                  to="/ai"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 11px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: location.pathname === '/ai' ? '700' : '500',
                    color: location.pathname === '/ai' ? '#fbbf24' : '#ffffff',
                    background: location.pathname === '/ai' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <Bot size={14} />
                  <span>المستشار الذكي</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid #f59e0b',
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* أزرار الإجراءات والدخول والمظهر */}
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ textAlign: 'right' }} className="user-info-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#ffffff', fontSize: '12.5px', fontWeight: 'bold', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.fullName || user?.name}
                    </span>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 'bold',
                        padding: '1px 6px',
                        borderRadius: '6px',
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
                  type="button"
                  onClick={handleLogoutClick}
                  title="تسجيل الخروج"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 'bold',
                  }}
                >
                  <LogOut size={13} />
                  <span className="logout-btn-label">خروج</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="auth-btns-group">
                <Link
                  to="/register"
                  className="nav-register-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '7px 11px',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <UserPlus size={13} />
                  <span>تسجيل</span>
                </Link>

                <Link
                  to="/login"
                  className="nav-login-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0b1622',
                    padding: '7px 12px',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <LogIn size={13} />
                  <span>دخول</span>
                </Link>
              </div>
            )}

            {/* Notification Center */}
            <NotificationCenter />

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleThemeMode}
              title={activeTheme.isDark ? 'الوضع النهاري' : 'الوضع الداكن'}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fbbf24',
                padding: '7px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {activeTheme.isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '7px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div
            className="mobile-drawer-menu"
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px 14px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: 'calc(85vh - 70px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {/* Quick Auth actions in mobile menu if not logged in */}
            {!isAuthenticated && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                  }}
                >
                  <UserPlus size={15} />
                  <span>تسجيل جديد</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0b1622',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                  }}
                >
                  <LogIn size={15} />
                  <span>دخول الأعضاء</span>
                </Link>
              </div>
            )}

            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '4px', paddingRight: '4px' }}>
              قطاعات ومراكز الرابطة:
            </div>
            {primarySectors.map((s) => {
              const Icon = s.icon;
              const isCurrent = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: isCurrent ? '#fbbf24' : '#ffffff',
                    backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isCurrent ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                    fontSize: '13.5px',
                    fontWeight: isCurrent ? 'bold' : '500',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <Icon size={16} color={isCurrent ? '#f59e0b' : '#38bdf8'} />
                    <span>{s.label}</span>
                  </div>
                  {s.badge && (
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {s.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAuthenticated && !isPending && (
              <>
                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px', paddingRight: '4px' }}>
                  خدمات وبوابات الأعضاء:
                </div>
                <Link to="/posts" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', color: '#ffffff', textDecoration: 'none', fontSize: '13.5px', borderRadius: '8px', backgroundColor: location.pathname === '/posts' ? 'rgba(245, 158, 11, 0.15)' : 'transparent' }}>
                  <MessageSquare size={15} color="#fbbf24" /> <span>الملتقى الأكاديمي</span>
                </Link>
                <Link to="/digital-id" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', color: '#ffffff', textDecoration: 'none', fontSize: '13.5px', borderRadius: '8px', backgroundColor: location.pathname === '/digital-id' ? 'rgba(245, 158, 11, 0.15)' : 'transparent' }}>
                  <QrCode size={15} color="#fbbf24" /> <span>بطاقة العضوية الرقمية</span>
                </Link>
                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', color: '#ffffff', textDecoration: 'none', fontSize: '13.5px', borderRadius: '8px', backgroundColor: location.pathname === '/chat' ? 'rgba(245, 158, 11, 0.15)' : 'transparent' }}>
                  <Users size={15} color="#fbbf24" /> <span>غرف المذاكرة التفاعلية</span>
                </Link>
                <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', color: '#ffffff', textDecoration: 'none', fontSize: '13.5px', borderRadius: '8px', backgroundColor: location.pathname === '/ai' ? 'rgba(245, 158, 11, 0.15)' : 'transparent' }}>
                  <Bot size={15} color="#fbbf24" /> <span>المستشار الذكي (AI)</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', color: '#fbbf24', textDecoration: 'none', fontSize: '13.5px', fontWeight: 'bold', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <ShieldCheck size={15} color="#fbbf24" /> <span>لوحة الإدارة المركزية</span>
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
          .mobile-menu-btn { display: flex !important; }
          .user-info-text { display: none !important; }
        }
        @media (max-width: 480px) {
          .logo-title-text {
            font-size: 12.5px !important;
          }
          .logo-subtitle-text {
            font-size: 9.5px !important;
          }
          .nav-register-btn span,
          .nav-login-btn span {
            font-size: 11px !important;
          }
          .nav-register-btn,
          .nav-login-btn {
            padding: 6px 8px !important;
          }
          .logout-btn-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
