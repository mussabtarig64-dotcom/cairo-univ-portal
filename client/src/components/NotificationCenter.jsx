import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_BASE, SOCKET_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  BellRing,
  CheckCheck,
  Megaphone,
  FileText,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

export default function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [webPushEnabled, setWebPushEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [toastNotif, setToastNotif] = useState(null);
  const dropdownRef = useRef(null);

  const userEmail = user?.email || localStorage.getItem('ssa_guest_email') || 'visitor';

  // 1. جلب الإشعارات الأولية
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications`);
      if (res.data && res.data.notifications) {
        const notifs = res.data.notifications;
        setNotifications(notifs);
        const unread = notifs.filter((n) => !n.readBy || !n.readBy.includes(userEmail)).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      console.log('Notifications load note:', e.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // إعداد الاتصال بالـ Socket.IO لتلقي الإشعارات الفورية
    const socket = io(SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socket.on('new_notification', (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // إظهار Toast داخلي سلس وراقي
      setToastNotif(newNotif);
      setTimeout(() => setToastNotif(null), 6500);

      // إطلاق إشعار المتصفح الخارجي إذا كانت الصلاحية ممنوحة
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(newNotif.title, {
            body: newNotif.message,
            icon: '/logo.png',
            badge: '/logo.png',
            tag: newNotif._id || 'ssa-notif',
          });
        } catch (err) {
          console.log('Browser notification note:', err);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userEmail]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // طلب صلاحية إشعارات المتصفح (Web Push Permission)
  const enableBrowserPush = async () => {
    if (!('Notification' in window)) {
      alert('المتصفح الحالي لا يدعم إشعارات الويب (Push Notifications).');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setWebPushEnabled(true);
        new Notification('رابطة الطلاب السودانيين - كلية العلوم', {
          body: 'تم تفعيل الإشعارات الفورية بنجاح! ستصلك أحدث الإعلانات والمنشورات فور نشرها 🔔',
          icon: '/logo.png',
        });
      }
    } catch (e) {
      console.log('Permission error:', e);
    }
  };

  // تحديد كل الإشعارات كمقروءة
  const handleMarkAllRead = async () => {
    try {
      await axios.post(`${API_BASE}/notifications/mark-all-read`, { userEmail });
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          readBy: n.readBy ? [...n.readBy, userEmail] : [userEmail],
        }))
      );
      setUnreadCount(0);
    } catch (e) {
      console.log('Mark all read error:', e.message);
    }
  };

  // النقر على إشعار محدد
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.readBy || !notif.readBy.includes(userEmail)) {
        await axios.post(`${API_BASE}/notifications/${notif._id}/read`, { userEmail });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, readBy: [...(n.readBy || []), userEmail] } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {}

    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={16} className="text-red-400" />;
      case 'announcement':
        return <Megaphone size={16} className="text-amber-400" />;
      case 'post':
        return <FileText size={16} className="text-sky-400" />;
      case 'academic':
        return <GraduationCap size={16} className="text-emerald-400" />;
      case 'event':
        return <Calendar size={16} className="text-purple-400" />;
      default:
        return <Sparkles size={16} className="text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      {/* Toast Popup عند وصول إشعار جديد - متناسق على الموبايل والديسكتوب */}
      {toastNotif && (
        <div
          className="fixed top-16 left-3 right-3 sm:right-auto sm:left-4 sm:w-96 max-w-[calc(100vw-24px)] z-50 bg-slate-900/95 border-2 border-amber-500/70 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 transform translate-y-0"
          style={{ boxShadow: '0 12px 36px rgba(245, 158, 11, 0.25)' }}
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <BellRing size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-amber-400 mb-0.5 flex items-center gap-1">
                  <span>إشعار فوري جديد</span>
                  <span>🔔</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1 truncate">{toastNotif.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{toastNotif.message}</p>
              </div>
            </div>
            <button
              onClick={() => setToastNotif(null)}
              aria-label="إغلاق التنبيه"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* زر الجرس الرئيسي في الـ Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="مركز الإشعارات الفورية"
        title="مركز الإشعارات الفورية"
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-amber-400 transition-all flex items-center justify-center cursor-pointer active:scale-95"
      >
        {unreadCount > 0 ? (
          <BellRing size={18} className="text-amber-400 animate-pulse" />
        ) : (
          <Bell size={18} />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-[10.5px] rounded-full flex items-center justify-center shadow-lg border border-slate-900 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* القائمة المنسدلة لمركز الإشعارات - معالجة العرض لتفادي أي Overflow */}
      {isOpen && (
        <div
          className="absolute left-0 sm:left-0 sm:right-auto top-full mt-3 w-[calc(100vw-28px)] sm:w-96 max-w-sm max-h-[85vh] bg-slate-900/98 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 flex flex-col overflow-hidden text-right"
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            transform: 'translateX(0)',
          }}
        >
          {/* Header */}
          <div className="p-3.5 px-4 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Bell size={16} />
              </div>
              <h3 className="font-bold text-sm text-white">الإشعارات والتنبيهات</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck size={13} />
                <span>قراءة الكل</span>
              </button>
            )}
          </div>

          {/* Browser Push Notice banner */}
          {!webPushEnabled && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2 text-xs">
              <div className="text-amber-300 text-[11.5px] leading-snug">
                <span>فعّل إشعارات الجهاز لاستقبال التنبيهات 🔔</span>
              </div>
              <button
                onClick={enableBrowserPush}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                تفعيل الآن
              </button>
            </div>
          )}

          {/* List of Notifications */}
          <div className="overflow-y-auto divide-y divide-white/5 flex-1 max-h-[360px] sm:max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bell size={32} className="mx-auto mb-2 text-slate-600 opacity-60" />
                <p>لا توجد إشعارات جديدة حتى الآن</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isRead = notif.readBy && notif.readBy.includes(userEmail);
                return (
                  <div
                    key={notif._id || Math.random()}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3 ${
                      !isRead ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                      {getNotifIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4
                          className={`text-xs font-bold truncate ${
                            !isRead ? 'text-amber-300' : 'text-slate-200'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11.5px] text-slate-300 line-clamp-2 leading-relaxed mb-1.5 break-words">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-400 truncate max-w-[140px]">{notif.sender}</span>
                        <span className="shrink-0">
                          {notif.createdAt
                            ? new Date(notif.createdAt).toLocaleTimeString('ar-EG', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 px-4 bg-slate-950/80 border-t border-white/10 text-center text-xs text-slate-400 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">بث مباشر عبر Socket.IO ⚡</span>
            <Link
              to="/posts"
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1"
            >
              <span>الملتقى والأخبار</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

