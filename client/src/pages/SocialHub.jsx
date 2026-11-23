import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  HandHeart,
  Home,
  HelpCircle,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  X,
  Loader2,
  Check,
  Smartphone,
  Landmark,
  Target,
  Wallet,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';
import { API_BASE } from '../config/api';

// ─── Static fallback data for non-financial CMS sections ───────────────────────
const DEFAULT_VOLUNTEERS = [
  { _id: 'vol-1', name: 'لجنة استقبال الطلاب الجدد بمطار القاهرة والمواقف', description: 'الترحيب، التوجيه، وإجراءات الوصول والإقامة الأولى واستخراج بطاقات الاتصال المصرية.', members: '25 متطوعاً نشطاً', icon: '✈️', section: 'volunteer' },
  { _id: 'vol-2', name: 'فريق الدعم الميداني وحالات الطوارئ', description: 'التدخل السريع في الحالات الصحية والطارئة للطلاب على مدار 24 ساعة والتنسيق مع الأطباء.', members: '18 متطوعاً مسجلاً', icon: '🚑', section: 'volunteer' },
  { _id: 'vol-3', name: 'لجنة تنظيم الفعاليات والملتقيات الكبرى', description: 'إدارة اللوجستيات، المسارح، البروتوكول، وتنظيم المعارض والمناسبات العلمية والثقافية.', members: '30 متطوعاً', icon: '🎪', section: 'volunteer' },
];
const DEFAULT_FAMILIES = [
  { _id: 'fam-1', name: 'أسرة النيلين الطلابية', scope: 'تجمع طلاب الخرطوم والوسط', description: 'ندوات فكرية، رحلات نيلية، وتكافل اجتماعي ومذاكرة جماعية.', lead: 'أحمد البدوي', section: 'families' },
  { _id: 'fam-2', name: 'أسرة التاكا وسواكن', scope: 'تجمع طلاب الشرق والبحر الأحمر', description: 'معارض تراث البجا، دورات تدريبية، ولقاءات ثقافية تكافلية.', lead: 'إدريس محمد', section: 'families' },
  { _id: 'fam-3', name: 'أسرة كرمة والبركل', scope: 'تجمع طلاب الشمالية ونهر النيل', description: 'توثيق التاريخ والحضارات القديمة والمذاكرة الجماعية لطلاب الأقسام.', lead: 'سيف الدين عثمان', section: 'families' },
  { _id: 'fam-4', name: 'أسرة مرة والرمال الذهبية', scope: 'تجمع طلاب كردفان ودارفور', description: 'أمسيات شعرية، بطولات رياضية، ومبادرات العون والمساندة الأخوية.', lead: 'منصور آدم', section: 'families' },
];

