import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: '12345678'
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('Got token:', token ? 'Yes' : 'No');
    
    const endpoints = [
      '/api/admin/get-all-booking',
      '/api/admin/get-all-bookings',
      '/api/booking/get-all-booking',
      '/api/booking/get-all-bookings',
      '/api/booking/get-all',
      '/api/booking',
      '/api/bookings',
      '/api/technician/get-all-booking',
      '/api/booking/get-user-booking'
    ];
    
    for (const ep of endpoints) {
      try {
        const res = await axios.get(`http://localhost:5000${ep}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`[SUCCESS] ${ep} - returned:`, typeof res.data, Array.isArray(res.data.data) ? res.data.data.length + ' items' : (res.data.data ? 'data object' : res.data));
      } catch (err) {
        console.log(`[FAIL] ${ep} - ${err.response?.status} ${err.response?.statusText}`);
      }
    }
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
  }
}
test();
