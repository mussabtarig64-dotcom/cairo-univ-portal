import React, { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  Upload,
  Sparkles,
  Layers,
  Paperclip,
  Link2,
  Eye,
  RefreshCw,
  Cloud,
  CloudUpload,
  Loader2,
  UserCheck,
  User
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
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    memberName: '',
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
    fileName: '',
    extraNotes: '',
  });

  const [selectedFile, setSelectedFile] = useState(null); // { name, size, type: 'pdf' | 'image' | 'file', previewUrl }
  const [rawFile, setRawFile] = useState(null); // File object for multipart/form-data
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      const isPdf =
        editingItem.fileUrl?.startsWith('data:application/pdf') ||
        editingItem.fileUrl?.toLowerCase().includes('.pdf') ||
        editingItem.fileName?.toLowerCase().endsWith('.pdf') ||
        editingItem.format === 'PDF';

      const isImg =
        editingItem.fileUrl?.startsWith('data:image') ||
        editingItem.fileUrl?.toLowerCase().match(/\.(jpeg|jpg|png|webp|gif)$/) ||
        editingItem.fileName?.toLowerCase().match(/\.(jpeg|jpg|png|webp|gif)$/);

      let initialFile = null;
      if (editingItem.fileUrl) {
        initialFile = {
          name: editingItem.fileName || (isPdf ? 'مستند_مرفق.pdf' : isImg ? 'صورة_مرفقة.jpg' : 'ملف_مرفق'),
          size: editingItem.fileSize || '',
          type: isPdf ? 'pdf' : isImg ? 'image' : 'file',
          previewUrl: isImg ? editingItem.fileUrl : null,
          dataUrl: editingItem.fileUrl,
        };
      }

      setSelectedFile(initialFile);
      setRawFile(null);
      setFormData({
        title: editingItem.title || '',
        subtitle: editingItem.subtitle || '',
        memberName: editingItem.memberName || editingItem.name || editingItem.lead || editingItem.member || '',
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
        fileName: editingItem.fileName || '',
        extraNotes: editingItem.impact || editingItem.prize || editingItem.seats || editingItem.extraNotes || '',
      });
    } else {
      setSelectedFile(null);
      setRawFile(null);
      setFormData({
        title: '',
        subtitle: '',
        memberName: '',
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
        fileName: '',
        extraNotes: '',
      });
    }
    setErrorMsg('');
    setSuccessMsg('');
    setUploadStatusText('');
  }, [editingItem, section, isOpen]);

  if (!isOpen) return null;

  // دالة معالجة واستلام الملفات بأحجام غير مقيدة للرفع السحابي عبر Cloudinary
  const handleProcessFile = (file) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || lowerName.match(/\.(jpg|jpeg|png|webp|gif)$/i);

    setErrorMsg('');
    setIsProcessingFile(true);

    // حساب الحجم بصيغة سهلة القراءة
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(file.size / 1024)} KB`;

    // تعيين الملف الأصلي للرفع السحابي المباشر
    setRawFile(file);

    let previewUrl = null;
    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    }

    setSelectedFile({
      name: file.name,
      size: formattedSize,
      type: isPdf ? 'pdf' : isImage ? 'image' : 'file',
      previewUrl,
    });

    setFormData((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: formattedSize,
      title: prev.title ? prev.title : file.name.replace(/\.[^/.]+$/, ''),
      link: prev.link || file.name,
    }));

    setIsProcessingFile(false);
  };

  // إزالة الملف المرفوع
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setRawFile(null);
    setFormData((prev) => ({
      ...prev,
      fileUrl: '',
      fileSize: '',
      fileName: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() && !formData.fileName) {
      setErrorMsg('يرجى إدخال عنوان المحتوى أو اختيار ملف مرفق');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadStatusText(rawFile ? '☁️ جاري رفع الملف السحابي إلى Cloudinary...' : 'جاري الحفظ...');

    try {
      // بناء FormData لإرسال الملف الحقيقي والبيانات بدقة
      const fd = new FormData();
      fd.append('title', formData.title.trim() || formData.fileName);
      fd.append('subtitle', formData.subtitle || '');
      fd.append('memberName', formData.memberName || '');
      fd.append('name', formData.memberName || '');
      fd.append('description', formData.description || '');
      fd.append('section', formData.section || 'general');
      fd.append('category', formData.category || 'عام');
      fd.append('year', formData.year || new Date().getFullYear().toString());
      fd.append('date', formData.date || new Date().toLocaleDateString('ar-EG'));
      fd.append('badge', formData.badge || '');
      fd.append('author', formData.author || 'إدارة الرابطة');
      fd.append('status', formData.status || 'نشط');
      fd.append('icon', formData.icon || '📌');
      fd.append('link', formData.link || '');
      fd.append('fileName', formData.fileName || (rawFile ? rawFile.name : ''));
      fd.append('fileSize', formData.fileSize || '');
      fd.append('extraNotes', formData.extraNotes || '');

      if (rawFile) {
        fd.append('file', rawFile, rawFile.name);
      } else if (formData.fileUrl) {
        fd.append('fileUrl', formData.fileUrl);
      }

      let result;
      if (editingItem && editingItem._id) {
        result = await updateHubContent(editingItem._id, fd);
        setSuccessMsg('تم تحديث المحتوى ورفع المرفق السحابي بنجاح!');
        setTimeout(() => {
          onSaved(result, 'update');
          onClose();
        }, 900);
      } else {
        result = await createHubContent(hub, fd);
        setSuccessMsg('تم حفظ المحتوى ورفع المرفق إلى التخزين السحابي (Cloudinary) بنجاح!');
        setTimeout(() => {
          onSaved(result, 'create');
          onClose();
        }, 900);
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء رفع وحفظ المحتوى');
    } finally {
      setIsSubmitting(false);
      setUploadStatusText('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
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
          backgroundColor: '#0b1329',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.12)',
          padding: '26px',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <CloudUpload size={20} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
                {editingItem ? 'تعديل المحتوى (لوحة الإدارة)' : 'إضافة محتوى جديد (CMS - Admin)'}
              </h3>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                رفع المذكرات، نماذج الامتحانات، والمستندات السحابية (Cloudinary Cloud Storage)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.18)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} className="shrink-0" />
            <span style={{ fontWeight: '500' }}>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.18)', border: '1px solid #22c55e', color: '#86efac', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} className="shrink-0" />
            <span style={{ fontWeight: '500' }}>{successMsg}</span>
          </div>
        )}

        {/* Cloud Upload Spinner Indicator */}
        {isSubmitting && (
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', padding: '14px 18px', borderRadius: '14px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', animation: 'pulse 1.8s infinite' }}>
            <Loader2 size={20} className="animate-spin shrink-0" color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 'bold' }}>{uploadStatusText || 'جاري الرفع السحابي ومعالجة الطلب...'}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                يتم نقل الملف مباشرة إلى خوادم Cloudinary وتأمين رابط الـ HTTPS الدائم.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <option key={s.id} value={s.id} style={{ background: '#0b1329', color: '#ffffff' }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Association Member Name Field (Unconditionally Visible Above Title) */}
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '14px 16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#fbbf24', marginBottom: '8px' }}>
              <UserCheck size={18} color="#f59e0b" />
              <span>اسم عضو الرابطة (Association Member Name):</span>
            </label>
            <input
              type="text"
              placeholder="مثال: مصعب طارق، د. سيف الدين، عمر صديق، أو اسم المسؤول..."
              value={formData.memberName}
              onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
              style={{ ...inputStyle, backgroundColor: 'rgba(0, 0, 0, 0.35)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              عنوان المحتوى الرئيسي أو المنصب الإداري: *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: رئيس الرابطة، مذكرة الكيمياء العضوية، جدول المحاضرات، الخطة الاستراتيجية..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Subtitle / Department / Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                التصنيف أو القسم الأكاديمي:
              </label>
              <input
                type="text"
                placeholder="مثال: قسم الكيمياء، الفيزياء، الرياضيات..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                السنة الأكاديمية / الدفعة:
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
              placeholder="تفاصيل المحتوى، فصول المذكرة، أو تعليمات الامتحان..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* File Upload Zone (Drag & Drop + Browse Button for Heavy PDFs & Images) */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#f59e0b', marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={16} />
                <span>رفع الملفات المرفقة والتخزين السحابي (Cloudinary):</span>
              </span>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'normal' }}>
                يدعم ملفات PDF الكبيرة والصور بدون قيود حجم
              </span>
            </label>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.ppt,.pptx,.zip,application/pdf,image/*"
              style={{ display: 'none' }}
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: isDragging ? '2px dashed #f59e0b' : '2px dashed rgba(255, 255, 255, 0.22)',
                  backgroundColor: isDragging ? 'rgba(245, 158, 11, 0.16)' : 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '14px',
                  padding: '26px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: isDragging ? 'scale(1.015)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                  boxShadow: isDragging ? '0 0 32px rgba(245, 158, 11, 0.35)' : 'none',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: isDragging ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    marginBottom: '10px',
                    transform: isDragging ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <CloudUpload size={24} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                  {isDragging ? '⚡ أفلت الملف هنا الآن للرفع السحابي!' : 'اسحب وأفلت الملف هنا، أو انقر للاستعراض'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                  يمكنك رفع مذكرات دراسية كاملة، ملفات PDF، نماذج امتحانات، أو صور فائقة الدقة
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  <Upload size={14} />
                  <span>استعراض الملفات من جهازك</span>
                </button>
              </div>
            ) : (
              /* Selected File Indicator */
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {selectedFile.type === 'image' && selectedFile.previewUrl ? (
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        flexShrink: 0,
                      }}
                    >
                      <img src={selectedFile.previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : selectedFile.type === 'pdf' ? (
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={24} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Paperclip size={24} />
                    </div>
                  )}

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: selectedFile.type === 'pdf' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                          color: selectedFile.type === 'pdf' ? '#fca5a5' : '#86efac',
                          border: `1px solid ${selectedFile.type === 'pdf' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.45)'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={11} />
                        <span>{selectedFile.type === 'pdf' ? 'مستند PDF جاهز للرفع السحابي' : 'ملف جاهز للرفع السحابي'}</span>
                      </span>
                      {selectedFile.size && (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>({selectedFile.size})</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '3px' }}>
                      {selectedFile.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    title="تغيير الملف"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#cbd5e1',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>تغيير</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    title="إزالة الملف"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>إزالة</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Badge & External Link / Extra Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                الشارة (Badge / Status):
              </label>
              <input
                type="text"
                placeholder="مثال: ملزمة جديدة، امتحان معتمد، شامل..."
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                <Link2 size={14} color="#38bdf8" />
                <span>رابط خارجي بديل أو ملاحظات إضافية:</span>
              </label>
              <input
                type="text"
                placeholder="https://... أو Google Drive أو تفاصيل إضافية"
                value={formData.link || formData.extraNotes}
                onChange={(e) => setFormData({ ...formData, link: e.target.value, extraNotes: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isProcessingFile}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSubmitting || isProcessingFile ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                opacity: isSubmitting || isProcessingFile ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{rawFile ? 'جاري الرفع السحابي...' : 'جاري الحفظ...'}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{editingItem ? 'تحديث المحتوى' : 'حفظ ونشر'}</span>
                </>
              )}
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