// ─── Badge colour helper ────────────────────────────────────────────────────────
function getBadgeStyle(badge) {
  if (badge === 'حالة طارئة')    return { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.35)' };
  if (badge === 'مبادرة موسمية') return { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', border: 'rgba(59,130,246,0.35)' };
  if (badge === 'دعم أكاديمي')   return { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.35)' };
  return                                 { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', border: 'rgba(16,185,129,0.35)' };
}

// ─── Live countdown display component ──────────────────────────────────────────
function CountdownBadge({ expiresAt, now }) {
  const diff = new Date(expiresAt).getTime() - now;
  if (diff <= 0) return (
    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 8px', borderRadius: '20px' }}>
      ⏱ انتهت
    </span>
  );
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const urgent  = diff < 3600000 * 24; // last 24 h
  return (
    <span style={{ fontSize: '11px', color: urgent ? '#f87171' : '#fbbf24', fontWeight: 'bold', background: urgent ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${urgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`, padding: '3px 8px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Clock size={11} />
      {days > 0 ? `${days}ي ` : ''}{String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
    </span>
  );
}

// ─── Payment method copy-button ─────────────────────────────────────────────────
function PaymentCopyBtn({ icon: Icon, label, value, fieldId, copiedField, onCopy, color }) {
  if (!value) return null;
  const copied = copiedField === fieldId;
  return (
    <button
      onClick={() => onCopy(value, fieldId)}
      title={`انسخ رقم ${label}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: '10px', padding: '8px 12px', cursor: 'pointer',
        color: copied ? '#22c55e' : '#e2e8f0', fontSize: '12px', fontWeight: 'bold',
        transition: 'all 0.2s', flex: 1,
      }}
    >
      <Icon size={14} color={copied ? '#22c55e' : color} style={{ flexShrink: 0 }} />
      <div style={{ textAlign: 'right', flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '1px' }}>{label}</div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
      {copied ? <Check size={12} style={{ flexShrink: 0 }} /> : <Copy size={12} style={{ flexShrink: 0, color: '#94a3b8' }} />}
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function SocialHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('solidarity');

  // CMS sections (volunteer / families)
  const [volunteerTeams,  setVolunteerTeams]  = useState([]);
  const [studentFamilies, setStudentFamilies] = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [editingItem,     setEditingItem]     = useState(null);
  const [notification,    setNotification]    = useState('');

  // ── Initiatives / solidarity campaigns state ───────────────────────────────
  const [campaigns,       setCampaigns]       = useState([]);
  const [campaignsLoading,setCampaignsLoading]= useState(false);
  const [showCampaignModal,setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignSaving,  setCampaignSaving]  = useState(false);
  const [copiedField,     setCopiedField]     = useState('');
  const [quickUpdateId,   setQuickUpdateId]   = useState(null);
  const [quickUpdateVal,  setQuickUpdateVal]  = useState('');
  const [quickSaving,     setQuickSaving]     = useState(false);
  const [now,             setNow]             = useState(Date.now());
  const EMPTY_FORM = {
    title: '', badge: 'مبادرة تكافل', description: '', imageUrl: '',
    targetAmount: '', collectedAmount: '0',
    paymentMethods: { instapay: '', vodafoneCash: '', bankak: '' },
    whatsappLink: '', expiresAt: '',
  };
  const [campaignForm, setCampaignForm] = useState(EMPTY_FORM);

  // Live clock for countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auth header helper
  const authHeaders = () => {
    const tk = localStorage.getItem('token') || localStorage.getItem('ssa_token') || '';
    return tk ? { Authorization: `Bearer ${tk}` } : {};
  };

  // ── Fetch campaigns ────────────────────────────────────────────────────────
  const fetchCampaigns = useCallback(async () => {
    try {
      setCampaignsLoading(true);
      const params = isAdmin ? { includeExpired: 'true' } : {};
      const res = await axios.get(`${API_BASE}/initiatives`, { params });
      if (res.data?.success) setCampaigns(res.data.data || []);
    } catch (err) {
      console.error('fetchCampaigns error:', err);
    } finally {
      setCampaignsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  // ── Fetch CMS hub content ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const items = await fetchHubContent('social');
        setVolunteerTeams( (items || []).filter(i => i.section === 'volunteer') );
        setStudentFamilies((items || []).filter(i => i.section === 'families')  );
      } catch (err) {
        console.error('loadDynamic error:', err);
        setVolunteerTeams(DEFAULT_VOLUNTEERS);
        setStudentFamilies(DEFAULT_FAMILIES);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── CMS handlers ──────────────────────────────────────────────────────────
  const handleSaved = (item, action) => {
    const updater = prev =>
      action === 'create' ? [item, ...prev] : prev.map(x => (x._id||x.id) === (item._id||item.id) ? item : x);
    if (item.section === 'volunteer') setVolunteerTeams(updater);
    else                               setStudentFamilies(updater);
    showNotif(action === 'create' ? 'تمت الإضافة بنجاح!' : 'تم التحديث بنجاح!');
  };

  const handleDeleteItem = async (id, section) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
      await deleteHubContent(id, 'social');
      if (section === 'volunteer') setVolunteerTeams(prev => prev.filter(v => (v._id||v.id) !== id));
      else                          setStudentFamilies(prev => prev.filter(f => (f._id||f.id) !== id));
      showNotif('تم الحذف بنجاح.');
    } catch (err) {
      alert('فشل الحذف: ' + (err.message || 'خطأ في الخادم'));
    }
  };

  // ── Notification helper ───────────────────────────────────────────────────
  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // ── Campaign form helpers ─────────────────────────────────────────────────
  const openNewCampaign = () => {
    setEditingCampaign(null);
    setCampaignForm(EMPTY_FORM);
    setShowCampaignModal(true);
  };
  const openEditCampaign = (c) => {
    setEditingCampaign(c);
    setCampaignForm({
      title: c.title || '', badge: c.badge || 'مبادرة تكافل',
      description: c.description || '', imageUrl: c.imageUrl || '',
      targetAmount: String(c.targetAmount ?? ''),
      collectedAmount: String(c.collectedAmount ?? '0'),
      paymentMethods: {
        instapay:     c.paymentMethods?.instapay     || '',
        vodafoneCash: c.paymentMethods?.vodafoneCash || '',
        bankak:       c.paymentMethods?.bankak       || '',
      },
      whatsappLink: c.whatsappLink || '',
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0,16) : '',
    });
    setShowCampaignModal(true);
  };
  const closeCampaignModal = () => {
    setShowCampaignModal(false);
    setEditingCampaign(null);
    setCampaignForm(EMPTY_FORM);
  };

  const handleSaveCampaign = async () => {
    const { title, description, targetAmount, expiresAt } = campaignForm;
    if (!title.trim() || !description.trim() || !targetAmount || !expiresAt) {
      alert('يرجى ملء الحقول المطلوبة: العنوان، الوصف، المبلغ المستهدف، وتاريخ الانتهاء.');
      return;
    }
    setCampaignSaving(true);
    try {
      const payload = {
        ...campaignForm,
        targetAmount:    Number(campaignForm.targetAmount)    || 0,
        collectedAmount: Number(campaignForm.collectedAmount) || 0,
      };
      let res;
      if (editingCampaign) {
        res = await axios.put(`${API_BASE}/initiatives/${editingCampaign._id}`, payload, { headers: authHeaders() });
        if (res.data?.success) setCampaigns(prev => prev.map(c => c._id === editingCampaign._id ? res.data.data : c));
      } else {
        res = await axios.post(`${API_BASE}/initiatives`, payload, { headers: authHeaders() });
        if (res.data?.success) setCampaigns(prev => [res.data.data, ...prev]);
      }
      closeCampaignModal();
      showNotif(editingCampaign ? 'تم تحديث حملة التكافل بنجاح!' : 'تم إنشاء ونشر حملة التكافل بنجاح!');
    } catch (err) {
      alert('فشل حفظ الحملة: ' + (err.response?.data?.message || err.message));
    } finally {
      setCampaignSaving(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الحملة نهائياً؟')) return;
    try {
      await axios.delete(`${API_BASE}/initiatives/${id}`, { headers: authHeaders() });
      setCampaigns(prev => prev.filter(c => c._id !== id));
      showNotif('تم حذف الحملة بنجاح.');
    } catch (err) {
      alert('فشل الحذف: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleQuickUpdate = async (id) => {
    const amount = Number(quickUpdateVal);
    if (isNaN(amount) || amount < 0) { alert('يرجى إدخال مبلغ صحيح.'); return; }
    setQuickSaving(true);
    try {
      const res = await axios.put(`${API_BASE}/initiatives/${id}`, { collectedAmount: amount }, { headers: authHeaders() });
      if (res.data?.success) {
        setCampaigns(prev => prev.map(c => c._id === id ? res.data.data : c));
        setQuickUpdateId(null);
        setQuickUpdateVal('');
        showNotif('تم تحديث المبلغ المجموع بنجاح!');
      }
    } catch (err) {
      alert('فشل التحديث: ' + (err.response?.data?.message || err.message));
    } finally {
      setQuickSaving(false);
    }
  };

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(''), 2000);
  };

  // Active campaigns visible to current user
  const activeCampaigns = campaigns.filter(c => isAdmin || new Date(c.expiresAt).getTime() > now);

  // ── Tabs ─────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'solidarity', label: 'المبادرات والتكافل الاجتماعي', icon: Wallet,         desc: 'حملات الجمع والتكافل المالي' },
    { id: 'volunteer',  label: 'التطوع والخدمة العامة',        icon: HandHeart,       desc: 'لجان العمل الميداني' },
    { id: 'support',    label: 'دعم ومساندة الطلاب',           icon: HelpCircle,      desc: 'السكن، الإعانات، الإرشاد' },
    { id: 'families',   label: 'نظام الأسر الطلابية',          icon: Home,            desc: 'أسر الأقسام والولايات' },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '90vh', paddingBottom: '80px', direction: 'rtl' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #062b25 0%, #0d4439 50%, #1a332d 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '60px 20px 48px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: '6px 20px', borderRadius: '30px', color: '#34d399', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
            <HeartHandshake size={16} />
            <span>قطاع الشؤون الاجتماعية والعمل التطوعي</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: '900', color: '#ffffff', margin: '0 0 16px' }}>
            الملتقى الاجتماعي — المبادرات والتكافل والأسر
          </h1>
          <p style={{ maxWidth: '780px', margin: '0 auto 26px', fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}>
            تجسيد قيم التكافل والإخاء بين الطلاب السودانيين بكلية العلوم، عبر إطلاق المبادرات الإنسانية، وتنظيم العمل التطوعي، وبناء شبكة دعم طلابي وأسري متكاملة في مصر.
          </p>

          {/* Admin buttons */}
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              <button
                onClick={openNewCampaign}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#0b1622', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}
              >
                <PlusCircle size={18} />
                <span>+ نشر حملة تكافل جديدة</span>
              </button>
              <button
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                <PlusCircle size={18} />
                <span>+ إضافة مبادرة أو أسرة (CMS)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Notification ──────────────────────────────────────────────────── */}
      {notification && (
        <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px' }}>
          <div style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#34d399', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <CheckCircle2 size={18} /><span>{notification}</span>
          </div>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', backgroundColor: '#0f172a', padding: '8px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const sel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', border: sel ? '2px solid #f59e0b' : '2px solid transparent', background: sel ? 'rgba(245,158,11,0.15)' : 'transparent', color: sel ? '#fbbf24' : '#cbd5e1', cursor: 'pointer', fontWeight: sel ? 'bold' : '600', fontSize: '13px', textAlign: 'right' }}
              >
                <Icon size={20} color={sel ? '#f59e0b' : '#94a3b8'} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>

        {/* ════ SOLIDARITY CAMPAIGNS TAB ══════════════════════════════════ */}
        {activeTab === 'solidarity' && (
          <div>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Wallet size={22} color="#f59e0b" />
                  المبادرات والتكافل الاجتماعي
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  حملات جمع التبرعات النشطة — شفافية مالية كاملة وعد تنازلي حي
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={fetchCampaigns} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>
                  <RefreshCw size={14} style={{ animation: campaignsLoading ? 'spin 1s linear infinite' : 'none' }} />
                  تحديث
                </button>
                {isAdmin && (
                  <button onClick={openNewCampaign} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0b1622', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    <PlusCircle size={15} /> نشر حملة جديدة
                  </button>
                )}
              </div>
            </div>

            {/* Loading state */}
            {campaignsLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: '#f59e0b' }} />
                <p style={{ margin: 0 }}>جاري تحميل حملات التكافل...</p>
              </div>
            )}

            {/* Empty state */}
            {!campaignsLoading && activeCampaigns.length === 0 && (
              <div style={{ textAlign: 'center', padding: '70px 20px', background: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Wallet size={56} color="#334155" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#475569', fontSize: '18px', margin: '0 0 8px' }}>لا توجد حملات تكافل نشطة حالياً</h3>
                <p style={{ color: '#334155', fontSize: '14px', margin: 0 }}>
                  {isAdmin ? 'اضغط على "نشر حملة جديدة" لإضافة أول حملة.' : 'ترقبوا مبادراتنا القادمة!'}
                </p>
              </div>
            )}

            {/* Campaign cards grid */}
            {!campaignsLoading && activeCampaigns.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {activeCampaigns.map(camp => {
                  const target    = Number(camp.targetAmount)    || 1;
                  const collected = Number(camp.collectedAmount) || 0;
                  const remaining = Math.max(target - collected, 0);
                  const pct       = Math.min((collected / target) * 100, 100);
                  const isExpired = new Date(camp.expiresAt).getTime() <= now;
                  const badgeStyle = getBadgeStyle(camp.badge);
                  const currency   = camp.currency || 'جنيه مصري';
                  const fmt = (n) => Number(n).toLocaleString('ar-EG');

                  return (
                    <div
                      key={camp._id}
                      style={{
                        background: isExpired ? 'rgba(15,23,42,0.5)' : '#0f172a',
                        borderRadius: '20px',
                        border: `1px solid ${isExpired ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        opacity: isExpired && !isAdmin ? 0 : 1,
                        transition: 'all 0.3s',
                      }}
                    >
                      {/* ── Card header ───────────────────────────────── */}
                      <div style={{ padding: '20px 20px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                            {camp.badge || 'مبادرة تكافل'}
                          </span>
                          <CountdownBadge expiresAt={camp.expiresAt} now={now} />
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px', lineHeight: '1.4' }}>
                          {camp.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
                          {camp.description}
                        </p>
                      </div>

                      {/* ── Financial transparency box ─────────────────── */}
                      <div style={{ margin: '0 20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', marginBottom: '14px' }}>
                          {/* Target */}
                          <div>
                            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '3px', fontWeight: 'bold' }}>المبلغ المستهدف</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#fbbf24' }}>{fmt(target)}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{currency}</div>
                          </div>
                          {/* Collected */}
                          <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '3px', fontWeight: 'bold' }}>تم جمعه</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>{fmt(collected)}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{currency}</div>
                          </div>
                          {/* Remaining */}
                          <div>
                            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '3px', fontWeight: 'bold' }}>المتبقي</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: remaining === 0 ? '#34d399' : '#f87171' }}>{fmt(remaining)}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{currency}</div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>التقدم نحو الهدف</span>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: pct >= 100 ? '#34d399' : '#fbbf24' }}>{pct.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${pct}%`,
                                background: pct >= 100
                                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                  : pct >= 60
                                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                    : 'linear-gradient(90deg, #ef4444, #dc2626)',
                                borderRadius: '99px',
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ── Admin quick-update ────────────────────────── */}
                      {isAdmin && (
                        <div style={{ padding: '12px 20px 0' }}>
                          {quickUpdateId === camp._id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                placeholder="المبلغ المجموع الجديد"
                                value={quickUpdateVal}
                                onChange={e => setQuickUpdateVal(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleQuickUpdate(camp._id)}
                                style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'ltr' }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleQuickUpdate(camp._id)}
                                disabled={quickSaving}
                                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                {quickSaving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={12} />}
                                حفظ
                              </button>
                              <button
                                onClick={() => { setQuickUpdateId(null); setQuickUpdateVal(''); }}
                                style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setQuickUpdateId(camp._id); setQuickUpdateVal(String(camp.collectedAmount || 0)); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(34,197,94,0.1)', border: '1px dashed rgba(34,197,94,0.3)', color: '#34d399', padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                            >
                              <RefreshCw size={13} /> تحديث المبلغ المجموع سريعاً
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── Payment methods ───────────────────────────── */}
                      {(camp.paymentMethods?.instapay || camp.paymentMethods?.vodafoneCash || camp.paymentMethods?.bankak || camp.whatsappLink) && (
                        <div style={{ padding: '14px 20px 0' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                            — طرق التبرع —
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                              <PaymentCopyBtn
                                icon={Smartphone} label="إنستاباي"
                                value={camp.paymentMethods?.instapay} fieldId={`${camp._id}-instapay`}
                                copiedField={copiedField} onCopy={copyToClipboard} color="#a78bfa"
                              />
                              <PaymentCopyBtn
                                icon={Smartphone} label="فودافون كاش"
                                value={camp.paymentMethods?.vodafoneCash} fieldId={`${camp._id}-vodafone`}
                                copiedField={copiedField} onCopy={copyToClipboard} color="#f87171"
                              />
                              <PaymentCopyBtn
                                icon={Landmark} label="بنكك"
                                value={camp.paymentMethods?.bankak} fieldId={`${camp._id}-bankak`}
                                copiedField={copiedField} onCopy={copyToClipboard} color="#34d399"
                              />
                            </div>
                            {camp.whatsappLink && (
                              <a
                                href={camp.whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '9px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                <MessageCircle size={14} /> انضم لمجموعة واتساب الحملة
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── Expired warning (admin view) ──────────────── */}
                      {isAdmin && isExpired && (
                        <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#f87171' }}>
                          <AlertTriangle size={12} /> انتهت صلاحية الحملة — مرئية للأدمن فقط
                        </div>
                      )}

                      {/* ── Admin edit / delete ───────────────────────── */}
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: '8px', padding: '14px 20px 20px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '14px' }}>
                          <button
                            onClick={() => openEditCampaign(camp)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', padding: '9px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            <Edit size={13} /> تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(camp._id)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '9px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            <Trash2 size={13} /> حذف
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ VOLUNTEER TAB ════════════════════════════════════════════════ */}
        {activeTab === 'volunteer' && (
          <div>
            {isAdmin && (
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0b1622', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  <PlusCircle size={16} /> إضافة فريق تطوعي جديد
                </button>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {(volunteerTeams.length ? volunteerTeams : DEFAULT_VOLUNTEERS).map(team => (
                <div key={team._id} style={{ backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{team.icon || '🤝'}</div>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>{team.name || team.title}</h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>{team.description}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 'bold', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px' }}>
                      👥 قوة الفريق: {team.members || '20 متطوعاً'}
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => { setEditingItem(team); setIsModalOpen(true); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '7px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}><Edit size={13} /> تعديل</button>
                        <button onClick={() => handleDeleteItem(team._id, 'volunteer')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '7px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}><Trash2 size={13} /> حذف</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ SUPPORT TAB ══════════════════════════════════════════════════ */}
        {activeTab === 'support' && (
          <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '18px' }}>خدمات الدعم والإرشاد الطلابي العاجل</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: '#fbbf24', margin: '0 0 8px', fontSize: '16px' }}>🏢 السكن الجامعي والمغتربين</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>توفير قوائم الشقق الطلابية المعتمدة والتنسيق مع وكلاء الإسكان لتخفيض التأمين ورسوم الإيجار.</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: '#38bdf8', margin: '0 0 8px', fontSize: '16px' }}>📜 الإجراءات القنصلية والإقامات</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>إرشادات استخراج إقامة الدراسة بمجمع التحرير والعباسية وتصديق الشهادات بالسفارة السودانية بالقاهرة.</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ color: '#34d399', margin: '0 0 8px', fontSize: '16px' }}>🤝 الإرشاد النفسي والأكاديمي</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>جلسات استشارية مع أساتذة وخريجين لمساعدة الطلاب في التغلب على ضغوط الدراسة والغربة.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ FAMILIES TAB ═════════════════════════════════════════════════ */}
        {activeTab === 'families' && (
          <div>
            {isAdmin && (
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0b1622', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  <PlusCircle size={16} /> إضافة أسرة طلابية جديدة
                </button>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
              {(studentFamilies.length ? studentFamilies : DEFAULT_FAMILIES).map(fam => (
                <div key={fam._id} style={{ backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <Home size={22} color="#f59e0b" />
                      <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{fam.name || fam.title}</h3>
                    </div>
                    {fam.scope && <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px' }}>النطاق: {fam.scope}</div>}
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>{fam.description}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px' }}>
                      👤 <strong>مسؤول الأسرة:</strong> {fam.lead || fam.author || 'إدارة الرابطة'}
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => { setEditingItem(fam); setIsModalOpen(true); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '7px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}><Edit size={13} /> تعديل</button>
                        <button onClick={() => handleDeleteItem(fam._id, 'families')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '7px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}><Trash2 size={13} /> حذف</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ CAMPAIGN ADMIN MODAL ══════════════════════════════════════════════ */}
      {showCampaignModal && (
        <div
          onClick={closeCampaignModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(6px)', direction: 'rtl' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 'bold', margin: '0 0 2px' }}>
                    {editingCampaign ? 'تعديل حملة التكافل' : 'نشر حملة تكافل جديدة'}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>الحقول المُنجَّمة (*) مطلوبة</p>
                </div>
              </div>
              <button onClick={closeCampaignModal} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Row: Title + Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>عنوان الحملة *</label>
                  <input value={campaignForm.title} onChange={e => setCampaignForm(p => ({...p, title: e.target.value}))} placeholder="مثال: مبادرة دعم طلاب الظروف الطارئة" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>الشارة *</label>
                  <select value={campaignForm.badge} onChange={e => setCampaignForm(p => ({...p, badge: e.target.value}))} style={{...inputStyle, minWidth: '140px'}}>
                    <option>مبادرة تكافل</option>
                    <option>حالة طارئة</option>
                    <option>مبادرة موسمية</option>
                    <option>دعم أكاديمي</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>الوصف التفصيلي *</label>
                <textarea value={campaignForm.description} onChange={e => setCampaignForm(p => ({...p, description: e.target.value}))} placeholder="اشرح هدف الحملة وكيف سيُستخدم المبلغ المجموع..." rows={3} style={{...inputStyle, resize: 'vertical'}} />
              </div>

              {/* Row: Target + Collected */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}><Target size={12} style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}} />المبلغ المستهدف *</label>
                  <input type="number" min="0" value={campaignForm.targetAmount} onChange={e => setCampaignForm(p => ({...p, targetAmount: e.target.value}))} placeholder="مثال: 50000" style={{...inputStyle, direction:'ltr'}} />
                </div>
                <div>
                  <label style={labelStyle}>المبلغ المجموع حتى الآن</label>
                  <input type="number" min="0" value={campaignForm.collectedAmount} onChange={e => setCampaignForm(p => ({...p, collectedAmount: e.target.value}))} placeholder="0" style={{...inputStyle, direction:'ltr'}} />
                </div>
              </div>

              {/* Expiry date */}
              <div>
                <label style={labelStyle}><Clock size={12} style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}} />تاريخ ووقت انتهاء الحملة *</label>
                <input type="datetime-local" value={campaignForm.expiresAt} onChange={e => setCampaignForm(p => ({...p, expiresAt: e.target.value}))} style={{...inputStyle, direction:'ltr', colorScheme:'dark'}} />
              </div>

              {/* Payment methods */}
              <div>
                <label style={{...labelStyle, marginBottom:'10px', display:'block'}}>طرق الدفع والتبرع</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
                    <input value={campaignForm.paymentMethods.instapay} onChange={e => setCampaignForm(p => ({...p, paymentMethods: {...p.paymentMethods, instapay: e.target.value}}))} placeholder="رقم حساب إنستاباي" style={{...inputStyle, flex:1, margin:0, direction:'ltr'}} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={16} color="#f87171" style={{ flexShrink: 0 }} />
                    <input value={campaignForm.paymentMethods.vodafoneCash} onChange={e => setCampaignForm(p => ({...p, paymentMethods: {...p.paymentMethods, vodafoneCash: e.target.value}}))} placeholder="رقم فودافون كاش" style={{...inputStyle, flex:1, margin:0, direction:'ltr'}} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Landmark size={16} color="#34d399" style={{ flexShrink: 0 }} />
                    <input value={campaignForm.paymentMethods.bankak} onChange={e => setCampaignForm(p => ({...p, paymentMethods: {...p.paymentMethods, bankak: e.target.value}}))} placeholder="رقم حساب بنكك" style={{...inputStyle, flex:1, margin:0, direction:'ltr'}} />
                  </div>
                </div>
              </div>

              {/* WhatsApp link */}
              <div>
                <label style={labelStyle}><MessageCircle size={12} style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}} />رابط مجموعة واتساب (اختياري)</label>
                <input value={campaignForm.whatsappLink} onChange={e => setCampaignForm(p => ({...p, whatsappLink: e.target.value}))} placeholder="https://chat.whatsapp.com/..." style={{...inputStyle, direction:'ltr'}} />
              </div>

              {/* Image URL */}
              <div>
                <label style={labelStyle}>رابط صورة الحملة (اختياري)</label>
                <input value={campaignForm.imageUrl} onChange={e => setCampaignForm(p => ({...p, imageUrl: e.target.value}))} placeholder="https://..." style={{...inputStyle, direction:'ltr'}} />
              </div>

              {/* Live preview of calculated values */}
              {campaignForm.targetAmount && (
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>المستهدف</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fbbf24' }}>{Number(campaignForm.targetAmount||0).toLocaleString('ar-EG')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>المجموع</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#34d399' }}>{Number(campaignForm.collectedAmount||0).toLocaleString('ar-EG')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>المتبقي</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f87171' }}>
                      {Math.max(Number(campaignForm.targetAmount||0) - Number(campaignForm.collectedAmount||0), 0).toLocaleString('ar-EG')}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button
                  onClick={handleSaveCampaign}
                  disabled={campaignSaving}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0b1622', border: 'none', padding: '13px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: campaignSaving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.35)' }}
                >
                  {campaignSaving
                    ? <><Loader2 size={16} style={{animation:'spin 1s linear infinite'}} /><span>جاري الحفظ...</span></>
                    : <><CheckCircle2 size={16} /><span>{editingCampaign ? 'حفظ التعديلات' : 'نشر الحملة'}</span></>
                  }
                </button>
                <button onClick={closeCampaignModal} style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CMS MODAL (volunteer / families) ════════════════════════════════ */}
      <AdminHubCMSModal
        hub="social"
        section={activeTab}
        sectionsList={tabs}
        editingItem={editingItem}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSaved={handleSaved}
      />
    </div>
  );
}

// ─── Shared style helpers ───────────────────────────────────────────────────────
const labelStyle = {
  display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px',
};
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', outline: 'none',
  fontSize: '13px', boxSizing: 'border-box', direction: 'rtl',
};
