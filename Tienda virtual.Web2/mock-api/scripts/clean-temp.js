const fs = require('fs');
const path = require('path');

const root = __dirname + '/../';
const backupDir = path.join(root, 'backup-clean-20251017T000000');
const tempFiles = [
  'server.final.js',
  'server.fixed.js',
  'server_backup_corrupt.js',
  'server_clean.js',
  'server_new.js',
  'start_wrapper.js',
  'wrapper.out',
  'server_run.log',
  'server_run.err',
  'server_startup.log',
  'mock-api.log',
  'mock-api.err',
  'endpoints.out',
  'check_until_up.out'
];

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

let moved = 0;
for (const f of tempFiles) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) {
    const dest = path.join(backupDir, f);
    fs.renameSync(p, dest);
    console.log('moved', f);
    moved++;
  }
}

console.log('done. moved files:', moved);
