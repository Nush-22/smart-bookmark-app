#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const callbackDir = path.join(__dirname, 'src/app/auth/callback');
try {
  if (fs.existsSync(callbackDir)) {
    fs.rmSync(callbackDir, { recursive: true, force: true });
    console.log('Deleted:', callbackDir);
  }
} catch (err) {
  console.error('Error deleting callback directory:', err);
}
