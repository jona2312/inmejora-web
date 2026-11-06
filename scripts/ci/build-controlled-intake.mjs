import './offline-guard.mjs';
import { offlineBuildOptions } from './build-options.mjs';
import { fileURLToPath } from 'node:url';

// No inherited client configuration, .env, token or credential enters this artifact.
for (const key of Object.keys(process.env)) if (key.startsWith('VITE_')) delete process.env[key];
const root = fileURLToPath(new URL('../../', import.meta.url));
const { build } = await import('vite');
const { default: config } = await import('../../vite.config.js');
const options = offlineBuildOptions(config);
await build({
  ...options, root, envDir:false, mode:'project-core-controlled',
  define:{...options.define,'import.meta.env.VITE_COMMERCIAL_WHATSAPP':JSON.stringify('')},
  build:{...options.build,outDir:'dist-controlled'},
});
