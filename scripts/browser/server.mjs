import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
export function startServer() {
  const server = http.createServer(async (req, res) => {
    const requested = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!requested.startsWith(root + path.sep) && requested !== root) { res.writeHead(403).end(); return; }
    let file = requested;
    let body;
    try { body = await readFile(file); } catch { file = path.join(root, 'index.html'); body = await readFile(file); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(body);
  });
  return new Promise(resolve => server.listen(4173, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1]?.endsWith('server.mjs')) { await startServer(); console.log('Local fixture build: http://127.0.0.1:4173'); }
