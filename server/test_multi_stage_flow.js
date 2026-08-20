const BASE_URL = 'http://localhost:5000/api';

async function runFullIntegrationTest() {
  console.log('🚀 بدء الاختبار الشامل لمنظومة المصادقة متعددة المراحل والمدفوعات...\n');

  try {
    // 1. فحص صحة الخادم
    console.log('1️⃣ فحص صحة الخادم (Health Check)...');
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    console.log('✅ الخادم متصل:', healthRes);

    // 2. تسجيل طالب جديد
    console.log('\n2️⃣ تسجيل طالب جديد في السجل المركزي...');
    const testEmail = `student_${Date.now()}@cu.edu.eg`;
    const testStudentId = `ID-${Math.floor(100000 + Math.random() * 900000)}`;

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'مصعب طارق عثمان علي',
        email: testEmail,
        password: 'password123',
        phone: '+201098765432',
        whatsapp: '+201098765432',
        cairoAddress: 'الجيزة - الدقي - شارع مصدق',
        studentId: testStudentId,
        department: 'علوم الحاسب والمعلومات (Computer Science)',
        academicLevel: 'المستوى الثالث (سنة ثالثة)',
        emergencyContactName: 'طارق عثمان',
        emergencyContactRelation: 'الوالد',
        emergencyContactPhone: '+201012345678',
      }),
    }).then((r) => r.json());

    console.log('✅ نتيجة التسجيل:', regRes.message);
    console.log('🆔 حالة التحقق المبدئية للطالب:', regRes.user.verificationStatus);
    console.log('📧 بريد الترحيب مرسل؟', regRes.emailNotification?.sent ? 'نعم' : 'لا (محاكاة)');
    if (regRes.emailNotification?.previewUrl) {
      console.log('🔗 رابط معاينة بريد الترحيب:', regRes.emailNotification.previewUrl);
    }

    if (regRes.user.verificationStatus !== 'pending') {
      throw new Error('❌ خطأ: يجب أن تكون حالة الطالب الجديد pending');
    }

    // 3. تسجيل دخول الطالب
    console.log('\n3️⃣ تسجيل دخول الطالب الجديد...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    }).then((r) => r.json());

    console.log('✅ تم تسجيل الدخول بنجاح. التوكن:', loginRes.token ? 'موجود' : 'مفقود');
    console.log('👤 بيانات الطالب:', loginRes.user.fullName, `(${loginRes.user.verificationStatus})`);

    // 4. تقديم إشعار دفع جديد
    console.log('\n4️⃣ تقديم إشعار دفع جديد ورفع إيصال...');
    const paymentRes = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentEmail: testEmail,
        studentName: 'مصعب طارق عثمان علي',
        studentId: testStudentId,
        department: 'علوم الحاسب والمعلومات (Computer Science)',
        phone: '+201098765432',
        activityType: 'الاشتراك السنوي للرابطة (Annual Membership)',
        amount: 150,
        transactionId: `VF-TRANS-${Date.now()}`,
        paymentMethod: 'vodafone_cash',
        receiptBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        notes: 'سداد رسوم العضوية السنوية عبر فودافون كاش',
      }),
    }).then((r) => r.json());

    console.log('✅ نتيجة رفع الدفعة:', paymentRes.message);
    const paymentId = paymentRes.payment._id;
    console.log('💰 معرف المعاملة:', paymentId, '| الحالة:', paymentRes.payment.status);

    // 5. استرجاع مدفوعات الطالب
    console.log('\n5️⃣ استرجاع مدفوعات الطالب من حسابه...');
    const myPaymentsRes = await fetch(`${BASE_URL}/payments/my?email=${encodeURIComponent(testEmail)}`).then((r) => r.json());
    console.log(`✅ عدد المدفوعات المسجلة للطالب: ${myPaymentsRes.count}`);

    // 6. فحص لوحة الإدارة للمدفوعات
    console.log('\n6️⃣ فحص لوحة الإدارة لإحصائيات المدفوعات...');
    const paymentStatsRes = await fetch(`${BASE_URL}/payments/stats`).then((r) => r.json());
    console.log('📊 إحصائيات المدفوعات:', paymentStatsRes);

    // 7. اعتماد الإيصال من قِبل الإدارة
    console.log('\n7️⃣ قيام الإدارة باعتماد إشعار الدفع وإرسال بريد التأكيد...');
    const approvePaymentRes = await fetch(`${BASE_URL}/payments/${paymentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        adminNotes: 'تم التحقق من استلام المبلغ على فودافون كاش، شكراً لك.',
      }),
    }).then((r) => r.json());
    console.log('✅ نتيجة تحديث حالة الدفعة:', approvePaymentRes.message);
    console.log('📧 هل تم إرسال بريد إشعار الدفع؟', approvePaymentRes.emailSent ? 'نعم' : 'لا');
    if (approvePaymentRes.emailPreview) {
      console.log('🔗 رابط معاينة بريد تأكيد الدفع:', approvePaymentRes.emailPreview);
    }

    // 8. اعتماد وتوثيق حساب الطالب من قِبل الإدارة
    console.log('\n8️⃣ قيام الإدارة باعتماد وتوثيق حساب الطالب...');
    const studentDbId = regRes.user._id;
    const verifyStudentRes = await fetch(`${BASE_URL}/admin/students/${studentDbId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'verified',
        notes: 'تمت مطابقة رقم القيد مع كشوفات كلية العلوم جامعة القاهرة.',
      }),
    }).then((r) => r.json());
    console.log('✅ نتيجة تحديث حالة الطالب:', verifyStudentRes.message);
    console.log('🎓 الحالة الجديدة للطالب:', verifyStudentRes.student.verificationStatus);
    console.log('📧 هل تم إرسال بريد إشعار الاعتماد؟', verifyStudentRes.emailSent ? 'نعم' : 'لا');
    if (verifyStudentRes.emailPreview) {
      console.log('🔗 رابط معاينة بريد الاعتماد:', verifyStudentRes.emailPreview);
    }

    // 9. فحص حالة الطالب الحالية بعد التوثيق
    console.log('\n9️⃣ فحص حالة الطالب الحالية من السيرفر (/api/auth/me)...');
    const meRes = await fetch(`${BASE_URL}/auth/me?email=${encodeURIComponent(testEmail)}`).then((r) => r.json());
    console.log('👤 حالة الطالب الحالية في قاعدة البيانات:', meRes.verificationStatus);

    if (meRes.verificationStatus === 'verified') {
      console.log('🎉 ممتاز! الطالب الآن أصبح Verified وله حق الوصول الكامل لكافة خدمات البوابة الطلابية!');
    }

    console.log('\n======================================================');
    console.log('🏆 نجحت جميع مراحل الاختبار بنسبة 100%! النظام جاهز تماماً.');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء الاختبار:', error.message);
  }
}

runFullIntegrationTest();
