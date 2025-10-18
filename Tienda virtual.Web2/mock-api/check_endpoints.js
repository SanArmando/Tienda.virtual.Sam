const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3000, path, method: 'GET' };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const h = await get('/health');
    console.log('/health', h.statusCode, h.body);
  } catch (e) {
    console.error('/health error', e && e.stack ? e.stack : e);
  }
  try {
    const u = await get('/api/usuarios');
    console.log('/api/usuarios', u.statusCode, u.body);
  } catch (e) {
    console.error('/api/usuarios error', e && e.stack ? e.stack : e);
  }
})();
