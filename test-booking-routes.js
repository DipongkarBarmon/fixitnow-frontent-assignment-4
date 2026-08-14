const http = require('http');

function checkOptions(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'OPTIONS'
    }, (res) => {
      resolve({ path, status: res.statusCode, methods: res.headers['access-control-allow-methods'] });
    });
    req.on('error', (e) => resolve({ path, error: e.message }));
    req.end();
  });
}

async function run() {
  const res = await checkOptions('/api/technician/accept-booking/123');
  console.log(res);
}
run();
