import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  X,
  UserCheck,
  Clock,
  Search,
  Users,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Download,
  Eye,
  FileText,
  Megaphone,
  Plus,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Palette,
  CheckCircle2
} from 'lucide-react';

import { API_BASE } from '../config/api';

export default function AdminDashboard() {
  const { currentThemeKey, activeTheme, switchTheme, availableThemes } = useTheme();
  const { user, updateUserRole } = useAuth();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'themes' | 'announcements'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', isPinned: true });
  const [themeSuccessMsg, setThemeSuccessMsg] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // 1. تحميل من السيرفر
    try {
      const [studentsRes, annRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/admin/students`),
        axios.get(`${API_BASE}/admin/announcements`),
      ]);

      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.students) {
        const all = studentsRes.value.data.students;
        const p = all.filter((s) => s.verificationStatus === 'pending');
        const a = all.filter(
          (s) =>
            (s.verificationStatus === 'verified' || s.verificationStatus === 'approved' || s.status === 'approved') &&
            s.verificationStatus !== 'rejected' &&
            s.status !== 'rejected'
        );
        const r = all.filter((s) => s.verificationStatus === 'rejected' || s.status === 'rejected');

        // مزامنة التخزين المحلي فوراً مع السيرفر لضمان تطابق البيانات
        try {
          const localPending = JSON.parse(localStorage.getItem('pending_users') || '[]');
          const approvedEmails = new Set(a.map((s) => s.email?.toLowerCase()).filter(Boolean));
          const rejectedEmails = new Set(r.map((s) => s.email?.toLowerCase()).filter(Boolean));

          // إزالة أي طالب تم اعتماده أو رفضه من قائمة المعلقين محلياً
          const cleanLocalPending = localPending.filter(
            (lp) => !approvedEmails.has(lp.email?.toLowerCase()) && !rejectedEmails.has(lp.email?.toLowerCase())
          );
          localStorage.setItem('pending_users', JSON.stringify(cleanLocalPending));

          const localApproved = JSON.parse(localStorage.getItem('approved_users') || '[]');
          const mergedApproved = [...a];
          localApproved.forEach((la) => {
            if (la.email && !approvedEmails.has(la.email.toLowerCase()) && !rejectedEmails.has(la.email.toLowerCase())) {
              mergedApproved.push(la);
            }
          });
          localStorage.setItem('approved_users', JSON.stringify(mergedApproved));

          const localRejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');
          const mergedRejected = [...r];
          localRejected.forEach((lr) => {
            if (lr.email && !rejectedEmails.has(lr.email.toLowerCase()) && !approvedEmails.has(lr.email.toLowerCase())) {
              mergedRejected.push(lr);
            }
          });
          localStorage.setItem('rejected_users', JSON.stringify(mergedRejected));

          setPendingUsers(p);
          setApprovedUsers(mergedApproved);
          setRejectedUsers(mergedRejected);
        } catch (syncErr) {
          setPendingUsers(p);
          setApprovedUsers(a);
          setRejectedUsers(r);
        }
      } else {
        fallbackToLocalStorage();
      }

      if (annRes.status === 'fulfilled' && Array.isArray(annRes.value.data)) {
        setAnnouncements(annRes.value.data);
      }
    } catch (e) {
      fallbackToLocalStorage();
    }
  };

  const fallbackToLocalStorage = () => {
    const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const approved = JSON.parse(localStorage.getItem('approved_users') || '[]');
    const rejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');
    const admins = JSON.parse(localStorage.getItem('admin_users') || '[]');

    const approvedEmails = new Set(approved.map((ap) => ap.email?.toLowerCase()).filter(Boolean));
    const rejectedEmails = new Set(rejected.map((rp) => rp.email?.toLowerCase()).filter(Boolean));

    const cleanPending = pending.filter(
      (p) => !approvedEmails.has(p.email?.toLowerCase()) && !rejectedEmails.has(p.email?.toLowerCase())
    );

    const combinedApproved = [
      ...approved.filter((ap) => !rejectedEmails.has(ap.email?.toLowerCase())),
      ...admins.filter(
        (adm) =>
          !approved.some((ap) => ap.email?.toLowerCase() === adm.email?.toLowerCase()) &&
          !rejectedEmails.has(adm.email?.toLowerCase())
      ),
    ];

    setPendingUsers(cleanPending);
    setApprovedUsers(combinedApproved);
    setRejectedUsers(rejected);
  };

  // 1. قبول واعتماد طالب معلق أو إعادة قبول طالب مرفوض (Approve / Re-Approve)
  const handleApprove = async (student) => {
    const studentId = student._id || student.id;
    const studentEmail = (student.email || '').toLowerCase().trim();

    const approvedStudent = {
      ...student,
      verificationStatus: 'verified',
      status: 'approved',
      role: student.role || 'user',
    };

    const isMatch = (u) => {
      if (studentId && (u._id === studentId || u.id === studentId)) return true;
      if (studentEmail && u.email && u.email.toLowerCase().trim() === studentEmail) return true;
      return false;
    };

    const newPending = pendingUsers.filter((u) => !isMatch(u));
    const newRejected = rejectedUsers.filter((u) => !isMatch(u));
    const newApproved = [approvedStudent, ...approvedUsers.filter((u) => !isMatch(u))];

    setPendingUsers(newPending);
    setRejectedUsers(newRejected);
    setApprovedUsers(newApproved);

    // تحديث فوري وشامل في التخزين المحلي
    try {
      const localPending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      localStorage.setItem('pending_users', JSON.stringify(localPending.filter((u) => !isMatch(u))));

      const localRejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');
      localStorage.setItem('rejected_users', JSON.stringify(localRejected.filter((u) => !isMatch(u))));

      const localApproved = JSON.parse(localStorage.getItem('approved_users') || '[]');
      const updatedLocalApproved = [approvedStudent, ...localApproved.filter((u) => !isMatch(u))];
      localStorage.setItem('approved_users', JSON.stringify(updatedLocalApproved));

      // إذا كان المستخدم المعتمد هو المستخدم الحالي المسجل دخوله
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || 'null');
      if (currentUser && isMatch(currentUser)) {
        const updatedCurrent = { ...currentUser, verificationStatus: 'verified', status: 'approved' };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));
        localStorage.setItem('user', JSON.stringify(updatedCurrent));
      }
    } catch (e) {
      console.error('LocalStorage approve error:', e);
    }

    try {
      await axios.patch(`${API_BASE}/admin/students/${studentId}/status`, { status: 'verified' });
    } catch (e) {
      console.log('Server update note:', e.message);
    }
  };

  // 2. رفض طلب طالب معلق أو حظر حساب طالب
  const handleReject = async (studentId, studentEmail) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في رفض هذا الطلب وحظر تسجيل الدخول؟')) return;

    const isMatch = (u) => {
      if (studentId && (u._id === studentId || u.id === studentId)) return true;
      if (studentEmail && u.email && u.email.toLowerCase().trim() === studentEmail.toLowerCase().trim()) return true;
      return false;
    };

    const targetStudent =
      pendingUsers.find(isMatch) ||
      approvedUsers.find(isMatch) || { _id: studentId, id: studentId, email: studentEmail };

    const rejectedStudent = {
      ...targetStudent,
      verificationStatus: 'rejected',
      status: 'rejected',
    };

    const newPending = pendingUsers.filter((u) => !isMatch(u));
    const newApproved = approvedUsers.filter((u) => !isMatch(u));
    const newRejected = [rejectedStudent, ...rejectedUsers.filter((u) => !isMatch(u))];

    setPendingUsers(newPending);
    setApprovedUsers(newApproved);
    setRejectedUsers(newRejected);

    try {
      const localPending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      localStorage.setItem('pending_users', JSON.stringify(localPending.filter((u) => !isMatch(u))));

      const localApproved = JSON.parse(localStorage.getItem('approved_users') || '[]');
      localStorage.setItem('approved_users', JSON.stringify(localApproved.filter((u) => !isMatch(u))));

      const localRejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');
      localStorage.setItem('rejected_users', JSON.stringify([rejectedStudent, ...localRejected.filter((u) => !isMatch(u))]));

      // إذا كان المرفوض هو الحساب الحالي المسجل دخوله
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || 'null');
      if (currentUser && isMatch(currentUser) && currentUser.role !== 'admin') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
      }
    } catch (e) {}

    try {
      await axios.patch(`${API_BASE}/admin/students/${studentId}/status`, { status: 'rejected' });
    } catch (e) {}
  };

  // حذف سجل طالب مرفوض نهائياً
  const handleDeleteRejected = async (studentId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل المرفوض نهائياً؟')) return;
    const updated = rejectedUsers.filter((u) => (u._id || u.id) !== studentId);
    setRejectedUsers(updated);
    try {
      const localRejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');
      localStorage.setItem('rejected_users', JSON.stringify(localRejected.filter((u) => (u._id || u.id) !== studentId)));
      await axios.delete(`${API_BASE}/admin/students/${studentId}`);
    } catch (e) {}
  };

  // 3. ترقية أو عزل الأدمن (Promote / Demote) مع التحديث الفوري
  const handleToggleAdminRole = async (targetUser) => {
    const userId = targetUser._id || targetUser.id;
    const isCurrentlyAdmin = targetUser.role === 'admin';
    const newRole = isCurrentlyAdmin ? 'user' : 'admin';

    const confirmMsg = isCurrentlyAdmin
      ? `هل تريد إزالة صلاحيات الأدمن عن: ${targetUser.fullName || targetUser.name}؟`
      : `هل تريد ترقية ${targetUser.fullName || targetUser.name} إلى رتبة أدمن (مدير الرابطة)؟`;

    if (!window.confirm(confirmMsg)) return;

    // تحديث القائمة المحلية
    const updatedApproved = approvedUsers.map((u) => {
      if ((u._id || u.id) === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });

    setApprovedUsers(updatedApproved);
    localStorage.setItem('approved_users', JSON.stringify(updatedApproved));

    // تحديث في AuthContext
    if (updateUserRole) {
      updateUserRole(userId, newRole);
    }

    try {
      await axios.patch(`${API_BASE}/admin/students/${userId}/role`, { role: newRole });
    } catch (e) {}
  };

  // 4. حذف سجل طالب معتمد
  const handleDeleteApproved = async (userId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء اعتماد هذا الحساب وحذفه نهائياً؟')) return;

    const updated = approvedUsers.filter((u) => (u._id || u.id) !== userId);
    setApprovedUsers(updated);
    localStorage.setItem('approved_users', JSON.stringify(updated));

    try {
      await axios.delete(`${API_BASE}/admin/students/${userId}`);
    } catch (e) {}
  };

  // 5. تصدير ملف الـ CSV
  const handleExportCSV = () => {
    window.open(`${API_BASE}/admin/export`, '_blank');
  };

  // 6. اختيار المظهر وتطبيقه عالمياً
  const handleSelectTheme = (themeKey) => {
    switchTheme(themeKey);
    setThemeSuccessMsg(`تم تطبيق مظهر "${availableThemes[themeKey]?.name}" بنجاح على البوابة بالكامل لجميع المستخدمين! ✨`);
    setTimeout(() => setThemeSuccessMsg(''), 4000);
  };

  // 7. إضافة إعلان لشريط الأخبار
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.content.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/admin/announcements`, newAnnouncement);
      if (res.data?.announcement) {
        setAnnouncements([res.data.announcement, ...announcements]);
      }
    } catch (err) {
      const item = {
        id: Date.now(),
        title: newAnnouncement.title || 'تنويه إداري',
        content: newAnnouncement.content,
        date: new Date().toLocaleDateString('ar-EG'),
      };
      const updated = [item, ...announcements];
      setAnnouncements(updated);
      localStorage.setItem('ssa_announcements', JSON.stringify(updated));
    }

    setNewAnnouncement({ title: '', content: '', isPinned: true });
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API_BASE}/admin/announcements/${id}`);
    } catch (e) {}
    const updated = announcements.filter((a) => (a._id || a.id) !== id);
    setAnnouncements(updated);
    localStorage.setItem('ssa_announcements', JSON.stringify(updated));
  };

  // تصفية نتائج البحث
  const filteredPending = pendingUsers.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId?.includes(searchTerm) ||
      u.phone?.includes(searchTerm) ||
      u.cairoAddress?.includes(searchTerm)
  );

  const filteredApproved = approvedUsers.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId?.includes(searchTerm) ||
      u.phone?.includes(searchTerm) ||
      u.cairoAddress?.includes(searchTerm)
  );

  const filteredRejected = rejectedUsers.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId?.includes(searchTerm) ||
      u.phone?.includes(searchTerm) ||
      u.cairoAddress?.includes(searchTerm)
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 20px', paddingBottom: '70px', direction: 'rtl' }}>
      
      {/* هيدر لوحة الإدارة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b1622',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 style={{ color: activeTheme.textMain, fontSize: '24px', fontWeight: '900', margin: 0 }}>
                لوحة الإدارة والسجل المركزي للأعضاء
              </h1>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: '2px 0 0' }}>
                رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
              </p>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات السريعة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#22c55e',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
            }}
          >
            <Download size={16} />
            <span>تصدير السجل الكامل (CSV)</span>
          </button>
        </div>
      </div>

      {/* كروت الإحصائيات السريعة (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={kpiCardStyle(activeTheme)}>
          <div style={{ color: activeTheme.textMuted, fontSize: '12px', fontWeight: 'bold' }}>طلبات قيد المراجعة</div>
          <div style={{ color: '#eab308', fontSize: '26px', fontWeight: '900', marginTop: '6px' }}>
            {pendingUsers.length}
          </div>
          <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>تحتاج لتدقيق إثبات الهوية</div>
        </div>

        <div style={kpiCardStyle(activeTheme)}>
          <div style={{ color: activeTheme.textMuted, fontSize: '12px', fontWeight: 'bold' }}>الطلاب المعتمدون</div>
          <div style={{ color: '#22c55e', fontSize: '26px', fontWeight: '900', marginTop: '6px' }}>
            {approvedUsers.length}
          </div>
          <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>حسابات موثقة بالرابطة</div>
        </div>

        <div style={kpiCardStyle(activeTheme)}>
          <div style={{ color: activeTheme.textMuted, fontSize: '12px', fontWeight: 'bold' }}>الحسابات المرفوضة</div>
          <div style={{ color: '#ef4444', fontSize: '26px', fontWeight: '900', marginTop: '6px' }}>
            {rejectedUsers.length}
          </div>
          <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>محظورة من الدخول</div>
        </div>

        <div style={kpiCardStyle(activeTheme)}>
          <div style={{ color: activeTheme.textMuted, fontSize: '12px', fontWeight: 'bold' }}>أعضاء الإدارة (الأدمنز)</div>
          <div style={{ color: '#60a5fa', fontSize: '26px', fontWeight: '900', marginTop: '6px' }}>
            {approvedUsers.filter((u) => u.role === 'admin').length + 1}
          </div>
          <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>بصلاحيات الإشراف والترقية</div>
        </div>
      </div>

      {/* شريط التبويبات والبحث */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        {/* أزرار التبويب */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'pending' ? activeTheme.accent : activeTheme.border}`,
              background: activeTab === 'pending' ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
              color: activeTab === 'pending' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            }}
          >
            <Clock size={16} />
            <span>طلبات التسجيل والاستبيان ({pendingUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'approved' ? activeTheme.accent : activeTheme.border}`,
              background: activeTab === 'approved' ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
              color: activeTab === 'approved' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            }}
          >
            <UserCheck size={16} />
            <span>سجل الأعضاء وإدارة الأدمن ({approvedUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'rejected' ? '#ef4444' : activeTheme.border}`,
              background: activeTab === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.25)',
              color: activeTab === 'rejected' ? '#ef4444' : activeTheme.textMuted,
            }}
          >
            <ShieldX size={16} />
            <span>الحسابات المرفوضة ({rejectedUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'themes' ? activeTheme.accent : activeTheme.border}`,
              background: activeTab === 'themes' ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
              color: activeTab === 'themes' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            }}
          >
            <Palette size={16} />
            <span>إعدادات المظهر والثيمات (Admin Only)</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'announcements' ? activeTheme.accent : activeTheme.border}`,
              background: activeTab === 'announcements' ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
              color: activeTab === 'announcements' && !activeTheme.isDark ? '#0b1622' : '#ffffff',
            }}
          >
            <Megaphone size={16} />
            <span>شريط الأخبار والإعلانات</span>
          </button>
        </div>

        {/* حقل البحث */}
        {activeTab !== 'announcements' && activeTab !== 'themes' && (
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '100%', minWidth: 'min(100%, 240px)' }}>
            <input
              type="text"
              placeholder="بحث بالاسم، البريد، الهاتف، السكن أو القيد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 14px',
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
        )}
      </div>

      {/* 1. تبويب طلبات التسجيل المعلقة واستبيان الهوية */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPending.length === 0 ? (
            <div style={emptyCardStyle(activeTheme)}>
              <Clock size={40} color={activeTheme.accentLight} style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>لا توجد طلبات تسجيل معلقة حالياً</div>
              <div style={{ fontSize: '13px', color: activeTheme.textMuted, marginTop: '4px' }}>
                جميع استمارات الطلاب مسجلة ومعتمدة بالسجل المركزي
              </div>
            </div>
          ) : (
            filteredPending.map((student) => (
              <div key={student._id || student.id} style={studentCardStyle(activeTheme)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  {/* رأس الكارت */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ color: activeTheme.textMain, fontSize: '17px', fontWeight: '900', margin: 0 }}>
                        {student.fullName || student.name}
                      </h3>
                      <span style={{
                        background: 'rgba(234, 179, 8, 0.15)', color: '#eab308',
                        border: '1px solid rgba(234, 179, 8, 0.4)', fontSize: '11px',
                        padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold'
                      }}>
                        قيد المراجعة والتدقيق
                      </span>
                    </div>

                    <div style={{ color: activeTheme.accentLight, fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
                      🏛️ {student.department} • {student.academicLevel || student.academicYear}
                    </div>
                  </div>

                  {/* أزرار القرار */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {student.idDocument && (
                      <button
                        onClick={() => setPreviewDoc(student.idDocument)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid #3b82f6',
                          color: '#60a5fa',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={15} />
                        <span>معاينة إثبات الهوية</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleApprove(student)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#22c55e',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <Check size={16} />
                      <span>قبول واعتماد الطالب</span>
                    </button>

                    <button
                      onClick={() => handleReject(student._id || student.id, student.email)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '9px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} />
                      <span>رفض</span>
                    </button>
                  </div>
                </div>

                {/* تفاصيل الاستبيان الكاملة */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    marginTop: '16px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.25)',
                    border: `1px solid ${activeTheme.border}`,
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>📧 البريد الإلكتروني: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>📱 هاتف التواصل: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>💬 رقم الواتساب: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.whatsapp || student.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>🎂 العمر: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.age ? `${student.age} سنة` : 'غير محدد'}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>🎓 الرقم الأكاديمي / القيد: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.studentId}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: activeTheme.textMuted }}>📍 عنوان السكن بمصر: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.cairoAddress}</strong>
                  </div>
                  {(student.emergencyContactName || student.emergencyContactPhone) && (
                    <div style={{ gridColumn: 'span 2', paddingTop: '6px', borderTop: `1px dashed ${activeTheme.border}` }}>
                      <span style={{ color: activeTheme.textMuted }}>🚨 جهة اتصال الطوارئ: </span>
                      <strong style={{ color: '#f87171' }}>
                        {student.emergencyContactName} ({student.emergencyContactRelation || 'صلة قرابة'}) - هاتف: {student.emergencyContactPhone}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. تبويب الطلاب المقبولين وإدارة الأدمن التفاعلية (WhatsApp Group Admin Logic) */}
      {activeTab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredApproved.length === 0 ? (
            <div style={emptyCardStyle(activeTheme)}>
              <Users size={40} color={activeTheme.accentLight} style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>لا يوجد طلاب مقبولون مطابقون للبحث</div>
            </div>
          ) : (
            filteredApproved.map((student) => {
              const isAdmin = student.role === 'admin';
              return (
                <div key={student._id || student.id} style={studentCardStyle(activeTheme)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {/* بيانات العضو */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: '900', margin: 0 }}>
                          {student.fullName || student.name}
                        </h3>

                        {/* شارة الرتبة */}
                        {isAdmin ? (
                          <span style={{
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
                            color: '#fbbf24',
                            border: '1px solid #f59e0b',
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ShieldCheck size={13} />
                            <span>أدمن / عضو إدارة</span>
                          </span>
                        ) : (
                          <span style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                            border: '1px solid #22c55e',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 'bold'
                          }}>
                            طالب معتمد
                          </span>
                        )}
                      </div>

                      <div style={{ color: activeTheme.textMuted, fontSize: '12px', display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                        <span>📧 {student.email}</span>
                        <span>📱 {student.phone}</span>
                        <span>🎓 قيد: {student.studentId}</span>
                        <span>🏛️ {student.department}</span>
                        <span>📍 {student.cairoAddress}</span>
                      </div>
                    </div>

                    {/* أزرار الإدارة وتعيين الأدمن */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* زر ترقية / عزل الأدمن التفاعلي */}
                      <button
                        onClick={() => handleToggleAdminRole(student)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          border: `1px solid ${isAdmin ? '#ef4444' : '#f59e0b'}`,
                          color: isAdmin ? '#f87171' : '#fbbf24',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isAdmin ? (
                          <>
                            <ShieldX size={15} />
                            <span>إزالة الأدمن (تنزيل لعضو)</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={15} />
                            <span>تعيين كأدمن (منح الصلاحيات)</span>
                          </>
                        )}
                      </button>

                      {/* زر إلغاء الاعتماد والحذف */}
                      <button
                        onClick={() => handleReject(student._id || student.id, student.email)}
                        title="رفض الحساب وحظر الدخول"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: `1px solid rgba(239, 68, 68, 0.3)`,
                          color: '#ef4444',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        <X size={14} />
                        <span>رفض</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 3. تبويب الحسابات المرفوضة وإعادة القبول (Rejected Accounts & Re-Approval) */}
      {activeTab === 'rejected' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredRejected.length === 0 ? (
            <div style={emptyCardStyle(activeTheme)}>
              <ShieldX size={40} color="#ef4444" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>لا توجد حسابات مرفوضة حالياً</div>
              <div style={{ fontSize: '13px', color: activeTheme.textMuted, marginTop: '4px' }}>
                جميع الحسابات إما معتمدة بالسجل المركزي أو قيد المراجعة والتدقيق
              </div>
            </div>
          ) : (
            filteredRejected.map((student) => (
              <div
                key={student._id || student.id}
                style={{
                  ...studentCardStyle(activeTheme),
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  {/* رأس الكارت */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ color: activeTheme.textMain, fontSize: '17px', fontWeight: '900', margin: 0 }}>
                        {student.fullName || student.name}
                      </h3>
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '11px',
                        padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        <ShieldX size={12} />
                        <span>مرفوض ومحظور من الدخول</span>
                      </span>
                    </div>

                    <div style={{ color: activeTheme.textMuted, fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
                      🏛️ {student.department} • {student.academicLevel || student.academicYear}
                    </div>
                  </div>

                  {/* أزرار الإجراءات وإعادة القبول */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {student.idDocument && (
                      <button
                        onClick={() => setPreviewDoc(student.idDocument)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid #3b82f6',
                          color: '#60a5fa',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={15} />
                        <span>معاينة إثبات الهوية</span>
                      </button>
                    )}

                    {/* زر إعادة القبول المباشر */}
                    <button
                      onClick={() => handleApprove(student)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                      }}
                    >
                      <UserCheck size={16} />
                      <span>إعادة القبول (Re-Approve)</span>
                    </button>

                    <button
                      onClick={() => handleDeleteRejected(student._id || student.id)}
                      title="حذف السجل نهائياً"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${activeTheme.border}`,
                        color: activeTheme.textMuted,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <Trash2 size={15} />
                      <span>حذف نهائي</span>
                    </button>
                  </div>
                </div>

                {/* تفاصيل الاستبيان الكاملة */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    marginTop: '16px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.25)',
                    border: `1px solid ${activeTheme.border}`,
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>📧 البريد الإلكتروني: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>📱 هاتف التواصل: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>💬 رقم الواتساب: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.whatsapp || student.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>🎂 العمر: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.age ? `${student.age} سنة` : 'غير محدد'}</strong>
                  </div>
                  <div>
                    <span style={{ color: activeTheme.textMuted }}>🎓 الرقم الأكاديمي / القيد: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.studentId}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: activeTheme.textMuted }}>📍 عنوان السكن بمصر: </span>
                    <strong style={{ color: activeTheme.textMain }}>{student.cairoAddress}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. تبويب إعدادات المظهر والثيمات المخصص للأدمن فقط (Theme & Color Customization) */}
      {activeTab === 'themes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={studentCardStyle(activeTheme)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Palette size={24} color={activeTheme.accentLight} />
              <div>
                <h3 style={{ color: activeTheme.textMain, fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                  إدارة المظهر والألوان الرسمية للبوابة (Admin-Exclusive Theme Settings)
                </h3>
                <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: '4px 0 0' }}>
                  اختر مظهر وألوان المنصة؛ سيتم تطبيق التغيير فورياً على كافة صفحات البوابة لجميع الطلاب والزوار وحفظ التفضيل عالمياً.
                </p>
              </div>
            </div>

            {themeSuccessMsg && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#22c55e',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{themeSuccessMsg}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {Object.values(availableThemes).map((preset) => {
                const isActive = currentThemeKey === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectTheme(preset.id)}
                    style={{
                      background: preset.bgCard,
                      border: `2px solid ${isActive ? preset.primary : preset.border}`,
                      borderRadius: '16px',
                      padding: '20px',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isActive ? `0 10px 30px ${preset.primary}40` : '0 4px 15px rgba(0,0,0,0.15)',
                      transition: 'all 0.25s ease',
                      transform: isActive ? 'scale(1.02)' : 'none',
                    }}
                  >
                    {/* شارة النشاط */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: preset.primary,
                          color: preset.isDark ? '#ffffff' : '#0b1622',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={13} />
                        <span>المظهر النشط حالياً</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '18px' }}>{preset.badge.split(' ')[0]}</span>
                      <div>
                        <h4 style={{ color: preset.textMain, fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
                          {preset.name}
                        </h4>
                        <span style={{ color: preset.accentLight, fontSize: '11px', fontWeight: '600' }}>
                          {preset.tag}
                        </span>
                      </div>
                    </div>

                    {/* ألوان المظهر الدائرية */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.primary, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} title="اللون الأساسي (Primary)" />
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.secondary, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} title="اللون الثانوي (Secondary)" />
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.accent, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} title="اللون المميز (Accent)" />
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.bgDark, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} title="خلفية الصفحة (Background)" />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTheme(preset.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        background: isActive ? preset.primary : 'rgba(255, 255, 255, 0.08)',
                        color: isActive && !preset.isDark ? '#0b1622' : '#ffffff',
                        border: `1px solid ${isActive ? preset.primary : preset.border}`,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '10px',
                      }}
                    >
                      {isActive ? <Check size={14} /> : <Palette size={14} />}
                      <span>{isActive ? 'المظهر المفعل' : 'تطبيق هذا المظهر للبوابة'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. تبويب شريط الأخبار والإعلانات */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* فورم إضافة إعلان جديد */}
          <div style={studentCardStyle(activeTheme)}>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color={activeTheme.accentLight} />
              <span>إضافة خبر أو تنويه لشريط الأخبار العاجلة المتحرك</span>
            </h3>

            <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  عنوان التنويه (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: موعد تسليم تقارير المعامل..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  style={inputStyle(activeTheme)}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  نص الإعلان الذي سيظهر في الشريط المتحرك *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب التنويه هنا..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  style={inputStyle(activeTheme)}
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: activeTheme.primary,
                  color: !activeTheme.isDark ? '#0b1622' : '#ffffff',
                  border: `1px solid ${activeTheme.accent}`,
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Megaphone size={16} />
                <span>نشر في شريط الأخبار</span>
              </button>
            </form>
          </div>

          {/* قائمة الإعلانات الحالية */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: activeTheme.textMain, fontSize: '15px', fontWeight: 'bold', margin: '10px 0 0' }}>
              الإعلانات النشطة حالياً:
            </h3>

            {announcements.map((ann) => (
              <div
                key={ann._id || ann.id}
                style={{
                  background: activeTheme.bgCard,
                  border: `1px solid ${activeTheme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div>
                  {ann.title && <strong style={{ color: activeTheme.accentLight, display: 'block', marginBottom: '4px' }}>{ann.title}</strong>}
                  <p style={{ color: activeTheme.textMain, fontSize: '13px', margin: 0 }}>{ann.content}</p>
                </div>

                <button
                  onClick={() => handleDeleteAnnouncement(ann._id || ann.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نافذة معاينة وثيقة الهوية (Modal) */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${activeTheme.border}`, paddingBottom: '12px' }}>
              <h3 style={{ color: activeTheme.textMain, fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color={activeTheme.accentLight} />
                <span>معاينة وثيقة إثبات الهوية (جواز السفر / البطاقة)</span>
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'transparent', border: 'none', color: activeTheme.textMuted, cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              {previewDoc.startsWith('data:image') || previewDoc.startsWith('http') ? (
                <img
                  src={previewDoc}
                  alt="وثيقة الهوية"
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '12px', border: `1px solid ${activeTheme.border}` }}
                />
              ) : (
                <div style={{ padding: '30px', color: activeTheme.textMain }}>
                  <FileText size={48} color={activeTheme.accentLight} style={{ marginBottom: '12px' }} />
                  <p>الملف المرفق هو مستند PDF أو مستند نصي.</p>
                  <a
                    href={previewDoc}
                    download="student_id_document"
                    style={{
                      display: 'inline-block',
                      background: activeTheme.primary,
                      color: !activeTheme.isDark ? '#0b1622' : '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      marginTop: '10px',
                    }}
                  >
                    تنزيل المستند لفتحه
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const kpiCardStyle = (theme) => ({
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
});

const studentCardStyle = (theme) => ({
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
});

const emptyCardStyle = (theme) => ({
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
  borderRadius: '16px',
  padding: '50px 20px',
  textAlign: 'center',
  color: theme.textMain,
});

const inputStyle = (theme) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.textMain,
  outline: 'none',
  fontSize: '13px',
  boxSizing: 'border-box',
  direction: 'rtl',
});