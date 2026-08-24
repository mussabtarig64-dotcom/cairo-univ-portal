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
import SocialLinks from './components/SocialLinks';
import FloatingAIChatWidget from './components/FloatingAIChatWidget';
import Navbar from './components/Navbar';

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
    /* استبدلنا الـ Inline Styles هنا بكلاسات Tailwind صريحة وقوية لإجبار الموقع على أخذ العرض الكامل */
    <div className="flex flex-col min-h-screen w-full bg-[#0a101d] text-white overflow-x-hidden" dir="rtl">
      <Navbar />

      {/* الـ main هنا أخذ flex-1 و w-full عشان يتمدد ويملأ أي مساحة متوفرة في النص */}
      <main className="flex-1 w-full max-w-full">
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