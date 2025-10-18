const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3000, path, method: 'GET', timeout: 2000 };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.end();
  });
}

(async () => {
  const maxAttempts = 20;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const r = await get('/health');
      console.log('UP', r.statusCode, r.body);
      process.exit(0);
    } catch (e) {
      console.error('attempt', i, 'failed:', e && e.message ? e.message : e);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.error('server did not respond after', maxAttempts, 'attempts');
  process.exit(2);
})();
