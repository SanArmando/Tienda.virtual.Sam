const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const db = require('./config/db.config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3001;

// Early startup logging to file to help debugging in this environment
try {
  const startLog = require('path').join(__dirname, 'server_startup.log');
  require('fs').appendFileSync(startLog, `[${new Date().toISOString()}] starting server.launch.js\n`);
} catch (e) {
  // ignore
}

process.on('uncaughtException', (err) => {
  try { require('fs').appendFileSync(require('path').join(__dirname, 'server_startup.err'), `uncaughtException: ${err && err.stack ? err.stack : err}\n`); } catch(e){}
  console.error('uncaughtException', err);
});
process.on('unhandledRejection', (err) => {
  try { require('fs').appendFileSync(require('path').join(__dirname, 'server_startup.err'), `unhandledRejection: ${err && err.stack ? err.stack : err}\n`); } catch(e){}
  console.error('unhandledRejection', err);
});

db.connect()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`mock-api listening on http://localhost:${PORT}`);
      // signal readiness to external checkers
      try {
        const readyPath = require('path').join(__dirname, 'server.ready');
        require('fs').writeFileSync(readyPath, 'ready');
        console.log('SERVER_READY');
      } catch (e) {
        console.warn('Could not write server.ready:', e && e.message ? e.message : e);
      }
    });
    // export server for tests if needed
    module.exports = { app, server };
  })
  .catch((err) => {
    console.error('DB connect failed, starting server anyway (read-only):', err && err.message ? err.message : err);
    app.listen(PORT, () => console.log(`mock-api listening (no DB) on http://localhost:${PORT}`));
  });
