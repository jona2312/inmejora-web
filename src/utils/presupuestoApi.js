import { COMMERCIAL } from '@/config/commercial';
import { supabase } from '@/lib/customSupabaseClient';

const RATE_LIMIT_KEY = 'inmejora_presupuestos_rate_limit';
const MAX_REQUESTS_PER_HOUR = 5;

const checkRateLimit = () => {
  try {
    const storedStr = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let requests = [];

    if (storedStr) {
      const stored = JSON.parse(storedStr);
      // Filter out requests older than 1 hour
      requests = stored.filter(time => now - time < 3600000);
    }

    if (requests.length >= MAX_REQUESTS_PER_HOUR) {
      return { allowed: false, error: 'Has alcanzado el límite de solicitudes. Intentá más tarde.' };
    }

    requests.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(requests));
    return { allowed: true };
  } catch {
    return { allowed: true }; // Failsafe
  }
};

const checkDuplicate = async (telefono, descripcion) => {
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  
  const { data, error } = await supabase
    .from('presupuestos_publicos')
    .select('id')
    .eq('telefono', telefono)
    .eq('descripcion', descripcion)
    .gte('created_at', oneHourAgo)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
};

// Customer photos are never written to the public Supabase bucket from the browser
// (P0 Supabase hardening: anonymous uploads and public URLs for customer photos are removed).
// Until a reviewed server upload endpoint exists, this form accepts no photo: the visitor is
// told to send it through the commercial WhatsApp channel after the request.
export const PRESUPUESTO_PHOTO_UPLOAD_ENABLED = false;

export const uploadPresupuestoPhoto = async () => {
  throw new Error('PHOTO_UPLOAD_DISABLED');
};

export const generateWhatsAppLink = (data) => {
  const message = `🎯 NUEVO PRESUPUESTO\nNombre: ${data.nombre}\nTeléfono: ${data.telefono}\nTipo: ${data.tipo_proyecto}\nMetraje: ${data.metraje}m²\nDescripción: ${data.descripcion}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${COMMERCIAL.whatsapp}?text=${encodedMessage}`;
};

export const submitPresupuesto = async (formData, photoFile) => {
  // Checked first: a photo is refused before any rate-limit count or database access.
  if (photoFile) {
    throw new Error('Por ahora no podemos recibir fotos en este formulario. Enviala por WhatsApp una vez enviado el pedido.');
  }

  // Rate limiting
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.error);
  }

  // Honeypot check
  if (formData.website) {
    throw new Error('Solicitud inválida');
  }

  // Check duplicates
  const isDuplicate = await checkDuplicate(formData.telefono, formData.descripcion);
  if (isDuplicate) {
    throw new Error('Ya enviaste un presupuesto similar recientemente.');
  }

  const fotoUrl = null;

  const payload = {
    nombre: formData.nombre,
    telefono: formData.telefono,
    tipo_proyecto: formData.tipo_proyecto,
    metraje: formData.metraje,
    descripcion: formData.descripcion,
    foto_url: fotoUrl
  };

  const { data, error } = await supabase
    .from('presupuestos_publicos')
    .insert([payload])
    .select('id')
    .single();

  if (error) {
    console.error('Error inserting:', error);
    throw new Error('Hubo un problema al guardar tu solicitud. Intentalo nuevamente.');
  }

  const whatsappLink = generateWhatsAppLink(payload);

  return {
    success: true,
    id: data.id,
    whatsappLink,
    payload
  };
};
