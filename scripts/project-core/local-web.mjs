import http from 'node:http';
import { createServer } from 'vite';
import { resolve } from 'node:path';
import baseConfig from '../../vite.config.js';

export function assertLocalOrigin(value) {
  const u = new URL(value);
  if (u.protocol !== 'http:' || u.hostname !== '127.0.0.1' || !u.port || u.origin !== value || u.username || u.password)
    throw new Error('PROJECT_CORE_LOOPBACK_REQUIRED');
  return u;
}
export async function startLocalWeb({coreOrigin, root, port}) {
  if (process.env.NODE_ENV === 'production') throw new Error('LOCAL_ONLY');
  const target = assertLocalOrigin(coreOrigin);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('LOCAL_PORT_REQUIRED');
  const origin = `http://127.0.0.1:${port}`;
  const bridge = {
    name: 'local-project-core-http-bridge',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const fail = (status, error) => {res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({error}));};
        if (req.headers.host !== new URL(origin).host) return fail(403, 'LOCAL_HOST_DENIED');
        if (req.url.startsWith('/__legacy_disabled')) return fail(503, 'LEGACY_NOT_CONNECTED');
        if (!req.url.startsWith('/api/v1/')) return next();
        if ((req.headers.origin && req.headers.origin !== origin) || (!['GET', 'HEAD'].includes(req.method) && req.headers.origin !== origin))
          return fail(403, 'LOCAL_ORIGIN_DENIED');
        // Transport-only bridge: no identity resolution, storage or business operations here.
        const upstream = http.request({hostname: '127.0.0.1', port: target.port, path: req.url, method: req.method,
          headers: {...req.headers, host: target.host, ...(req.headers.origin ? {origin: coreOrigin} : {})}}, incoming => {
          res.writeHead(incoming.statusCode, {...incoming.headers, 'cache-control': 'no-store'}); incoming.pipe(res);
        });
        upstream.setTimeout(10000, () => upstream.destroy());
        upstream.on('error', () => {if (!res.headersSent) fail(503, 'CORE_UNAVAILABLE'); else res.destroy();});
        req.on('aborted', () => upstream.destroy()); req.pipe(upstream);
      });
    },
    transformIndexHtml() {
      return [{tag: 'meta', attrs: {'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src 'none'; media-src 'self'; form-action 'self'"}, injectTo: 'head-prepend'}];
    },
  };
  const server = await createServer({...baseConfig, root: resolve(root), configFile: false, envFile: false, mode: 'project-core-local',
    plugins: [...baseConfig.plugins, bridge],
    define: {'import.meta.env.VITE_API_URL': JSON.stringify(origin + '/__legacy_disabled'),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(origin + '/__legacy_disabled/supabase'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('synthetic-not-a-credential')},
    server: {host: '127.0.0.1', port, strictPort: true, hmr: false, fs: {allow: [resolve(root)]}},
  });
  await server.listen();
  return {origin, close: () => server.close()};
}
