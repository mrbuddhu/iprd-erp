// Cross-platform file copy script for build
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');

// Copy .htaccess if exists
const htaccessSrc = path.join(publicDir, '.htaccess');
const htaccessDest = path.join(buildDir, '.htaccess');
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
  console.log('✅ Copied .htaccess');
}

// Copy sw.js
const swSrc = path.join(publicDir, 'sw.js');
const swDest = path.join(buildDir, 'sw.js');
if (fs.existsSync(swSrc)) {
  fs.copyFileSync(swSrc, swDest);
  console.log('✅ Copied sw.js');
} else {
  console.log('⚠️  sw.js not found in public folder');
}

console.log('✅ Build files copied successfully!');

