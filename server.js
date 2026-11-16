/**
 * The Red Box - Node.js Localhost Application Server
 * Serves static assets on http://localhost:8080 with CORS and MIME handling.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let cleanUrl = req.url.split('?')[0];

  // API Endpoints
  if (req.method === 'GET' && (cleanUrl === '/api/homepage' || cleanUrl === '/api/homepage-content')) {
    const homepagePath = path.join(ROOT, 'data', 'homepage_content.json');
    if (fs.existsSync(homepagePath)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      fs.createReadStream(homepagePath).pipe(res);
      return;
    }
  }

  if (req.method === 'POST' && (cleanUrl === '/api/homepage' || cleanUrl === '/api/homepage-content')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const homepagePath = path.join(ROOT, 'data', 'homepage_content.json');
        fs.mkdirSync(path.dirname(homepagePath), { recursive: true });
        fs.writeFileSync(homepagePath, JSON.stringify(data, null, 2), 'utf-8');
        if (data.heroSlider) {
          const slidesPath = path.join(ROOT, 'data', 'slides.json');
          fs.writeFileSync(slidesPath, JSON.stringify(data.heroSlider, null, 2), 'utf-8');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', message: 'Homepage content saved successfully' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && (cleanUrl === '/api/slides' || cleanUrl === '/api/slider')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const slides = JSON.parse(body);
        const slidesPath = path.join(ROOT, 'data', 'slides.json');
        fs.mkdirSync(path.dirname(slidesPath), { recursive: true });
        fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', count: slides.length }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  if (cleanUrl === '/') cleanUrl = '/index.html';
  if (cleanUrl === '/admin' || cleanUrl === '/admin/' || cleanUrl === '/admin/dashboard') cleanUrl = '/admin.html';
  if (cleanUrl === '/about' || cleanUrl === '/about/' || cleanUrl === '/about-us' || cleanUrl === '/story' || cleanUrl === '/thebox' || cleanUrl === '/the-box') cleanUrl = '/about.html';
  if (cleanUrl === '/branches' || cleanUrl === '/branches/' || cleanUrl === '/outlets' || cleanUrl === '/outlets/' || cleanUrl === '/locations') cleanUrl = '/branches.html';

  const filePath = path.join(ROOT, decodeURIComponent(cleanUrl));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`<h1>404 - Not Found</h1><p>The requested file ${cleanUrl} does not exist.</p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('='.repeat(60));
  console.log('   THE RED BOX - LOCALHOST NODE.JS SERVER');
  console.log(`   Running at: ${url}`);
  console.log('   Press Ctrl+C to terminate.');
  console.log('='.repeat(60));

  // Open browser based on OS
  const openCmd = process.platform === 'win32' ? `start ${url}` :
                  process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  exec(openCmd);
});
