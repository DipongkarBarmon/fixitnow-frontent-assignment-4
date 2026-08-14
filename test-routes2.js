const http = require('http');

http.get('http://localhost:5000/api/availability/get-all-availability?technicianId=123', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data.substring(0, 200)));
});
