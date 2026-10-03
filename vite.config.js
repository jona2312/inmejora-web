// chore: trigger redeploy
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { validWhatsapp } from './src/config/commercial.js';

// Fail-closed publication gate: a production build must carry a valid commercial WhatsApp number.
// There is no fallback to a provisional/personal number; the build stops instead.
const requireCommercialWhatsapp = () => ({
  name: 'require-commercial-whatsapp',
  configResolved(config) {
    if (config.mode !== 'production') return;
    if (!validWhatsapp(config.env.VITE_COMMERCIAL_WHATSAPP)) {
      throw new Error('COMMERCIAL_WHATSAPP_REQUIRED: set VITE_COMMERCIAL_WHATSAPP (country code + number, digits only, 10-15 digits) as a build variable. Production builds do not fall back to any number.');
    }
  },
});

export default defineConfig({
  plugins: [react(), requireCommercialWhatsapp()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
