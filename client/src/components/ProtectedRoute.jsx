import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. مسار للأدمن فقط
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isPending } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={isPending ? '/pending-approval' : '/'} replace />;
  }

  return children;
}

// 2. مسار للأعضاء والطلاب المعتمدين + الأدمن
export function VerifiedStudentRoute({ children }) {
  const { isAuthenticated, isPending } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isPending) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}

// 3. مسار صفحة انتظار الموافقة
export function PendingOrVerifiedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 4. مسار الزوار غير المسجلين (الدخول والتسجيل)
export function GuestOnlyRoute({ children }) {
  const { isAuthenticated, isPending, isAdmin } = useAuth();

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isPending) return <Navigate to="/pending-approval" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}