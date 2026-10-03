import './offline-guard.mjs';
import { offlineBuildOptions } from './build-options.mjs';

// Vite also reads inherited VITE_* variables; exclude them before importing tools.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('VITE_')) delete process.env[key];
}

const { build } = await import('vite');
const { default: config } = await import('../../vite.config.js');
const options = offlineBuildOptions(config);
// CI_OUT_DIR lets the fail-closed browser variant build next to the normal dist.
await build({ ...options, build: { ...options.build, outDir: process.env.CI_OUT_DIR ?? options.build?.outDir } });
