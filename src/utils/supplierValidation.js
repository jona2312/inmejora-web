export const validateSupplierEmail = (email) => {
  if (!email) return { isValid: false, error: 'El email es requerido' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { isValid: false, error: 'Formato de email inválido' };
  return { isValid: true, error: null };
};

export const validateSupplierPassword = (password) => {
  if (!password) return { isValid: false, error: 'La contraseña es requerida' };
  if (password.length < 6) return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  return { isValid: true, error: null };
};

export const getApiErrorMessage = (status, defaultMessage) => {
  switch (status) {
    case 400: return 'Datos incorrectos. Verifica la información ingresada.';
    case 401: return 'Sesión expirada o credenciales inválidas.';
    case 403: return 'No tienes permiso para realizar esta acción.';
    case 404: return 'Recurso no encontrado.';
    case 409: return 'Conflicto con los datos actuales.';
    case 500: return 'Error interno del servidor. Intenta más tarde.';
    default: return defaultMessage || 'Ocurrió un error inesperado.';
  }
};