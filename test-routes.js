const http = require('http');

const candidatePaths = [
  '/api/availability/123',
  '/api/availabilities/123',
  '/api/availability/get-availability-by-technician/123',
  '/api/availability/technician/123',
  '/api/availability/get-all-availability',
  '/api/availabilities/get-all-availability',
  '/api/service/get-all-service'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data: data.substring(0, 100) }));
    }).on('error', (e) => resolve({ path, status: 'ERROR', error: e.message }));
  });
}

async function run() {
  for (const path of candidatePaths) {
    const res = await checkRoute(path);
    console.log(`${res.status} - ${res.path} - ${res.data}`);
  }
}
run();
