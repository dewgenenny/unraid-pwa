import http from 'http';
import fs from 'fs';
import path from 'path';

export default function express() {
  const routes = { POST: {} };
  const middleware = [];

  function app(req, res) {
    res.status = code => { res.statusCode = code; return res; };
    res.set = (field, value) => { res.setHeader(field, value); return res; };
    res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
    res.send = data => { if (typeof data === 'object') { res.setHeader('Content-Type', 'application/json'); data = JSON.stringify(data); } res.end(data); };
    let i = 0;
    function next(err) {
      if (err) {
        res.statusCode = 500;
        return res.end(err.message);
      }
      const m = middleware[i++];
      if (m) return m(req, res, next);
      const handler = routes[req.method] && routes[req.method][req.url];
      if (handler) return handler(req, res);
      res.statusCode = 404;
      res.end('Not Found');
    }
    next();
  }

  app.use = fn => middleware.push(fn);
  app.post = (route, fn) => { routes.POST[route] = fn; };
  app.listen = (port, cb) => http.createServer(app).listen(port, cb);
  return app;
}

export function json() {
  return (req, res, next) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { req.body = JSON.parse(body || '{}'); } catch { req.body = {}; }
      next();
    });
  };
}

export function staticMiddleware(dir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.wasm': 'application/wasm',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const file = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(dir, file);
    fs.readFile(filePath, (err, data) => {
      if (err) return next();
      const ext = path.extname(filePath);
      const type = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', type);
      res.end(data);
    });
  };
}
