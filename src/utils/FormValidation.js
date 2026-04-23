export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: "El nombre debe tener al menos 2 caracteres." };
  }
  return { isValid: true, error: null };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { isValid: false, error: "Ingresá un email válido." };
  }
  return { isValid: true, error: null };
};

export const validatePhone = (phone) => {
  // Optional field, so empty is valid
  if (!phone || phone.trim() === '') {
    return { isValid: true, error: null };
  }
  // If provided, basic check (just digits and basic symbols)
  const phoneRegex = /^[\d\s\-\+\(\)]{6,20}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { isValid: false, error: "Ingresá un teléfono válido." };
  }
  return { isValid: true, error: null };
};