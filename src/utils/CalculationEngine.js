/**
 * Calculation Engine for Quoter System
 * Provides consistent calculation formulas across AI and Manual paths
 */

/**
 * Calculate total for a single service
 * @param {number} precio_mano_obra - Base labor price per m²
 * @param {number} m2 - Square meters
 * @param {number} zona_coeficiente - Zone multiplier (default 1.0 for AMBA)
 * @returns {Object} Breakdown with precio_base, buffer, iva, total
 */
export function calculateServiceTotal(precio_mano_obra, m2, zona_coeficiente = 1.0) {
  const precio_base = precio_mano_obra * m2 * zona_coeficiente;
  const buffer = precio_base * 0.35; // 35% buffer for contingencies
  const subtotal = precio_base + buffer;
  const iva = subtotal * 0.21; // 21% VAT
  const total = subtotal + iva;

  return {
    precio_base: Math.round(precio_base),
    buffer: Math.round(buffer),
    iva: Math.round(iva),
    total: Math.round(total)
  };
}

/**
 * Calculate grand total for multiple selected services
 * @param {Array} selectedServices - Array of service objects with {precio_mano_obra, m2}
 * @param {number} zonaCoeficiente - Zone multiplier
 * @returns {Object} Breakdown with subtotal, buffer, iva, total
 */
export function calculateGrandTotal(selectedServices, zonaCoeficiente = 1.0) {
  let subtotal_base = 0;

  selectedServices.forEach(service => {
    const serviceCost = service.precio_mano_obra * service.m2 * zonaCoeficiente;
    subtotal_base += serviceCost;
  });

  const buffer = subtotal_base * 0.35;
  const base_con_buffer = subtotal_base + buffer;
  const iva = base_con_buffer * 0.21;
  const total = base_con_buffer + iva;

  return {
    subtotal: Math.round(subtotal_base),
    buffer: Math.round(buffer),
    iva: Math.round(iva),
    total: Math.round(total)
  };
}

/**
 * Format number as Argentine Peso currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Validate numeric input for m² field
 * @param {string|number} value - Input value
 * @returns {boolean} True if valid
 */
export function validateM2Input(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 1 && num <= 10000;
}

/**
 * Get zone coefficient by zone name
 * @param {string} zoneName - Zone name
 * @returns {number} Coefficient multiplier
 */
export function getZoneCoefficient(zoneName) {
  const coefficients = {
    'Buenos Aires/AMBA': 1.0,
    'Córdoba': 0.95,
    'Interior/Centro': 0.85
  };
  return coefficients[zoneName] || 1.0;
}