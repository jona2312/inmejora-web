import { z } from 'zod';

// Utility to sanitize basic HTML tags
const sanitizeHtml = (str) => {
  if (!str) return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

export const presupuestoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .transform(val => sanitizeHtml(val.trim())),
    
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono es demasiado largo')
    .regex(/^(?:\+?54|9)?\s*(?:(?:11|[2368]\d)\s*\d{4}[-\s]*\d{4}|\d{10})$/, 'Formato de teléfono inválido (ej: +54 9 11 1234-5678)'),
    
  tipo_proyecto: z.enum(['Vivienda', 'Comercial', 'Industrial', 'Otro'], {
    errorMap: () => ({ message: 'Seleccione un tipo de proyecto válido' })
  }),
  
  metraje: z.number({ invalid_type_error: 'Debe ingresar un número' })
    .min(1, 'El metraje debe ser mayor a 0')
    .max(100000, 'El metraje es demasiado grande'),
    
  descripcion: z.string()
    .min(10, 'Por favor brinde más detalles (mínimo 10 caracteres)')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .transform(val => sanitizeHtml(val.trim())),
    
  // Honeypot field for anti-spam
  website: z.string().max(0, 'Invalid request').optional()
});

export const validateFile = (file) => {
  if (!file) return { valid: true };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG o WEBP' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar los 5MB' };
  }
  
  return { valid: true };
};