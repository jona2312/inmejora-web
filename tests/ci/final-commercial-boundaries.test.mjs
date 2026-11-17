import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import * as commercial from '../../src/config/commercial.js';
import * as content from '../../src/data/salesContent.js';
import * as consulta from '../../src/utils/consultaMessage.js';
import { localCoreEnabled } from '../../src/lib/projectCoreClient.js';

const BASE = '204a75ffddb23a3f61a129ee9f4f842efe5381e3';
const read = file => readFileSync(new URL('../../' + file, import.meta.url), 'utf8');
const prior = file => execFileSync('git', ['show', BASE + ':' + file], { encoding: 'utf8' });
const PERSONAL = '5491158300611';
const COMMERCIAL = '5491139066429';

test('base reproduction: a configured personal number and a direct URL argument are accepted', async () => {
  const mod = new SourceTextModule(prior('src/config/commercial.js'), { context: createContext({}) });
  await mod.link(() => { throw Error('No imports expected'); }); await mod.evaluate();
  assert.equal(mod.namespace.resolveWhatsapp(PERSONAL, 'production'), PERSONAL);
  assert.equal(mod.namespace.buildWhatsappUrl('', PERSONAL), 'https://wa.me/' + PERSONAL);
});

test('personal suffix is denied in configuration and explicit URL arguments, including formatting', () => {
  for (const number of [PERSONAL, '+54 9 11 5830-0611', '541158300611', '1158300611']) {
    assert.equal(commercial.validWhatsapp(number), '');
    for (const mode of ['production', 'ci', 'project-core-controlled']) assert.equal(commercial.resolveWhatsapp(number, mode), '');
    assert.equal(commercial.buildWhatsappUrl('Consulta sintética', number), null);
  }
  assert.equal(commercial.buildWhatsappUrl('Consulta', ''), null);
  assert.equal(commercial.buildWhatsappUrl('Consulta', 'invalid'), null);
});

test('official configured destination is preserved without manufacturing a delivery or lead', () => {
  assert.equal(commercial.resolveWhatsapp(COMMERCIAL, 'production'), COMMERCIAL);
  assert.equal(commercial.buildWhatsappUrl('', '+54 9 11 3906-6429'), 'https://wa.me/' + COMMERCIAL);
  assert.equal(commercial.resolveWhatsapp('', 'production'), '');
  const source = read('src/components/sales/ConsultaForm.jsx');
  const whatsapp = source.slice(source.indexOf('if (!COMMERCIAL.channelEnabled) return;'), source.indexOf('const copy ='));
  assert.match(whatsapp, /whatsapp_consulta_open/);
  assert.doesNotMatch(whatsapp, /client\.current\.(?:submit|photo)|lead_created|lead_id|fetch\(/);
  assert.match(source, /Todavía no fue enviado/);
});

async function renderForm({ mode = 'project-core-controlled', protocol = 'https:', baseline = false } = {}) {
  const core = localCoreEnabled({ PROD: true, MODE: mode }, { protocol, hostname: 'synthetic.example.invalid' });
  const context = createContext({ URLSearchParams });
  const text = baseline ? prior('src/components/sales/ConsultaForm.jsx') : read('src/components/sales/ConsultaForm.jsx');
  const mod = new SourceTextModule(transformSync(text, { loader: 'jsx', format: 'esm', jsx: 'transform' }).code, { context });
  const synthetic = exports => new SyntheticModule(Object.keys(exports), function () {
    for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
  }, { context });
  const trap = () => { throw Error('Unexpected effect during read-only render'); };
  const icon = () => React.createElement('span', { 'aria-hidden': true });
  await mod.link(name => {
    if (name === 'react') return synthetic({ default: React, useState: React.useState, useEffect: React.useEffect, useRef: React.useRef });
    if (name === 'react-router-dom') return synthetic({ useSearchParams: () => [new URLSearchParams()] });
    if (name === 'lucide-react') return synthetic({ MessageCircle: icon, Copy: icon, Check: icon });
    if (name === '@/config/commercial') return synthetic({ ...commercial, COMMERCIAL: { ...commercial.COMMERCIAL, channelEnabled: true, intakeMode: mode === 'project-core-controlled' ? 'core-controlled' : 'whatsapp' }, buildWhatsappUrl: trap });
    if (name === '@/data/salesContent') return synthetic(content);
    if (name === '@/utils/consultaMessage') return synthetic(consulta);
    if (name === '@/utils/track') return synthetic({ track: trap });
    if (name === '@/lib/projectCoreClient') return synthetic({ localCoreEnabled: () => core, createProjectCoreClient: () => ({ initialize: trap, submit: trap, photo: trap }) });
    if (name === '@/components/ProjectThread' || name === '@/components/renders/RenderGallerySection') return synthetic({ default: trap });
    throw Error('Unexpected dependency ' + name);
  });
  await mod.evaluate();
  return renderToStaticMarkup(React.createElement(mod.namespace.default));
}

test('base reproduction: controlled artifact over HTTP silently becomes a WhatsApp form', async () => {
  const html = await renderForm({ protocol: 'http:', baseline: true });
  assert.match(html, /Continuar por WhatsApp/); assert.doesNotMatch(html, /core-blocked/);
});

for (const protocol of ['http:', 'file:', 'data:']) test('controlled artifact fails closed over ' + protocol + ', no WhatsApp substitute', async () => {
  const html = await renderForm({ protocol });
  assert.match(html, /data-channel="core-blocked"/); assert.match(html, /HTTPS/);
  assert.doesNotMatch(html, /<form|<input|type="submit"|wa\.me|Continuar por WhatsApp|Consulta guardada/);
});

test('HTTPS keeps the canonical controlled form, private photos and human review', async () => {
  const html = await renderForm();
  assert.match(html, /Guardar consulta/); assert.match(html, /Fotos privadas \(hasta 4, máximo 2 MB cada una\)/);
  assert.match(html, /id="consulta-medidas"/); assert.match(html, /Email de contacto/);
  assert.match(html, /confirmación aparece sólo después de persistirlas/);
  assert.doesNotMatch(html, /Continuar por WhatsApp|core-blocked|Consulta guardada/);
});

test('ordinary WhatsApp funnel retains truthful unsent status without calling Core', async () => {
  const html = await renderForm({ mode: 'production' });
  assert.match(html, /Continuar por WhatsApp/);
  assert.match(html, /llega a INMEJORA cuando la enviás desde WhatsApp/);
  assert.doesNotMatch(html, /Guardar consulta|Consulta guardada/);
});

test('reachable prices copy does not advertise unaccredited fulfillment or payment', () => {
  const text = read('src/components/pricing/TrustSection.jsx');
  assert.doesNotMatch(text, /precisión milimétrica|sin sorpresas|precios.*actualizados|lista para entregar|resultados óptimos/);
  assert.match(text, /no está habilitada para uso comercial/);
  assert.match(text, /compras y las suscripciones siguen deshabilitadas/);
  assert.match(text, /aprobación humana/);
  assert.match(read('src/pages/PricingPage.jsx'), /No hay compras ni suscripciones activadas/);
});

test('legacy project CTA uses the shared validator and never opens a missing destination', () => {
  const text = read('src/utils/whatsappUtils.js');
  assert.match(text, /buildWhatsappUrl/); assert.match(text, /if \(url\) window\.open/);
  assert.doesNotMatch(text, /wa\.me/);
});
