// start_wrapper.js — require server.launch.js and wait a bit so it can start
require('./server.launch.js');
setTimeout(() => {
  // after waiting, print existence of server.ready and exit
  const fs = require('fs');
  const path = require('path');
  const ready = path.join(__dirname, 'server.ready');
  if (fs.existsSync(ready)) {
    console.log('READY_FILE_EXISTS');
    console.log(fs.readFileSync(ready, 'utf8'));
  } else {
    console.log('READY_FILE_MISSING');
    try {
      const log = fs.readFileSync(path.join(__dirname, 'server_run.log'), 'utf8');
      console.log('--- server_run.log ---');
      console.log(log);
    } catch (e) {
      // ignore
    }
    try {
      const err = fs.readFileSync(path.join(__dirname, 'server_run.err'), 'utf8');
      console.log('--- server_run.err ---');
      console.log(err);
    } catch (e) {
      // ignore
    }
  }
  process.exit(0);
}, 6000);
