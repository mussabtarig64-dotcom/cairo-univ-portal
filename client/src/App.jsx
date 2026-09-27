import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import logoImg from './assets/logo.png';

import {
  VerifiedStudentRoute,
  PendingOrVerifiedRoute,
  AdminRoute,
  GuestOnlyRoute
} from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import OccasionBanner from './components/OccasionBanner';
import SeasonalDecorations from './components/SeasonalDecorations';
import SocialLinks from './components/SocialLinks';

// Lazy-loaded route pages for optimal initial page load & code-splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PendingApproval = lazy(() => import('./pages/PendingApproval'));
const Posts = lazy(() => import('./pages/Posts'));
const Chat = lazy(() => import('./pages/Chat'));
const AIChat = lazy(() => import('./pages/AIChat'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AcademicLibrary = lazy(() => import('./pages/AcademicLibrary'));
const SportsHub = lazy(() => import('./pages/SportsHub'));
const SudanPortal = lazy(() => import('./pages/SudanPortal'));
const SocialHub = lazy(() => import('./pages/SocialHub'));
const EventsHub = lazy(() => import('./pages/EventsHub'));
const MediaHub = lazy(() => import('./pages/MediaHub'));
const AchievementsHub = lazy(() => import('./pages/AchievementsHub'));
const AdministrationHub = lazy(() => import('./pages/AdministrationHub'));
const ConstitutionHub = lazy(() => import('./pages/ConstitutionHub'));
const ArchivePortal = lazy(() => import('./pages/ArchivePortal'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const DigitalIDPage = lazy(() => import('./pages/DigitalIDPage'));
const SiteStory = lazy(() => import('./pages/SiteStory'));

// Lazy-loaded non-critical widgets
const FloatingAIChatWidget = lazy(() => import('./components/FloatingAIChatWidget'));

// Lightweight, smooth fallback loader during route transitions
function PageFallbackLoader() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        color: '#38bdf8',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '3px solid rgba(56, 189, 248, 0.2)',
          borderTopColor: '#38bdf8',
          animation: 'routeSpin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>
        جاري تحميل الصفحة...
      </span>
      <style>{`@keyframes routeSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Footer() {
  const { activeTheme } = useTheme();
  return (
    <footer
      className="w-full bg-[#09131f] border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 mt-auto text-slate-300 text-sm"
      dir="rtl"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
        {/* معلومات الرابطة */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              className="logo-wrapper rounded-full overflow-hidden"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f59e0b',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              }}
            >
              <img
                src={logoImg}
                alt="SSA Logo"
                loading="lazy"
                decoding="async"
                width="46"
                height="46"
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
              <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '16px' }}>
                رابطة الطلاب السودانيين
              </div>
              <div style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 'bold' }}>
                كلية العلوم - جامعة القاهرة
              </div>
            </div>
          </div>
          <p style={{ lineHeight: '1.8', margin: 0, color: '#cbd5e1', maxWidth: '520px' }}>
            الهيئة الطلابية الأكاديمية والاجتماعية والثقافية الممثلة لطلاب جمهورية السودان بكلية العلوم جامعة القاهرة. منصة رقمية متكاملة لخدمة ورعاية الطلاب وتوثيق مسيرتهم.
          </p>
        </div>

        {/* صفحات التواصل الاجتماعي الرسمية */}
        <div className="md:flex md:flex-col md:items-start lg:items-end">
          <div className="w-full max-w-md">
            <h4 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
              صفحات وقنوات الرابطة الرسمية
            </h4>
            <SocialLinks variant="detailed" />
          </div>
        </div>
      </div>

      <div
        className="w-full max-w-7xl mx-auto border-t border-white/10 pt-5 text-center text-xs text-slate-400"
      >
        جميع الحقوق محفوظة © {new Date().getFullYear()} رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
      </div>
    </footer>
  );
}

function MainAppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0a101d] text-white flex flex-col overflow-x-hidden" dir="rtl">
      <OccasionBanner />
      <SeasonalDecorations />
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Suspense fallback={<PageFallbackLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<SiteStory />} />
            <Route path="/site-story" element={<SiteStory />} />
            <Route path="/academic" element={<AcademicLibrary />} />
            <Route path="/library" element={<AcademicLibrary />} />
            <Route path="/majors" element={<AcademicLibrary defaultTab="majors" />} />
            <Route path="/academic-majors" element={<AcademicLibrary defaultTab="majors" />} />
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
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <FloatingAIChatWidget />
      </Suspense>
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
