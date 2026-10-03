export function offlineBuildOptions(baseConfig) {
  return {
    ...baseConfig,
    configFile: false,
    envFile: false,
    mode: 'ci',
    define: {
      ...baseConfig.define,
      'import.meta.env.VITE_API_URL': JSON.stringify('https://api.example.invalid'),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://supabase.example.invalid'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('synthetic-not-a-credential'),
      // Synthetic placeholder for CI/browser tests only. CI_COMMERCIAL_WHATSAPP='' builds the fail-closed (disabled) variant.
      'import.meta.env.VITE_COMMERCIAL_WHATSAPP': JSON.stringify(process.env.CI_COMMERCIAL_WHATSAPP ?? '5491100000000'),
    },
  };
}
