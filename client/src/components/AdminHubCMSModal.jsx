import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  PlusCircle,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';
import { createHubContent, updateHubContent, deleteHubContent } from '../utils/cmsApi';

export default function AdminHubCMSModal({
  hub,
  section,
  sectionsList = [],
  editingItem = null,
  isOpen = false,
  onClose,
  onSaved,
}) {
  const { activeTheme } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    section: section || 'general',
    category: 'عام',
    year: new Date().getFullYear().toString(),
    date: new Date().toLocaleDateString('ar-EG'),
    badge: '',
    author: 'إدارة الرابطة',
    status: 'نشط',
    icon: '📌',
    link: '',
    fileUrl: '',
    fileSize: '',
    extraNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        subtitle: editingItem.subtitle || '',
        description: editingItem.description || editingItem.desc || '',
        section: editingItem.section || section || 'general',
        category: editingItem.category || editingItem.dept || editingItem.sport || 'عام',
        year: editingItem.year ? editingItem.year.toString() : new Date().getFullYear().toString(),
        date: editingItem.date || '',
        badge: editingItem.badge || '',
        author: editingItem.author || editingItem.captain || 'إدارة الرابطة',
        status: editingItem.status || 'نشط',
        icon: editingItem.icon || '📌',
        link: editingItem.link || '',
        fileUrl: editingItem.fileUrl || '',
        fileSize: editingItem.fileSize || '',
        extraNotes: editingItem.impact || editingItem.prize || editingItem.seats || '',
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        section: section || 'general',
        category: 'عام',
        year: new Date().getFullYear().toString(),
        date: new Date().toLocaleDateString('ar-EG'),
        badge: '',
        author: 'إدارة الرابطة',
        status: 'نشط',
        icon: '📌',
        link: '',
        fileUrl: '',
        fileSize: '',
        extraNotes: '',
      });
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [editingItem, section, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('يرجى إدخال عنوان المحتوى');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingItem && editingItem._id) {
        const updated = await updateHubContent(editingItem._id, formData);
        setSuccessMsg('تم تحديث المحتوى بنجاح في قاعدة البيانات!');
        setTimeout(() => {
          onSaved(updated, 'update');
          onClose();
        }, 800);
      } else {
        const created = await createHubContent(hub, formData);
        setSuccessMsg('تمت إضافة المحتوى بنجاح إلى قاعدة البيانات (MongoDB Atlas)!');
        setTimeout(() => {
          onSaved(created, 'create');
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ المحتوى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        direction: 'rtl',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '24px',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
              {editingItem ? 'تعديل المحتوى (لوحة الإدارة)' : 'إضافة محتوى جديد (CMS - Admin)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#34d399', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Section Selector */}
          {sectionsList.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                التبويب / القسم المستهدف:
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                style={inputStyle}
              >
                {sectionsList.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              عنوان المحتوى الرئيسي: *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: بطولة خماسيات كلية العلوم 2026..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Subtitle / Department / Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                التصنيف أو القسم الأكاديمي:
              </label>
              <input
                type="text"
                placeholder="مثال: قسم الكيمياء، كرة قدم، تراث..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                السنة الأكاديمية / التاريخ:
              </label>
              <input
                type="text"
                placeholder="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              الوصف والتفاصيل:
            </label>
            <textarea
              rows={3}
              placeholder="تفاصيل الخبر، نتائج المباريات، أو محتوى المبادرة..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Badge & Extra Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                الشارة (Badge / Status):
              </label>
              <input
                type="text"
                placeholder="مثال: جارية الآن، معتمد، متميز..."
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                ملاحظات أو رابط إضافي:
              </label>
              <input
                type="text"
                placeholder="https://... أو تفاصيل الجوائز"
                value={formData.link || formData.extraNotes}
                onChange={(e) => setFormData({ ...formData, link: e.target.value, extraNotes: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'جاري الحفظ...' : editingItem ? 'تحديث المحتوى' : 'حفظ ونشر'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  direction: 'rtl',
  boxSizing: 'border-box',
};
