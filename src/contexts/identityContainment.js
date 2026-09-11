// P0 containment, not authentication. Web has no verified compatible client or
// supplier session contract. Do not restore authority from browser-owned data.
export const clientAuthBlocked = Object.freeze({
  success: false,
  ok: false,
  code: 'CLIENT_AUTH_BLOCKED',
  error: 'El acceso de clientes y la gestión de cuentas están temporalmente no disponibles. No se realizó la operación.',
});

export const supplierAuthBlocked = Object.freeze({
  success: false,
  ok: false,
  code: 'SUPPLIER_AUTH_BLOCKED',
  error: 'El acceso y el alta de proveedores están temporalmente no disponibles. No se realizó la operación.',
});

export const denyClientAuth = async () => clientAuthBlocked;
export const denySupplierAuth = async () => supplierAuthBlocked;

// Removing this tab's historical cache is not server-side logout/revocation.
// The denied identity does not depend on storage being accessible or clearing it.
function clearLocalKeys(keys) {
  let cacheCleared = true;
  for (const key of keys) {
    try { globalThis.localStorage.removeItem(key); }
    catch { cacheCleared = false; }
  }
  return Object.freeze({ scope: 'browser-only', cacheCleared, serverRevocationVerified: false });
}

export const clearClientCache = () => clearLocalKeys(['inmejora_token', 'inmejora_user']);
export const clearSupplierCache = () => clearLocalKeys(['supplier_token', 'supplier_data']);

// No credential can be obtained from this blocked flow. In particular a user ID,
// a cached JWT-shaped string or the public Supabase project key is not accepted.
export const getClientCredential = () => null;
export const clientAuthError = () => Object.assign(new Error(clientAuthBlocked.error), {
  code: clientAuthBlocked.code,
});
