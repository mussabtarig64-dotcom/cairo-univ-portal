const nodemailer = require('nodemailer');

// إنشاء ناقل البريد الإلكتروني (Transporter)
let transporter = null;
let etherealAccount = null;

async function getTransporter() {
  if (transporter) return transporter;

  // إذا تم توفير إعدادات SMTP حقيقية في ملف .env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('📧 تم تهيئة خدمة البريد الإلكتروني عبر SMTP مخصص');
    return transporter;
  }

  // في وضع التطوير المحلي: إنشاء حساب Ethereal تجريبي تلقائياً
  try {
    etherealAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });
    console.log(`📧 [Ethereal Mail] تم إنشاء حساب تجريبي محلي: ${etherealAccount.user}`);
    return transporter;
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب Ethereal:', error.message);
    return null;
  }
}

/**
 * إرسال بريد الترحيب وتأكيد تسجيل الطالب
 * @param {Object} student - بيانات الطالب المسجل
 */
async function sendWelcomeEmail(student) {
  const {
    fullName = student.name || 'طالبنا العزيز',
    email,
    phone = 'غير محدد',
    cairoAddress = 'القاهرة، مصر',
    studentId = 'قيد التوليد',
    department = 'العلوم العامة',
    academicLevel = 'المستوى الأول',
    emergencyContactName = 'غير محدد',
    emergencyContactPhone = 'غير محدد',
    verificationStatus = 'pending'
  } = student;

  const statusArabic = verificationStatus === 'verified'
    ? '✅ تم التحقق والاعتماد رسميـاً'
    : '⏳ قيد المراجعة والتحقق الأكاديمي';

  const statusColor = verificationStatus === 'verified' ? '#10b981' : '#f59e0b';
  const statusBg = verificationStatus === 'verified' ? '#ecfdf5' : '#fffbeb';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد التسجيل - رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1b2a; margin: 0; padding: 20px; color: #333333; direction: rtl; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0b3b24 0%, #1d2a45 100%); padding: 35px 25px; text-align: center; color: #ffffff; }
    .logo-badge { display: inline-block; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; background: #d4af37; color: #0b3b24; font-size: 24px; font-weight: bold; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .title { margin: 0; font-size: 22px; font-weight: bold; color: #ffffff; }
    .subtitle { margin: 6px 0 0; font-size: 14px; color: #d4af37; font-weight: 600; }
    .body { padding: 30px 25px; }
    .welcome-text { font-size: 16px; line-height: 1.7; color: #2d3748; margin-bottom: 20px; }
    .status-badge { display: inline-block; padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 25px; border: 1px solid ${statusColor}; color: ${statusColor}; background-color: ${statusBg}; }
    .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
    .info-title { font-size: 16px; font-weight: bold; color: #0b3b24; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .info-table td { padding: 9px 6px; border-bottom: 1px solid #edf2f7; }
    .info-label { color: #64748b; font-weight: 600; width: 38%; }
    .info-value { color: #1e293b; font-weight: bold; }
    .action-btn { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #c59b27 100%); color: #0b3b24 !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 15px; margin: 15px 0; text-align: center; box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .highlight-box { background: #eff6ff; border-right: 4px solid #3b82f6; padding: 12px 16px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #1e40af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">SSA</div>
      <h1 class="title">رابطة الطلاب السودانيين - كلية العلوم</h1>
      <p class="subtitle">جامعة القاهرة | Sudanese Students Association - Faculty of Science, Cairo University</p>
    </div>

    <div class="body">
      <p class="welcome-text">
        مرحباً بك يا زميلنا العزيز <strong>${fullName}</strong>،<br>
        يسر الهيئة التنفيذية لرابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة (SSA-FS-CU) أن ترحب بك فرداً عزيزاً في بيتك الأكاديمي والاجتماعي. لقد تم تسجيل بياناتك بنجاح في السجل المركزي الموحد للرابطة.
      </p>

      <div style="text-align: center;">
        <span class="status-badge">${statusArabic}</span>
      </div>

      <div class="info-card">
        <h3 class="info-title">📋 بيانات القيد والتسجيل المعتمدة</h3>
        <table class="info-table">
          <tr>
            <td class="info-label">الاسم الكامل:</td>
            <td class="info-value">${fullName}</td>
          </tr>
          <tr>
            <td class="info-label">الرقم الجامعي / رقم القيد:</td>
            <td class="info-value" style="color: #0b3b24; letter-spacing: 0.5px;">${studentId}</td>
          </tr>
          <tr>
            <td class="info-label">القسم العلمي:</td>
            <td class="info-value">${department}</td>
          </tr>
          <tr>
            <td class="info-label">المستوى الأكاديمي:</td>
            <td class="info-value">${academicLevel}</td>
          </tr>
          <tr>
            <td class="info-label">البريد الإلكتروني:</td>
            <td class="info-value">${email}</td>
          </tr>
          <tr>
            <td class="info-label">رقم الهاتف / الواتساب:</td>
            <td class="info-value">${phone}</td>
          </tr>
          <tr>
            <td class="info-label">مكان السكن بالقاهرة:</td>
            <td class="info-value">${cairoAddress}</td>
          </tr>
          <tr>
            <td class="info-label">جهة الاتصال للطوارئ:</td>
            <td class="info-value">${emergencyContactName} (${emergencyContactPhone})</td>
          </tr>
          <tr>
            <td class="info-label">تاريخ التسجيل:</td>
            <td class="info-value">${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
        </table>
      </div>

      <div class="highlight-box">
        💡 <strong>تنبيه أكاديمي:</strong> بعد مراجعة واعتماد طلبك من قِبل مجلس إدارة الرابطة، ستتمكن من استخدام كافة خدمات البوابة الطلابية الشاملة.
      </div>

      <div style="text-align: center;">
        <a href="http://localhost:5173/login" class="action-btn">الدخول إلى البوابة الطلابية</a>
      </div>
    </div>

    <div class="footer">
      <p>رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)</p>
      <p>مبنى كلية العلوم، الحرم الجامعي، الجيزة، جمهورية مصر العربية | support@ssa-fscu.org</p>
      <p style="margin-top: 8px; color: #94a3b8;">تم إرسال هذا البريد تلقائياً لتأكيد قيدك الرسمي في قاعدة بيانات الرابطة.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailClient = await getTransporter();
    if (!mailClient) {
      console.warn('⚠️ لم يتم إرسال البريد لعدم توفر عميل البريد الإلكتروني.');
      return { sent: false, previewUrl: null, error: 'Transporter not ready' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"رابطة الطلاب السودانيين - كلية العلوم" <no-reply@ssa-fscu.org>',
      to: email,
      subject: `🎓 مرحباً بك في رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة | تأكيد التسجيل (${studentId})`,
      html: htmlContent,
    };

    const info = await mailClient.sendMail(mailOptions);
    console.log(`\n======================================================`);
    console.log(`✅ [Nodemailer Dispatch] تم إرسال بريد الترحيب بنجاح!`);
    console.log(`📨 إلى: ${email} (${fullName})`);
    console.log(`🆔 Message ID: ${info.messageId}`);

    let previewUrl = null;
    const etherealUrl = nodemailer.getTestMessageUrl(info);
    if (etherealUrl) {
      previewUrl = etherealUrl;
      console.log(`🔗 [Email Preview URL] رابط معاينة البريد الإلكتروني (Ethereal): ${previewUrl}`);
    }
    console.log(`======================================================\n`);

    return { sent: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال بريد الترحيب عبر Nodemailer:', error.message);
    return { sent: false, previewUrl: null, error: error.message };
  }
}

/**
 * إرسال بريد تحديث حالة الحساب (قبول / رفض / قيد المراجعة)
 */
async function sendStatusUpdateEmail(student, newStatus, adminNotes = '') {
  const {
    fullName = student.name || 'طالبنا العزيز',
    email,
    studentId = 'قيد التوليد',
    department = 'العلوم العامة',
  } = student;

  const isVerified = newStatus === 'verified';
  const isRejected = newStatus === 'rejected';

  const statusTitle = isVerified
    ? '🎉 تهانينا! تم اعتماد وتوثيق عضويتك رسميـاً'
    : isRejected
    ? '⚠️ إشعار بخصوص طلب الانضمام للرابطة'
    : '⏳ تم تحديث حالة طلبك إلى: قيد المراجعة';

  const statusColor = isVerified ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b';
  const statusBg = isVerified ? '#ecfdf5' : isRejected ? '#fef2f2' : '#fffbeb';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تحديث حالة العضوية - رابطة الطلاب السودانيين</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1b2a; margin: 0; padding: 20px; color: #333333; direction: rtl; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #0b3b24 0%, #1d2a45 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
    .logo-badge { display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; background: #d4af37; color: #0b3b24; font-size: 22px; font-weight: bold; margin-bottom: 10px; }
    .body { padding: 30px 25px; }
    .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-size: 15px; font-weight: bold; margin: 20px 0; border: 1px solid ${statusColor}; color: ${statusColor}; background-color: ${statusBg}; }
    .action-btn { display: inline-block; background: #d4af37; color: #0b3b24 !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: bold; font-size: 15px; margin: 15px 0; }
    .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">SSA</div>
      <h2 style="margin:0; color:#ffffff;">رابطة الطلاب السودانيين - كلية العلوم</h2>
      <p style="margin:5px 0 0; color:#d4af37; font-size:13px;">جامعة القاهرة</p>
    </div>
    <div class="body">
      <h3>مرحباً ${fullName}،</h3>
      <p>نود إعلامك بأنه تم تحديث حالة حسابك في السجل المركزي لرابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة.</p>
      
      <div style="text-align: center;">
        <span class="status-badge">${statusTitle}</span>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>الرقم الجامعي / القيد:</strong> ${studentId}</p>
        <p style="margin: 0 0 8px;"><strong>القسم:</strong> ${department}</p>
        ${adminNotes ? `<p style="margin: 8px 0 0; padding-top:8px; border-top: 1px dashed #cbd5e1; color:#475569;"><strong>ملاحظات إدارة الرابطة:</strong> ${adminNotes}</p>` : ''}
      </div>

      ${isVerified ? `
        <p>يمكنك الآن تسجيل الدخول والاستفادة من جميع خدمات البوابة الأكاديمية (المستشار الذكي، الملتقى العلمي، غرف المذاكرة، ودفع الاشتراكات).</p>
        <div style="text-align:center;">
          <a href="http://localhost:5173/login" class="action-btn">الدخول إلى حسابك الآن</a>
        </div>
      ` : isRejected ? `
        <p style="color: #b91c1c;">إذا كان لديك أي استفسار أو ترغب في تعديل بيانات القيد، يرجى التواصل مع أمانة شؤون الطلاب عبر البريد أو زيارة مقر الرابطة بكلية العلوم.</p>
      ` : `
        <p>طلبك قيد التحقق الأكاديمي وسنقوم بإشعارك فور اكتمال المراجعة.</p>
      `}
    </div>
    <div class="footer">
      <p>رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة | contact@ssa-fscu.org</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailClient = await getTransporter();
    if (!mailClient) return { sent: false };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"رابطة الطلاب السودانيين - كلية العلوم" <no-reply@ssa-fscu.org>',
      to: email,
      subject: `📢 ${statusTitle} | رابطة الطلاب السودانيين - كلية العلوم`,
      html: htmlContent,
    };

    const info = await mailClient.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 [Status Notification Sent] to ${email} (Status: ${newStatus}) Preview: ${previewUrl || 'N/A'}`);
    return { sent: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال بريد تحديث الحالة:', error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * إرسال بريد تحديث حالة إيصال الدفع (اعتماد / رفض)
 */
async function sendPaymentStatusEmail(payment, student, newStatus, adminNotes = '') {
  const email = payment.studentEmail || student?.email;
  const name = payment.studentName || student?.fullName || 'طالبنا العزيز';
  if (!email) return { sent: false };

  const isApproved = newStatus === 'approved';
  const statusArabic = isApproved ? '✅ تم اعتماد إشعار الدفع وتوثيق المعاملة' : '❌ تم رفض إشعار الدفع';
  const statusColor = isApproved ? '#10b981' : '#ef4444';
  const statusBg = isApproved ? '#ecfdf5' : '#fef2f2';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>إشعار المعاملة المالية - رابطة الطلاب السودانيين</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1b2a; margin: 0; padding: 20px; color: #333333; direction: rtl; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #0b3b24 0%, #1d2a45 100%); padding: 28px 20px; text-align: center; color: #ffffff; }
    .body { padding: 28px 22px; }
    .status-badge { display: inline-block; padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 15px 0; border: 1px solid ${statusColor}; color: ${statusColor}; background-color: ${statusBg}; }
    .receipt-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0; color:#ffffff;">رابطة الطلاب السودانيين - كلية العلوم</h2>
      <p style="margin:4px 0 0; color:#d4af37; font-size:13px;">إشعار تسوية المعاملات المالية والاشتراكات</p>
    </div>
    <div class="body">
      <h3>مرحباً ${name}،</h3>
      <p>تمت مراجعة إشعار التحويل المالي المرفوع من قِبلك من خلال الأمانة المالية للرابطة:</p>

      <div style="text-align: center;">
        <span class="status-badge">${statusArabic}</span>
      </div>

      <div class="receipt-box">
        <p style="margin:0 0 6px;"><strong>نوع الفعالية / النشاط:</strong> ${payment.activityType}</p>
        <p style="margin:0 0 6px;"><strong>المبلغ المسدد:</strong> ${payment.amount} جنيه مصري (EGP)</p>
        <p style="margin:0 0 6px;"><strong>رقم العملية / الحوالة:</strong> ${payment.transactionId}</p>
        <p style="margin:0 0 6px;"><strong>طريقة الدفع:</strong> ${payment.paymentMethod}</p>
        ${adminNotes ? `<p style="margin:8px 0 0; padding-top:8px; border-top:1px dashed #cbd5e1; color:#b91c1c;"><strong>ملاحظات الإدارة المالية:</strong> ${adminNotes}</p>` : ''}
      </div>

      <p style="font-size:13px; color:#64748b;">يمكنك متابعة حالة جميع مدفوعاتك وإيصالاتك عبر قسم "المدفوعات والاشتراكات" في البوابة الطلابية.</p>
    </div>
    <div class="footer">
      <p>الأمانة المالية | رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailClient = await getTransporter();
    if (!mailClient) return { sent: false };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"الأمانة المالية - رابطة الطلاب السودانيين" <finance@ssa-fscu.org>',
      to: email,
      subject: `${statusArabic} | معاملة (${payment.transactionId})`,
      html: htmlContent,
    };

    const info = await mailClient.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 [Payment Notification Sent] to ${email} (Status: ${newStatus}) Preview: ${previewUrl || 'N/A'}`);
    return { sent: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال إشعار الدفع:', error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * إرسال بريد الترقية إلى رتبة أدمن أو تعديل الصلاحيات
 */
async function sendRoleUpdateEmail(student, newRole) {
  const { fullName = student.name || 'عضو الرابطة', email, studentId = '' } = student;
  if (!email) return { sent: false };

  const isAdmin = newRole === 'admin';
  const roleTitle = isAdmin ? '🛡️ تهانينا! تم منحك صلاحيات مسؤول النظام (Admin)' : 'ℹ️ تم تعديل رتبتك إلى: عضو / طالب';
  const roleColor = isAdmin ? '#d4af37' : '#3b82f6';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تحديث الصلاحيات والرتبة - رابطة الطلاب السودانيين</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1b2a; margin: 0; padding: 20px; color: #333333; direction: rtl; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #0b3b24 0%, #1d2a45 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
    .body { padding: 30px 25px; }
    .badge { display: inline-block; padding: 10px 22px; border-radius: 20px; font-size: 15px; font-weight: bold; margin: 15px 0; background-color: ${roleColor}; color: #0b3b24; }
    .action-btn { display: inline-block; background: #d4af37; color: #0b3b24 !important; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: bold; font-size: 15px; margin: 15px 0; }
    .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0; color:#ffffff;">رابطة الطلاب السودانيين - كلية العلوم</h2>
      <p style="margin:4px 0 0; color:#d4af37; font-size:13px;">إدارة الصلاحيات والهيئة التنفيذية</p>
    </div>
    <div class="body">
      <h3>مرحباً بالزميل ${fullName}،</h3>
      <p>نود إعلامك بأنه تم تحديث صلاحيات حسابك في بوابة رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة.</p>

      <div style="text-align: center;">
        <span class="badge">${roleTitle}</span>
      </div>

      ${isAdmin ? `
      <p style="line-height: 1.7; color: #2d3748;">
        بصفتك مسؤولاً إدارياً (Admin)، أصبح بإمكانك الآن الوصول إلى لوحة تحكم الإدارة الشاملة (<strong>/admin</strong>)، مراجعة واعتماد طلبات قيد الطلاب، إدارة الإعلانات العاجلة، تصدير بيانات الاستبيان، وتخصيص ثيمات المنصة.
      </p>
      <div style="text-align: center;">
        <a href="http://localhost:5173/admin" class="action-btn">الدخول إلى لوحة تحكم الإدارة</a>
      </div>
      ` : `
      <p style="line-height: 1.7; color: #2d3748;">
        تم ضبط حسابك برتبة عضو / طالب عادي. يمكنك مواصلة استخدام جميع خدمات المنصة الطلابية وغرف المذاكرة والمستشار الأكاديمي الذكي.
      </p>
      `}
    </div>
    <div class="footer">
      <p>الأمانة العامة | رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailClient = await getTransporter();
    if (!mailClient) return { sent: false };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"إدارة رابطة الطلاب السودانيين" <admin@ssa-fscu.org>',
      to: email,
      subject: `${roleTitle} | بوابة رابطة الطلاب السودانيين`,
      html: htmlContent,
    };

    const info = await mailClient.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 [Role Update Notification Sent] to ${email} (Role: ${newRole}) Preview: ${previewUrl || 'N/A'}`);
    return { sent: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال إشعار الرتبة:', error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * إرسال بريد إشعار بالإعلانات والأخبار العاجلة الجديدة للطلاب
 */
async function sendAnnouncementBroadcastEmail(student, announcement) {
  const { fullName = student.name || 'طالبنا العزيز', email } = student;
  if (!email) return { sent: false };

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>إعلان هام وعاجل - رابطة الطلاب السودانيين</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d1b2a; margin: 0; padding: 20px; color: #333333; direction: rtl; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #0b3b24 0%, #1d2a45 100%); padding: 28px 20px; text-align: center; color: #ffffff; }
    .body { padding: 28px 22px; }
    .ann-box { background: #f8fafc; border-right: 4px solid #d4af37; border-radius: 8px; padding: 18px; margin: 18px 0; }
    .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0; color:#ffffff;">📢 إعلان هام وعاجل من إدارة الرابطة</h2>
      <p style="margin:4px 0 0; color:#d4af37; font-size:13px;">رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</p>
    </div>
    <div class="body">
      <h3>مرحباً ${fullName}،</h3>
      <p>أصدرت الهيئة الإدارية للرابطة التنويه التالي:</p>

      <div class="ann-box">
        <h4 style="margin:0 0 8px; color:#0b3b24; font-size:16px;">${announcement.title || 'تنويه عام'}</h4>
        <p style="margin:0; line-height:1.7; color:#334155;">${announcement.content || ''}</p>
        <div style="margin-top:12px; font-size:12px; color:#64748b;">
          التصنيف: <strong>${announcement.category || 'عام'}</strong> | التاريخ: ${new Date().toLocaleDateString('ar-EG')}
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="http://localhost:5173" style="display:inline-block; background:#d4af37; color:#0b3b24; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:bold;">زيارة البوابة والاطلاع على التفاصيل</a>
      </div>
    </div>
    <div class="footer">
      <p>المكتب الإعلامي | رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailClient = await getTransporter();
    if (!mailClient) return { sent: false };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"المكتب الإعلامي - رابطة الطلاب السودانيين" <media@ssa-fscu.org>',
      to: email,
      subject: `📢 تنويه هام: ${announcement.title || 'إعلان من رابطة الطلاب السودانيين'}`,
      html: htmlContent,
    };

    const info = await mailClient.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 [Announcement Notification Sent] to ${email} Preview: ${previewUrl || 'N/A'}`);
    return { sent: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ خطأ أثناء إرسال إشعار الإعلان:', error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendStatusUpdateEmail,
  sendPaymentStatusEmail,
  sendRoleUpdateEmail,
  sendAnnouncementBroadcastEmail,
  getTransporter,
};
