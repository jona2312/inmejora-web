/**
 * Validates a user's name.
 * @param {string} name - The name to validate.
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validateName = (name) => {
  if (!name) return { isValid: false, error: "El nombre es requerido" };
  if (name.trim().length < 3) return { isValid: false, error: "El nombre debe tener al menos 3 caracteres" };
  if (name.length > 100) return { isValid: false, error: "El nombre no puede exceder los 100 caracteres" };
  return { isValid: true, error: null };
};

/**
 * Validates an email address.
 * @param {string} email - The email to validate.
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: "El email es requerido" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { isValid: false, error: "Formato de email inválido" };
  return { isValid: true, error: null };
};

/**
 * Validates a password and assesses its strength.
 * @param {string} password - The password to validate.
 * @returns {{ isValid: boolean, error: string|null, strength: string }}
 */
export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: "La contraseña es requerida", strength: 'weak' };
  if (password.length < 6) return { isValid: false, error: "La contraseña debe tener al menos 6 caracteres", strength: 'weak' };
  if (password.length > 128) return { isValid: false, error: "La contraseña no puede exceder los 128 caracteres", strength: 'weak' };

  let strength = 'weak';
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length >= 8 && hasUpperCase && hasNumber && hasSpecialChar) {
    strength = 'strong';
  } else if (password.length >= 6 && (hasUpperCase || hasNumber)) {
    strength = 'medium';
  }

  return { isValid: true, error: null, strength };
};

/**
 * Validates a phone number.
 * @param {string} phone - The phone number to validate.
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') return { isValid: true, error: null }; // Optional
  const phoneRegex = /^(\+?54\s?9\s?)?(\d{2,4})\s?(\d{4}-?\d{4}|\d{6,8})$/;
  if (!phoneRegex.test(phone.trim())) return { isValid: false, error: "Formato de teléfono inválido (ej: +54 9 11 1234-5678)" };
  return { isValid: true, error: null };
};

/**
 * Validates that two passwords match and meet minimum requirements.
 * @param {string} password - The primary password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) return { isValid: false, error: "Ambas contraseñas son requeridas" };
  if (password.length < 6) return { isValid: false, error: "La contraseña debe tener al menos 6 caracteres" };
  if (password !== confirmPassword) return { isValid: false, error: "Las contraseñas no coinciden" };
  return { isValid: true, error: null };
};

/**
 * Validates an entire form object based on provided rules.
 * @param {Object} formData - The form data object.
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateForm = (formData) => {
  const errors = {};
  let isValid = true;

  if (formData.hasOwnProperty('name')) {
    const res = validateName(formData.name);
    if (!res.isValid) { errors.name = res.error; isValid = false; }
  }
  
  if (formData.hasOwnProperty('email')) {
    const res = validateEmail(formData.email);
    if (!res.isValid) { errors.email = res.error; isValid = false; }
  }

  if (formData.hasOwnProperty('password')) {
    const res = validatePassword(formData.password);
    if (!res.isValid) { errors.password = res.error; isValid = false; }
  }

  if (formData.hasOwnProperty('phone')) {
    const res = validatePhone(formData.phone);
    if (!res.isValid) { errors.phone = res.error; isValid = false; }
  }

  return { isValid, errors };
};