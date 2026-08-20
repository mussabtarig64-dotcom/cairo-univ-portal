import React, { useState } from 'react';
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
import AnnouncementTicker from './components/AnnouncementTicker';
import SocialLinks from './components/SocialLinks';

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
  GraduationCap
} from 'lucide-react';

function NavigationBar() {
  const { activeTheme } = useTheme();
  const { user, isAuthenticated, isPending, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  let navLinks = [];

  if (!isAuthenticated) {
    navLinks = [
      { path: '/', label: 'الرئيسية', icon: HomeIcon },
      { path: '/register', label: 'استمارة التسجيل والاستبيان', icon: UserPlus, highlight: true },
      { path: '/login', label: 'دخول الأعضاء', icon: LogIn },
    ];
  } else if (isPending) {
    navLinks = [
      { path: '/', label: 'الرئيسية', icon: HomeIcon },
      { path: '/pending-approval', label: 'حالة القيد والاعتماد', icon: Clock, badge: 'قيد المراجعة' },
    ];
  } else if (isAdmin) {
    navLinks = [
      { path: '/', label: 'الرئيسية', icon: HomeIcon },
      { path: '/posts', label: 'الملتقى الأكاديمي', icon: MessageSquare },
      { path: '/chat', label: 'غرف المذاكرة', icon: Users },
      { path: '/ai', label: 'المستشار الذكي', icon: Bot },
      { path: '/admin', label: 'لوحة الإدارة', icon: ShieldCheck, highlight: true },
    ];
  } else {
    navLinks = [
      { path: '/', label: 'الرئيسية', icon: HomeIcon },
      { path: '/posts', label: 'الملتقى الأكاديمي', icon: MessageSquare },
      { path: '/chat', label: 'غرف المذاكرة', icon: Users },
      { path: '/ai', label: 'المستشار الذكي', icon: Bot, isNew: true },
    ];
  }

  return (
    <>
      {/* 1. شريط الإعلانات العاجلة المتحرك (Live Announcement Ticker) */}
      <AnnouncementTicker />

      {/* 2. شريط التنقل الرئيسي */}
      <nav
        style={{
          background: activeTheme.bgCard,
          borderBottom: `1px solid ${activeTheme.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* شعار الرابطة والاسم الكامل */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${activeTheme.accent}`,
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)',
                flexShrink: 0,
              }}
            >
              <img src={logoImg} alt="SSA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ color: activeTheme.textMain, fontWeight: '900', fontSize: '15px', lineHeight: '1.2' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: activeTheme.accentLight, fontSize: '12px', fontWeight: '700' }}>
                كلية العلوم جامعة القاهرة
              </div>
            </div>
          </Link>

          {/* روابط التنقل الرئيسية لسطح المكتب */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-menu">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? activeTheme.accentLight : activeTheme.textMain,
                    background: isActive
                      ? 'rgba(255,255,255,0.08)'
                      : link.highlight
                      ? `${activeTheme.primary}30`
                      : 'transparent',
                    border: link.highlight ? `1px solid ${activeTheme.accent}` : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                  {link.isNew && (
                    <span
                      style={{
                        background: activeTheme.accent,
                        color: '#000000',
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      جديد
                    </span>
                  )}
                  {link.badge && (
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        border: '1px solid #f59e0b',
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* الروابط الاجتماعية السريعة في الهيدر ومعلومات الحساب */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* أيقونات التواصل الاجتماعي */}
            <div className="header-social-links">
              <SocialLinks variant="compact" />
            </div>

            {/* حالة تسجيل الدخول */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }} className="user-info-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: activeTheme.textMain, fontSize: '13px', fontWeight: 'bold' }}>
                      {user?.fullName || user?.name}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: isAdmin
                          ? 'rgba(245, 158, 11, 0.2)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(34, 197, 94, 0.2)',
                        color: isAdmin ? '#fbbf24' : isPending ? '#eab308' : '#22c55e',
                        border: `1px solid ${isAdmin ? '#f59e0b' : isPending ? '#eab308' : '#22c55e'}`,
                      }}
                    >
                      {isAdmin ? 'أدمن / إدارة' : isPending ? 'قيد المراجعة' : 'عضو معتمد'}
                    </span>
                  </div>
                  <div style={{ color: activeTheme.textMuted, fontSize: '11px' }}>
                    {user?.department || 'كلية العلوم'}
                  </div>
                </div>

                <button
                  onClick={handleLogoutClick}
                  title="تسجيل الخروج"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  <LogOut size={15} />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                    color: '#0b1622',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <LogIn size={15} />
                  <span>دخول الأعضاء</span>
                </Link>
              </div>
            )}

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${activeTheme.border}`,
                color: activeTheme.textMain,
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل المنسدلة */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: activeTheme.bgDark,
              borderTop: `1px solid ${activeTheme.border}`,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: isActive ? activeTheme.accentLight : activeTheme.textMain,
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '500',
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${activeTheme.border}` }}>
              <div style={{ color: activeTheme.textMuted, fontSize: '12px', marginBottom: '8px' }}>صفحات الرابطة الرسمية:</div>
              <SocialLinks variant="compact" />
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 860px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .user-info-text { display: block !important; }
          .header-social-links { display: block !important; }
        }
        @media (max-width: 859px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .user-info-text { display: none !important; }
          .header-social-links { display: none !important; }
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
        background: activeTheme.bgCard,
        borderTop: `1px solid ${activeTheme.border}`,
        padding: '40px 20px 24px',
        marginTop: 'auto',
        color: activeTheme.textMuted,
        fontSize: '13px',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}
      >
        {/* معلومات الرابطة */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                border: `1px solid ${activeTheme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              SSA
            </div>
            <div>
              <div style={{ color: activeTheme.textMain, fontWeight: '900', fontSize: '15px' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: activeTheme.accentLight, fontSize: '12px' }}>
                كلية العلوم - جامعة القاهرة
              </div>
            </div>
          </div>
          <p style={{ lineHeight: '1.8', margin: 0 }}>
            الهيئة الطلابية الأكاديمية والاجتماعية الرسمية الممثلة لطلاب جمهورية السودان بكلية العلوم - جامعة القاهرة.
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 style={{ color: activeTheme.textMain, marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            روابط المنصة السريعة
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/register" style={{ color: activeTheme.accentLight, textDecoration: 'none', fontWeight: '600' }}>
              استمارة التسجيل المركزي والاستبيان
            </Link>
            <Link to="/posts" style={{ color: activeTheme.textMuted, textDecoration: 'none' }}>
              غرفة المنشورات والملتقى الأكاديمي
            </Link>
            <Link to="/ai" style={{ color: activeTheme.textMuted, textDecoration: 'none' }}>
              المستشار الأكاديمي والرفيق الذكي
            </Link>
            <Link to="/chat" style={{ color: activeTheme.textMuted, textDecoration: 'none' }}>
              غرف المذاكرة ودليل المستجدين
            </Link>
            <Link to="/admin" style={{ color: activeTheme.textMuted, textDecoration: 'none' }}>
              لوحة الإدارة والسجل المركزي
            </Link>
          </div>
        </div>

        {/* صفحات التواصل الاجتماعي الرسمية */}
        <div>
          <h4 style={{ color: activeTheme.textMain, marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            صفحات الرابطة الرسمية
          </h4>
          <SocialLinks variant="detailed" />
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${activeTheme.border}`,
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: activeTheme.textMuted,
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
        backgroundColor: activeTheme.bgDark,
        color: activeTheme.textMain,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <NavigationBar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
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