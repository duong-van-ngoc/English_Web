import 'dotenv/config';

async function test() {
  try {
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const loginData = await loginRes.json() as any;
    const token = loginData.data?.accessToken;
    console.log('Token is obtained:', !!token);

    if (!token) {
      console.log('Login failed:', loginData);
      return;
    }

    const patchRes = await fetch('http://localhost:3001/api/courses/cmq1s9xb900189s7kgbhoqkxm/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    
    console.log('Response Status Code:', patchRes.status);
    const body = await patchRes.json();
    console.log('Response Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

test();
