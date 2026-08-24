import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  FolderArchive,
  Sun,
  Moon,
  ChevronLeft,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, isPending, isAdmin, logout } = useAuth();
  const { activeTheme, switchTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const nextTheme = activeTheme.isDark ? 'clean-light' : 'classic-gold-blue';
    switchTheme(nextTheme);
  };

  const navLinks = [
    { path: '/', label: 'الرئيسية', icon: HomeIcon },
    { path: '/academic', label: 'المكتبة الأكاديمية', icon: BookOpen },
    { path: '/sports', label: 'القطاع الرياضي', icon: Trophy, badge: 'دوري 2026' },
    { path: '/social', label: 'القطاع الاجتماعي', icon: HeartHandshake },
    { path: '/events', label: 'الفعاليات والأنشطة', icon: Calendar },
    { path: '/media', label: 'الإعلام والنشر', icon: Newspaper },
    { path: '/achievements', label: 'التكريم والإنجازات', icon: Award },
    { path: '/administration', label: 'إدارة الرابطة', icon: Shield },
    { path: '/constitution', label: 'الدستور واللوائح', icon: Scale },
    { path: '/sudan', label: 'بوابة سوداننا', icon: Sparkles, badge: '🇸🇩 الوطن' },
    { path: '/archive', label: 'أرشيف الرابطة', icon: FolderArchive },
  ];

  const memberLinks = [
    { path: '/posts', label: 'الملتقى الأكاديمي', icon: MessageSquare },
    { path: '/digital-id', label: 'بطاقة العضوية الرقمية', icon: QrCode },
    { path: '/chat', label: 'غرف المذاكرة التفاعلية', icon: Users },
    { path: '/ai', label: 'المستشار الذكي (AI)', icon: Bot },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a101d] text-white flex flex-col relative overflow-x-hidden" dir="rtl">
      
      {/* Mobile Top Navigation Bar (< lg) */}
      <header className="lg:hidden fixed top-0 right-0 left-0 h-16 w-full bg-[#0d1522] border-b border-slate-800 px-4 flex items-center justify-between z-40 shadow-lg">
        {/* Branding on Mobile Top Bar */}
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 border border-amber-500 flex-shrink-0 flex items-center justify-center shadow-md">
            <img src={logoImg} alt="SSA Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-xs sm:text-sm leading-tight">رابطة الطلاب السودانيين</span>
            <span className="text-amber-400 text-[10px] font-bold">SSA-FS-CU</span>
          </div>
        </Link>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-700 transition-colors"
            title="تبديل المظهر"
          >
            {activeTheme.isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-colors"
            aria-label="تبديل القائمة الجانبية"
          >
            {isMobileMenuOpen ? <X size={20} className="text-amber-400" /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Fixed on Desktop, Slide-over Drawer on Mobile) */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-[#0d1522] border-l border-slate-800 text-slate-300 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Area in Sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 text-decoration-none">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 border-2 border-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg">
              <img src={logoImg} alt="SSA Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm tracking-tight">رابطة الطلاب السودانيين</span>
              <span className="text-amber-400 text-xs font-extrabold tracking-wider">SSA-FS-CU</span>
              <span className="text-[10px] text-slate-400">كلية العلوم - جامعة القاهرة</span>
            </div>
          </Link>

          {/* Close button on mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">

          {/* Guest Action Prompt if Not Logged In */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Link
                to="/register"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all text-center"
              >
                <UserPlus size={14} />
                <span>تسجيل</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:from-amber-400 hover:to-amber-500 transition-all text-center shadow-md shadow-amber-500/20"
              >
                <LogIn size={14} />
                <span>دخول</span>
              </Link>
            </div>
          )}

          {/* Main Navigation Links */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 px-3 mb-2 flex items-center justify-between">
              <span>القائمة الرئيسية</span>
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-sm shadow-amber-500/5'
                        : 'text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:translate-x-[-2px]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Member Portals (If Authenticated) */}
          {isAuthenticated && !isPending && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 px-3 mb-2">
                <span>بوابات وخدمات الأعضاء</span>
              </div>
              <nav className="space-y-1">
                {memberLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-sm shadow-amber-500/5'
                          : 'text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:translate-x-[-2px]'
                      }`}
                    >
                      <Icon size={17} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Admin Dashboard Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                      location.pathname === '/admin'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    <ShieldCheck size={17} className="text-amber-400" />
                    <span>لوحة الإدارة المركزية</span>
                  </Link>
                )}
              </nav>
            </div>
          )}

        </div>

        {/* Bottom Sidebar User Profile / Footer Controls */}
        <div className="p-3 border-t border-slate-800 bg-[#090e17] flex-shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center flex-shrink-0">
                  {(user?.fullName || user?.name || 'ط')[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-xs font-bold truncate">
                    {user?.fullName || user?.name}
                  </span>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded w-max ${
                      isAdmin
                        ? 'bg-amber-500/20 text-amber-400'
                        : isPending
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isAdmin ? 'أدمن' : isPending ? 'قيد المراجعة' : 'عضو معتمد'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1">
              <span>منصة الرابطة الرقمية</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors"
                title="تبديل المظهر"
              >
                {activeTheme.isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* Main Content Area (offset by lg:pr-64 for fixed sidebar, and pt-16 for mobile topbar) */}
      <div className="flex-1 w-full max-w-full flex flex-col min-h-screen pt-16 lg:pt-0 lg:pr-64 transition-all duration-300">
        <main className="flex-1 w-full max-w-full">
          {children}
        </main>
      </div>

    </div>
  );
}
