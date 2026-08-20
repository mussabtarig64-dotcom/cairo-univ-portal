import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Payments() {
  const { user } = useAuth();
  const [activity, setActivity] = useState('اشتراك الرابطة السنوي');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [notes, setNotes] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !receipt) {
      setStatusMsg('يرجى إدخال المبلغ وإرفاق صورة الإيصال.');
      return;
    }
    // إرسال البيانات
    setStatusMsg('تم رفع إيصال الدفع بنجاح! طلبك قيد المراجعة من الإدارة.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md my-8 dir-rtl text-right">
      <h2 className="text-2xl font-bold mb-4 text-emerald-700 dark:text-emerald-400">إرفاق إيصال الدفع والاشتراكات</h2>
      
      {/* بيانات الدفع الرسمية */}
      <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border-r-4 border-emerald-600">
        <h3 className="font-semibold text-lg mb-2">وسائل الدفع المتاحة:</h3>
        <p>📱 <strong>فودافون كاش / InstaPay:</strong> 010XXXXXXXX</p>
        <p>🏦 <strong>الحساب البنكي:</strong> رابطة الطلاب السودانيين - كلية العلوم</p>
      </div>

      {statusMsg && (
        <div className="p-3 mb-4 bg-emerald-100 text-emerald-800 rounded">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">نوع النشاط / الفعالية</label>
          <select 
            value={activity} 
            onChange={(e) => setActivity(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option>اشتراك الرابطة السنوي</option>
            <option>فعالية أسبوع استقبال الجدد</option>
            <option>رحلة / نشاط رياضي</option>
            <option>خدمات وحسابات أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">المبلغ المدفوع (بالجنيه المصري)</label>
          <input 
            type="number" 
            placeholder="مثال: 150" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">رقم العملية / المرجع (إن وجد)</label>
          <input 
            type="text" 
            placeholder="رقم العملية من فودافون كاش أو إنستا باي" 
            value={transactionId} 
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">صورة إيصال الدفع (Screenshot)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setReceipt(e.target.files[0])}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ملاحظات إضافية</label>
          <textarea 
            rows="2" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition"
        >
          تأكيد وإرسال الإيصال
        </button>
      </form>
    </div>
  );
}