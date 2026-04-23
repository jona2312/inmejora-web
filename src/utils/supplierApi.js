const API_BASE = 'https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1';
const TOKEN_KEY = 'supplier_token';

export const getSupplierToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setSupplierToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearSupplierToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('supplier_data');
};

export const isSupplierLoggedIn = () => {
  return !!getSupplierToken() && !!localStorage.getItem('supplier_data');
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const supplierApiCall = async (endpoint, options = {}) => {
  const token = getSupplierToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const response = await fetch(url, config);
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearSupplierToken();
        window.dispatchEvent(new Event('supplier:unauthorized'));
      }
      throw {
        status: response.status,
        message: data?.message || data?.error || 'Error en la solicitud al servidor',
        data
      };
    }

    return data;
  } catch (error) {
    console.error(`[Supplier API Error] ${endpoint}:`, error);
    throw error;
  }
};