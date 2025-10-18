const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const db = require('./config/db.config');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend assets (if any)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount API routes (usuarios)
const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

// Fallback: serve index.html if exists (for SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Not found');
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`mock-api listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed, starting server anyway (read-only):', err && err.message ? err.message : err);
    app.listen(PORT, () => {
      console.log(`mock-api listening (no DB) on http://localhost:${PORT}`);
    });
  });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const db = require('./config/db.config');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend assets (if any)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount API routes (usuarios)
const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

// Fallback: serve index.html if exists (for SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Not found');
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`mock-api listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed, starting server anyway (read-only):', err && err.message ? err.message : err);
    app.listen(PORT, () => {
      console.log(`mock-api listening (no DB) on http://localhost:${PORT}`);
    });
  });
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes');
const db = require('./config/db.config');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use('/api/usuarios', usuarioRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve static public folder for frontend assets (if present)
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// SPA fallback to index.html when present
app.get('*', (req, res, next) => {
  const indexHtml = path.join(publicPath, 'index.html');
  if (req.method === 'GET' && req.accepts('html') && fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  next();
});

const PORT = process.env.PORT || 3000;

// Start server after DB connection (db.connect returns a Promise)
db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`mock-api listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB, starting server anyway (read-only mode):', err && err.message ? err.message : err);
    // Start server anyway to serve static assets / mock read-only endpoints
    app.listen(PORT, () => {
      console.log(`mock-api listening (no DB) on http://localhost:${PORT}`);
    });
  });
