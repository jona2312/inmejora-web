export const origin = 'http://127.0.0.1:4173';
export const launchOptions = {
  args: ['--disable-background-networking', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost'],
  proxy: { server: 'http://127.0.0.1:9', bypass: '127.0.0.1,localhost' },
};
export async function isolate(context) {
  const evidence = { requests: [], forbidden: [], unexpected: [], responses: {} };
  await context.routeWebSocket('**/*', socket => { evidence.forbidden.push('WebSocket ' + socket.url()); socket.close(); });
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const entry = { url: url.href, method: request.method(), authorization: request.headers().authorization || null };
    evidence.requests.push(entry);
    if (url.origin === origin && request.method() === 'GET' && url.pathname.startsWith('/assets/')) { await route.continue(); return; }
    if (/Bearer (local-|fixture-client|fixture-supplier)/i.test(entry.authorization || '') || /\/auth\/(login|register)|supplier.*(login|register)|checkout|mercadopago|stripe|create.preference|\/payments?\//i.test(url.pathname + url.hostname) && request.resourceType() !== 'document') {
      evidence.forbidden.push(entry); await route.abort(); return;
    }
    if (url.origin === origin && !url.pathname.startsWith('/api/')) { await route.continue(); return; }
    if (request.resourceType() === 'image') {
      await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#303a40"/><text x="30" y="240" fill="white">Imagen sintética — prueba aislada</text></svg>' }); return;
    }
    if (request.resourceType() === 'font' || url.hostname === 'fonts.googleapis.com') { await route.fulfill({ body: '', contentType: 'text/css' }); return; }
    if (['www.googletagmanager.com', 'www.clarity.ms'].includes(url.hostname) && request.resourceType() === 'script') { await route.fulfill({ body: '/* analytics disabled in isolated regression */', contentType: 'text/javascript' }); return; }
    let fixture;
    const publicPaths = ['/rest/v1/presupuestos_publicos', '/api/webhook/guardar-mensaje', '/rest/v1/servicios_precios', '/api/horizon/catalogo/colores', '/api/horizon/catalogo/productos'];
    if (publicPaths.includes(url.pathname) && evidence.responses[url.pathname]) { await route.fulfill(evidence.responses[url.pathname]); return; }
    if (url.pathname === '/api/horizon/health') fixture = { ok: true };
    if (/^\/rest\/v1\/(zonas|servicios_precios|tarifas_mano_obra)$/.test(url.pathname)) fixture = [];
    if (/^\/api\/horizon\/catalogo\/(colores|productos)$/.test(url.pathname)) fixture = { colors: [], products: [] };
    if (fixture !== undefined && request.method() === 'GET') { await route.fulfill({ json: fixture }); return; }
    evidence.unexpected.push(entry);
    await route.fulfill({ status: 503, json: { error: 'Servicio no disponible: fixture aislado' } });
  });
  return evidence;
}
