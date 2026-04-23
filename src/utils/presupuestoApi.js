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
  } catch (e) {
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

export const uploadPresupuestoPhoto = async (file) => {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `solicitudes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('presupuestos-fotos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('presupuestos-fotos')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const generateWhatsAppLink = (data) => {
  const message = `🎯 NUEVO PRESUPUESTO\nNombre: ${data.nombre}\nTeléfono: ${data.telefono}\nTipo: ${data.tipo_proyecto}\nMetraje: ${data.metraje}m²\nDescripción: ${data.descripcion}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/5491139066429?text=${encodedMessage}`;
};

export const submitPresupuesto = async (formData, photoFile) => {
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

  let fotoUrl = null;
  if (photoFile) {
    fotoUrl = await uploadPresupuestoPhoto(photoFile);
  }

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