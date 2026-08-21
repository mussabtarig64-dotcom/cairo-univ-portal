import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

import { API_BASE } from '../config/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser') || localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // مزامنة دورية وحفظ بيانات المستخدم
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user');
    }
  }, [user]);

  // فحص مباشر للحالة من قاعدة البيانات المركزية عند تحميل التطبيق أو وجود مستخدم مسجل
  useEffect(() => {
    if (!user || !user.email || user.email === 'admin@ssa.com') return;

    let isMounted = true;
    const checkLiveStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/status/${encodeURIComponent(user.email)}`);
        if (res.data && res.data.success && isMounted) {
          const isUserRejected =
            res.data.isRejected ||
            res.data.verificationStatus === 'rejected' ||
            res.data.status === 'rejected';

          if (isUserRejected && user.role !== 'admin') {
            setUser(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('user');

            try {
              const rejectedUsers = JSON.parse(localStorage.getItem('rejected_users') || '[]');
              const cleanRejected = rejectedUsers.filter((u) => u.email?.toLowerCase() !== user.email.toLowerCase());
              localStorage.setItem(
                'rejected_users',
                JSON.stringify([...cleanRejected, { ...user, verificationStatus: 'rejected', status: 'rejected' }])
              );
            } catch (e) {}
            return;
          }

          const isApproved =
            res.data.verificationStatus === 'verified' ||
            res.data.verificationStatus === 'approved' ||
            res.data.status === 'approved';

          if (isApproved && (user.verificationStatus !== 'verified' || user.status !== 'approved')) {
            const updatedUser = {
              ...user,
              verificationStatus: 'verified',
              status: 'approved',
              role: res.data.role || user.role || 'user',
            };
            setUser(updatedUser);

            // تنظيف التخزين المحلي فوراً
            try {
              const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
              const cleanPending = pendingUsers.filter((u) => u.email?.toLowerCase() !== user.email.toLowerCase());
              localStorage.setItem('pending_users', JSON.stringify(cleanPending));

              const rejectedUsers = JSON.parse(localStorage.getItem('rejected_users') || '[]');
              const cleanRejected = rejectedUsers.filter((u) => u.email?.toLowerCase() !== user.email.toLowerCase());
              localStorage.setItem('rejected_users', JSON.stringify(cleanRejected));

              const approvedUsers = JSON.parse(localStorage.getItem('approved_users') || '[]');
              const filtered = approvedUsers.filter((u) => u.email?.toLowerCase() !== user.email.toLowerCase());
              localStorage.setItem('approved_users', JSON.stringify([...filtered, updatedUser]));
            } catch (e) {}
          }
        }
      } catch (err) {
        // فحص في التخزين المحلي كبديل
        try {
          const rejectedUsers = JSON.parse(localStorage.getItem('rejected_users') || '[]');
          const localRejected = rejectedUsers.find((u) => u.email?.toLowerCase() === user.email.toLowerCase());
          if (localRejected && user.role !== 'admin' && isMounted) {
            setUser(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('user');
            return;
          }

          const approvedUsers = JSON.parse(localStorage.getItem('approved_users') || '[]');
          const localApproved = approvedUsers.find((u) => u.email?.toLowerCase() === user.email.toLowerCase());
          if (localApproved && isMounted && (user.verificationStatus !== 'verified' || user.status !== 'approved')) {
            setUser({
              ...user,
              verificationStatus: 'verified',
              status: 'approved',
              role: localApproved.role || user.role || 'user',
            });
          }
        } catch (e) {}
      }
    };

    checkLiveStatus();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // 1. تسجيل طالب جديد
  const register = async (surveyData) => {
    const studentUser = {
      ...surveyData,
      id: surveyData.id || `local_${Date.now()}`,
      role: 'user',
      verificationStatus: 'pending',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // حفظ في طابور الانتظار المحلي
    try {
      const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      const filtered = pendingUsers.filter((u) => u.email?.toLowerCase() !== surveyData.email?.toLowerCase());
      localStorage.setItem('pending_users', JSON.stringify([...filtered, studentUser]));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    // محاولة الإرسال للـ API
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, surveyData);
      return { success: true, user: res.data.user || studentUser, message: res.data.message };
    } catch (err) {
      console.log('Server registration note:', err.message);
      return {
        success: true,
        user: studentUser,
        message: 'تم استلام استمارة التسجيل بنجاح وهي قيد المراجعة الإدارية.',
      };
    }
  };

  // 2. تسجيل الدخول والتحقق الديناميكي المباشر من قاعدة البيانات المركزية
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. فحص حساب الأدمن الأساسي المباشر
    if (
      (cleanEmail === 'mussab@gmail.com' && cleanPassword === '123456789') ||
      (cleanEmail === 'admin@ssa.com' && cleanPassword === 'admin123')
    ) {
      const isMussab = cleanEmail === 'mussab@gmail.com';
      const adminUser = {
        _id: isMussab ? 'admin_mussab_id' : 'admin_master_id',
        id: isMussab ? 'admin_mussab_id' : 'admin_master_id',
        fullName: isMussab ? 'مصعب طارق (المدير العام)' : 'المكتب التنفيذي للرابطة (المدير العام)',
        name: isMussab ? 'مصعب طارق (المدير العام)' : 'المكتب التنفيذي',
        email: cleanEmail,
        role: 'admin',
        verificationStatus: 'verified',
        status: 'approved',
        department: 'إدارة الرابطة',
      };

      try {
        const res = await axios.post(`${API_BASE}/auth/login`, { email: cleanEmail, password: cleanPassword });
        if (res.data?.success && res.data?.user) {
          const finalUser = {
            ...adminUser,
            ...res.data.user,
            role: 'admin',
            verificationStatus: 'verified',
            status: 'approved',
          };
          setUser(finalUser);
          return { success: true, user: finalUser };
        }
      } catch (err) {
        console.log('Server admin sync note, proceeding with master admin credentials:', err?.message);
      }

      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // 2. محاولة تسجيل الدخول عبر خادم وقاعدة بيانات MongoDB المركزية
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email: cleanEmail, password: cleanPassword });
      if (res.data && res.data.success && res.data.user) {
        let loggedUser = res.data.user;

        // التحقق من حالة الرفض
        if (
          (loggedUser.verificationStatus === 'rejected' || loggedUser.status === 'rejected') &&
          loggedUser.role !== 'admin'
        ) {
          return {
            success: false,
            isRejected: true,
            message: 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
          };
        }

        // ضبط وتطبيع الاسم
        loggedUser.name = loggedUser.name || loggedUser.fullName || 'طالب كلية العلوم';
        loggedUser.fullName = loggedUser.fullName || loggedUser.name;

        // التحقق مما إذا كان الطالب قد تم ترقيته إلى أدمن محلياً أو في قاعدة البيانات
        const approvedLocal = JSON.parse(localStorage.getItem('approved_users') || '[]');
        const localMatch = approvedLocal.find((u) => u.email?.toLowerCase() === cleanEmail);
        const adminLocal = JSON.parse(localStorage.getItem('admin_users') || '[]');
        const adminMatch = adminLocal.find((u) => u.email?.toLowerCase() === cleanEmail);

        if (loggedUser.role === 'admin' || (localMatch && localMatch.role === 'admin') || adminMatch) {
          loggedUser.role = 'admin';
          loggedUser.verificationStatus = 'verified';
          loggedUser.status = 'approved';
        }

        // فحص حالة الاعتماد
        const isApproved =
          loggedUser.verificationStatus === 'verified' ||
          loggedUser.verificationStatus === 'approved' ||
          loggedUser.status === 'approved' ||
          (localMatch && (localMatch.verificationStatus === 'verified' || localMatch.status === 'approved'));

        if (isApproved) {
          loggedUser.verificationStatus = 'verified';
          loggedUser.status = 'approved';

          // تنظيف أي بيانات معلقة أو مرفوضة قديمة للمستخدم المعتمد
          try {
            const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
            const cleanPending = pendingUsers.filter((u) => u.email?.toLowerCase() !== cleanEmail);
            localStorage.setItem('pending_users', JSON.stringify(cleanPending));

            const rejectedUsers = JSON.parse(localStorage.getItem('rejected_users') || '[]');
            const cleanRejected = rejectedUsers.filter((u) => u.email?.toLowerCase() !== cleanEmail);
            localStorage.setItem('rejected_users', JSON.stringify(cleanRejected));

            const filteredApproved = approvedLocal.filter((u) => u.email?.toLowerCase() !== cleanEmail);
            localStorage.setItem('approved_users', JSON.stringify([...filteredApproved, loggedUser]));
          } catch (e) {}

          setUser(loggedUser);
          return { success: true, user: loggedUser };
        } else {
          // حساب لا يزال معلقاً
          setUser(loggedUser);
          return {
            success: false,
            isPending: true,
            user: loggedUser,
            message: 'طلب قيدك لا يزال قيد المراجعة والتدقيق بواسطة إدارة الرابطة.',
          };
        }
      }
    } catch (err) {
      if (err.response?.data?.isRejected) {
        return {
          success: false,
          isRejected: true,
          message:
            err.response.data.message ||
            'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
        };
      }
      console.log('API Login note, checking local storage:', err.message);
    }

    // 3. التحقق المحلي في localStorage في حال عدم الاتصال بالسيرفر
    // فحص ما إذا كان الحساب مرفوضاً محلياً
    const rejectedUsers = JSON.parse(localStorage.getItem('rejected_users') || '[]');
    const rejectedFound = rejectedUsers.find(
      (u) => u.email?.trim().toLowerCase() === cleanEmail && (u.password === cleanPassword || !u.password)
    );
    if (rejectedFound && rejectedFound.role !== 'admin') {
      return {
        success: false,
        isRejected: true,
        message: 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
      };
    }

    const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const adminFound = adminUsers.find(
      (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password === cleanPassword
    );
    if (adminFound) {
      const u = {
        ...adminFound,
        name: adminFound.name || adminFound.fullName,
        fullName: adminFound.fullName || adminFound.name,
        role: 'admin',
        verificationStatus: 'verified',
        status: 'approved',
      };
      setUser(u);
      return { success: true, user: u };
    }

    const approvedUsers = JSON.parse(localStorage.getItem('approved_users') || '[]');
    const approvedFound = approvedUsers.find(
      (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password === cleanPassword
    );
    if (approvedFound) {
      const userRole = approvedFound.role === 'admin' ? 'admin' : 'user';
      const u = {
        ...approvedFound,
        name: approvedFound.name || approvedFound.fullName,
        fullName: approvedFound.fullName || approvedFound.name,
        role: userRole,
        verificationStatus: 'verified',
        status: 'approved',
      };

      // إزالة من المعلقين والمرفوضين إن وجد
      try {
        const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
        const cleanPending = pendingUsers.filter((p) => p.email?.toLowerCase() !== cleanEmail);
        localStorage.setItem('pending_users', JSON.stringify(cleanPending));

        const cleanRejected = rejectedUsers.filter((r) => r.email?.toLowerCase() !== cleanEmail);
        localStorage.setItem('rejected_users', JSON.stringify(cleanRejected));
      } catch (e) {}

      setUser(u);
      return { success: true, user: u };
    }

    const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const pendingFound = pendingUsers.find(
      (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password === cleanPassword
    );
    if (pendingFound) {
      return {
        success: false,
        isPending: true,
        message: 'طلب قيدك لا يزال قيد المراجعة والتدقيق بواسطة إدارة الرابطة.',
      };
    }

    return {
      success: false,
      message: 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني وكلمة المرور.',
    };
  };

  // 3. ترقية أو عزل الأدمن وتحديث الرتبة ديناميكياً
  const updateUserRole = (userId, newRole) => {
    // تحديث المستخدم الحالي إذا كان هو المعني
    if (user && (user._id === userId || user.id === userId || user.email === userId)) {
      const updatedCurrentUser = { ...user, role: newRole };
      setUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
    }

    // تحديث في قائمة الطلاب المعتمدين محلياً
    try {
      const approvedUsers = JSON.parse(localStorage.getItem('approved_users') || '[]');
      const updated = approvedUsers.map((u) => {
        if (u._id === userId || u.id === userId || u.email === userId) {
          return { ...u, role: newRole };
        }
        return u;
      });
      localStorage.setItem('approved_users', JSON.stringify(updated));

      // إذا كانت ترقية إلى أدمن نضيفه أيضاً في admin_users لضمان الدخول السريع
      if (newRole === 'admin') {
        const target = approvedUsers.find((u) => u._id === userId || u.id === userId || u.email === userId);
        if (target) {
          const admins = JSON.parse(localStorage.getItem('admin_users') || '[]');
          const filteredAdmins = admins.filter((a) => a.email?.toLowerCase() !== target.email?.toLowerCase());
          localStorage.setItem('admin_users', JSON.stringify([...filteredAdmins, { ...target, role: 'admin' }]));
        }
      } else {
        const target = approvedUsers.find((u) => u._id === userId || u.id === userId || u.email === userId);
        if (target) {
          const admins = JSON.parse(localStorage.getItem('admin_users') || '[]');
          const filteredAdmins = admins.filter((a) => a.email?.toLowerCase() !== target.email?.toLowerCase());
          localStorage.setItem('admin_users', JSON.stringify(filteredAdmins));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // إرسال للخادم
    axios.patch(`${API_BASE}/admin/students/${userId}/role`, { role: newRole }).catch(() => {});
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';
  const isApproved =
    user?.verificationStatus === 'verified' ||
    user?.verificationStatus === 'approved' ||
    user?.status === 'approved' ||
    isAdmin;

  const isPending = !isApproved && (user?.verificationStatus === 'pending' || user?.status === 'pending');
  const isVerified = isApproved;

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isAdmin,
    isPending,
    isVerified,
    register,
    login,
    logout,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);