import { supabase } from '@/lib/customSupabaseClient';

/**
 * Log quotation usage to Supabase cotizador_uso table
 * @param {number} zoneId - Zone ID from zonas table
 * @param {Array} serviceIds - Array of service IDs used in quotation
 * @param {number} totalEstimado - Total estimated amount in ARS
 * @returns {Promise<Object|null>} Inserted record or null on error
 */
export async function logQuotationUsage(zoneId, serviceIds, totalEstimado) {
  try {
    // Generate random session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const usageData = {
      session_id: sessionId,
      zona_id: zoneId,
      servicios_cotizados: serviceIds,
      total_estimado: totalEstimado,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('cotizador_uso')
      .insert([usageData])
      .select()
      .single();

    if (error) {
      console.error('[UsageLogger] Error logging quotation usage:', error);
      return null;
    }

    console.log('[UsageLogger] Successfully logged quotation usage:', data);
    return data;
  } catch (err) {
    console.error('[UsageLogger] Exception logging quotation usage:', err);
    return null;
  }
}

/**
 * Get usage statistics for analytics (optional helper)
 * @param {string} sessionId - Session ID to query
 * @returns {Promise<Object|null>} Usage record or null
 */
export async function getUsageBySession(sessionId) {
  try {
    const { data, error } = await supabase
      .from('cotizador_uso')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('[UsageLogger] Error fetching usage:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[UsageLogger] Exception fetching usage:', err);
    return null;
  }
}