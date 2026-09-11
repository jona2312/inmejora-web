import { clientAuthError } from '../contexts/identityContainment.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://aprobacion.inmejora.com.ar';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Ocurrió un error inesperado.';
    let errorData = null;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Not JSON
    }

    switch (response.status) {
      case 400:
        errorMessage = errorData?.message || 'Solicitud incorrecta. Verifica los datos enviados.';
        break;
      case 401:
        errorMessage = 'Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.';
        localStorage.removeItem('inmejora_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
        break;
      case 402:
        errorMessage = 'Créditos insuficientes o pago requerido para esta acción.';
        break;
      case 403:
        errorMessage = 'No tienes permisos para acceder a este recurso.';
        break;
      case 404:
        errorMessage = 'El recurso solicitado no fue encontrado.';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
        break;
      default:
        errorMessage = `Error ${response.status}: ${errorMessage}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  if (contentType && (contentType.includes('image/') || contentType.includes('application/pdf'))) {
    return await response.blob();
  }
  
  return await response.text();
};

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  // Only the two existing anonymous catalog reads remain available through this
  // legacy transport. No cached ID/token is promoted to a credential.
  if (method !== 'GET' || typeof endpoint !== 'string' ||
      !/^\/api\/horizon\/catalogo\/(colores|productos)(\?[^#]*)?$/.test(endpoint)) {
    throw clientAuthError();
  }
  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (!error.status) {
      throw new Error('Error de red. Verifica tu conexión a internet.');
    }
    throw error;
  }
};

export const apiCallFormData = async (endpoint, method = 'POST', formData) => {
  void endpoint;
  void method;
  void formData;
  throw clientAuthError();
};
