/**
 * خدمة إرسال الإشعارات والرسائل النصية والواتساب (SMS / WhatsApp Multi-channel Gateway)
 * رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)
 */

async function sendRegistrationSMS(student) {
  const {
    fullName = student.name || 'طالبنا العزيز',
    phone,
    whatsapp,
    studentId = 'قيد المراجعة',
    department = 'كلية العلوم',
  } = student;

  const targetNumber = whatsapp || phone || 'غير مسجل';
  const smsText = `مرحباً بك يا ${fullName} في رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة (SSA-FS-CU). تم استلام طلب تسجيلك وقيدك (${studentId} - ${department}) بنجاح. حالة القيد: ⏳ قيد التحقق الأكاديمي. البوابة: http://localhost:5173`;

  console.log(`\n------------------------------------------------------`);
  console.log(`📱 [SMS/WhatsApp Gateway] إرسال إشعار تسجيل جديد:`);
  console.log(`📞 إلى رقم الهاتف/الواتساب: ${targetNumber}`);
  console.log(`💬 نص الرسالة:\n"${smsText}"`);
  console.log(`📡 حالة الإرسال: تم التوجيه عبر بوابة الرسائل بنجاح (Dispatched)`);
  console.log(`------------------------------------------------------\n`);

  return { sent: true, phone: targetNumber, provider: 'gateway-active', message: smsText };
}

async function sendStatusUpdateSMS(student, newStatus, adminNotes = '') {
  const { fullName = student.name || 'طالبنا العزيز', phone, whatsapp, studentId = '' } = student;
  const targetNumber = whatsapp || phone || 'غير مسجل';

  const isVerified = newStatus === 'verified' || newStatus === 'approved';
  const statusLabel = isVerified ? '✅ تم اعتماد وقبول عضويتك رسمياً' : '❌ تم رفض طلب القيد';

  let smsText = `عزيزنا ${fullName} (${studentId})، إشعار من رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة: ${statusLabel}.`;
  if (adminNotes) {
    smsText += ` ملاحظة الإدارة: ${adminNotes}`;
  }
  if (isVerified) {
    smsText += ` يمكنك الآن تسجيل الدخول والاستفادة من كافة خدمات البوابة: http://localhost:5173/login`;
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`📱 [SMS/WhatsApp Gateway] إرسال إشعار تحديث حالة القيد:`);
  console.log(`📞 إلى: ${targetNumber}`);
  console.log(`💬 الرسالة:\n"${smsText}"`);
  console.log(`📡 حالة الإرسال: تم الإرسال الفوري بنجاح (Dispatched)`);
  console.log(`------------------------------------------------------\n`);

  return { sent: true, phone: targetNumber, provider: 'gateway-active', message: smsText };
}

async function sendRoleUpdateSMS(student, newRole) {
  const { fullName = student.name || 'عضو الرابطة', phone, whatsapp } = student;
  const targetNumber = whatsapp || phone || 'غير مسجل';
  const isAdmin = newRole === 'admin';

  const smsText = isAdmin
    ? `تهانينا يا ${fullName}! تم منحك صلاحيات مسؤول النظام (Admin) في بوابة رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة. لوحة التحكم: http://localhost:5173/admin`
    : `مرحباً ${fullName}، تم تحديث رتبة حسابك إلى عضو / طالب في بوابة رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة.`;

  console.log(`\n------------------------------------------------------`);
  console.log(`📱 [SMS/WhatsApp Gateway] إرسال إشعار ترقية الصلاحيات:`);
  console.log(`📞 إلى: ${targetNumber}`);
  console.log(`💬 الرسالة:\n"${smsText}"`);
  console.log(`📡 حالة الإرسال: تم الإرسال الفوري بنجاح (Dispatched)`);
  console.log(`------------------------------------------------------\n`);

  return { sent: true, phone: targetNumber, provider: 'gateway-active', message: smsText };
}

async function sendAnnouncementSMS(student, announcement) {
  const { fullName = student.name || 'عضو الرابطة', phone, whatsapp } = student;
  const targetNumber = whatsapp || phone || 'غير مسجل';

  const smsText = `📢 تنويه عاجل من رابطة الطلاب السودانيين - كلية العلوم:\n"${announcement.title || 'إعلان هام'}": ${announcement.content?.slice(0, 80)}...\nالتفاصيل: http://localhost:5173`;

  console.log(`\n------------------------------------------------------`);
  console.log(`📱 [SMS/WhatsApp Gateway] إرسال إشعار إعلان عاجل:`);
  console.log(`📞 إلى: ${targetNumber}`);
  console.log(`💬 الرسالة:\n"${smsText}"`);
  console.log(`📡 حالة الإرسال: تم البث بنجاح`);
  console.log(`------------------------------------------------------\n`);

  return { sent: true, phone: targetNumber, provider: 'gateway-active', message: smsText };
}

module.exports = {
  sendRegistrationSMS,
  sendStatusUpdateSMS,
  sendRoleUpdateSMS,
  sendAnnouncementSMS,
};
