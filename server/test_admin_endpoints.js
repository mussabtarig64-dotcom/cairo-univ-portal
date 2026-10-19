const app = require('./server');
const http = require('http');

async function runTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/admin`;
  console.log(`🚀 Test server running on port ${port}`);

  let allPassed = true;

  try {
    // 1. Test GET /pending with admin token
    console.log('\n--- 1. Testing GET /pending with admin token ---');
    const res1 = await fetch(`${baseUrl}/pending`, {
      headers: {
        Authorization: 'Bearer ssa_token_admin_test123',
        Origin: 'https://cairo-univ-portal.com',
      },
    });
    const data1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('CORS Allow-Origin:', res1.headers.get('access-control-allow-origin'));
    console.log('Success:', data1.success, '| Students length:', data1.students?.length);
    if (res1.status !== 200 || !Array.isArray(data1.students)) {
      console.error('❌ Test 1 failed');
      allPassed = false;
    } else {
      console.log('✅ Test 1 passed');
    }

    // 2. Test GET /students with admin token
    console.log('\n--- 2. Testing GET /students with admin token ---');
    const res2 = await fetch(`${baseUrl}/students`, {
      headers: {
        Authorization: 'Bearer ssa_token_admin_test123',
        Origin: 'http://localhost:5173',
      },
    });
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('CORS Allow-Origin:', res2.headers.get('access-control-allow-origin'));
    console.log('Success:', data2.success, '| Students length:', data2.students?.length);
    if (res2.status !== 200 || !Array.isArray(data2.students)) {
      console.error('❌ Test 2 failed');
      allPassed = false;
    } else {
      console.log('✅ Test 2 passed');
    }

    // 3. Test GET /pending without token (fallback / safe behavior)
    console.log('\n--- 3. Testing GET /pending without token ---');
    const res3 = await fetch(`${baseUrl}/pending`, {
      headers: {
        Origin: 'https://cairo-univ-app.vercel.app',
      },
    });
    const data3 = await res3.json();
    console.log('Status:', res3.status);
    console.log('CORS Allow-Origin:', res3.headers.get('access-control-allow-origin'));
    console.log('Success:', data3.success, '| Array returned:', Array.isArray(data3.students));
    if (!Array.isArray(data3.students)) {
      console.error('❌ Test 3 failed: students should be an array');
      allPassed = false;
    } else {
      console.log('✅ Test 3 passed');
    }

    // 4. Test with invalid/expired JWT token (Task 3: handle invalid/expired tokens gracefully with 401/403)
    console.log('\n--- 4. Testing with invalid JWT token ---');
    const res4 = await fetch(`${baseUrl}/pending`, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        Origin: 'https://cairo-univ-portal.com',
      },
    });
    const data4 = await res4.json();
    console.log('Status:', res4.status);
    console.log('CORS Allow-Origin:', res4.headers.get('access-control-allow-origin'));
    console.log('Success:', data4.success, '| Message:', data4.message, '| Students:', data4.students);
    if (res4.status !== 401 || data4.success !== false || !Array.isArray(data4.students)) {
      console.error('❌ Test 4 failed: should return 401 with students: []');
      allPassed = false;
    } else {
      console.log('✅ Test 4 passed');
    }

    // 5. Test OPTIONS preflight request (CORS)
    console.log('\n--- 5. Testing OPTIONS preflight CORS ---');
    const res5 = await fetch(`${baseUrl}/pending`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://cairo-univ-portal.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization, Content-Type',
      },
    });
    console.log('Status:', res5.status);
    console.log('CORS Allow-Origin:', res5.headers.get('access-control-allow-origin'));
    console.log('CORS Allow-Methods:', res5.headers.get('access-control-allow-methods'));
    if (res5.status !== 200 || !res5.headers.get('access-control-allow-origin')) {
      console.error('❌ Test 5 failed');
      allPassed = false;
    } else {
      console.log('✅ Test 5 passed');
    }

    // 6. Test GET /students with search parameter containing special regex characters
    console.log('\n--- 6. Testing GET /students with regex special chars in search ---');
    const res6 = await fetch(`${baseUrl}/students?search=${encodeURIComponent('test(special*char[')}`, {
      headers: {
        Authorization: 'Bearer ssa_token_admin_test123',
      },
    });
    const data6 = await res6.json();
    console.log('Status:', res6.status);
    console.log('Success:', data6.success, '| Students array:', Array.isArray(data6.students));
    if (res6.status !== 200 || !Array.isArray(data6.students)) {
      console.error('❌ Test 6 failed');
      allPassed = false;
    } else {
      console.log('✅ Test 6 passed');
    }

  } catch (err) {
    console.error('❌ Unexpected test error:', err);
    allPassed = false;
  } finally {
    server.close();
  }

  if (allPassed) {
    console.log('\n🎉 ALL ADMIN ROUTE TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests();
