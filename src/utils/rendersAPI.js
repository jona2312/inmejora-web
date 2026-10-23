// No reviewed n8n functional source exists yet. Legacy operations cannot fake
// provider success, mutate credit tables or derive identity from browser storage.
const unavailable = async () => {
  const error = new Error('La generación de renders todavía no está habilitada. No se envió ni se cobró una solicitud.');
  error.code = 'BLOCKED_SOURCE_EXPORT';
  throw error;
};
export const rendersAPI = Object.freeze({
  upload:unavailable, generate:unavailable, edit:unavailable, list:unavailable,
  detail:unavailable, delete:unavailable, download:unavailable,
});
