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

    // Call without token
    const resWithoutToken = await fetch('http://localhost:3001/api/courses/on-thi-vstep-b1/modules', {
      method: 'GET'
    });
    console.log('Without Token status:', resWithoutToken.status);
    console.log('Without Token body:', await resWithoutToken.json());

    // Call with token
    if (token) {
      const resWithToken = await fetch('http://localhost:3001/api/courses/on-thi-vstep-b1/modules', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('With Token status:', resWithToken.status);
      console.log('With Token body:', await resWithToken.json());
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

test();
