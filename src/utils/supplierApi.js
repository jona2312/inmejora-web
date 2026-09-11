import { supplierAuthBlocked, clearSupplierCache } from '../contexts/identityContainment.js';

// The active supplier API is contained until its session/ownership contract is
// versioned. Neither local IDs nor JWT-shaped storage values are credentials.
export const getSupplierToken = () => null;
export const setSupplierToken = () => supplierAuthBlocked;
export const clearSupplierToken = clearSupplierCache;
export const isSupplierLoggedIn = () => false;

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const supplierApiCall = async () => {
  throw Object.assign(new Error(supplierAuthBlocked.error), { code: supplierAuthBlocked.code });
};
