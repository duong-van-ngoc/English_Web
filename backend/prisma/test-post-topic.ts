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

    const payload = {
      name: "Environment Test",
      description: "Mô tả của Environment Test",
      imageUrl: "",
      icon: "eco",
      level: "B1",
      status: "DRAFT",
      moduleId: ""
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const postRes = await fetch('http://localhost:3001/api/admin/courses/on-thi-vstep-b1/vocabulary-topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response Status Code:', postRes.status);
    const body = await postRes.json();
    console.log('Response Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

test();
