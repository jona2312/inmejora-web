import { supabase } from '@/lib/customSupabaseClient';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const subscribeNewsletter = async (email) => {
  try {
    if (!validateEmail(email)) throw new Error('Email inválido');
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
    if (error) {
      if (error.code === '23505') throw new Error('El email ya está suscripto');
      throw error;
    }
    return { success: true, message: '¡Suscripción exitosa!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const registerUser = async (userData) => {
  try {
    if (!validateEmail(userData.email)) throw new Error('Email inválido');
    if (!userData.name) throw new Error('Nombre es requerido');
    if (!userData.phone) throw new Error('Teléfono es requerido');
    
    const { error } = await supabase.from('users').insert([{
        email: userData.email,
        full_name: userData.name,
        phone: userData.phone,
        company: userData.company || ''
    }]);
    
    if (error) {
      if (error.code === '23505') throw new Error('El usuario ya existe');
      throw error;
    }
    return { success: true, message: 'Registro exitoso' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const submitContactForm = async (formData) => {
  try {
    if (!validateEmail(formData.email)) throw new Error('Email inválido');
    if (!formData.name) throw new Error('Nombre es requerido');
    if (!formData.message) throw new Error('Mensaje es requerido');
    
    const { error } = await supabase.from('contact_submissions').insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'new'
    }]);
    
    if (error) throw error;
    return { success: true, message: 'Mensaje enviado correctamente' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const trackPricingInquiry = async (email, planType) => {
  try {
    if (!validateEmail(email)) throw new Error('Email inválido');
    const { error } = await supabase.from('pricing_inquiries').insert([{
        email,
        plan_type: planType
    }]);
    if (error) throw error;
    return { success: true, message: 'Consulta registrada' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message, data: [] };
  }
};