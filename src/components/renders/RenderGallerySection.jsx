import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const RenderGallerySection = () => {
  const [renders, setRenders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchRenders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data: subs } = await supabase
          .from('client_subscriptions')
          .select('id')
          .eq('client_id', user.id)
          .limit(1);

        if (subs && subs.length > 0) {
          const { data } = await supabase
            .from('client_credits')
            .select('*')
            .eq('subscription_id', subs[0].id)
            .order('created_at', { ascending: false });
          
          if (isMounted) {
            setRenders(data || []);
          }
        } else if (isMounted) {
          setRenders([]);
        }
      } catch (error) {
        console.error('Error fetching renders:', error);
        if (isMounted) setRenders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRenders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-[#141414] rounded-xl border border-gray-800 p-8 min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Cargando tu galería...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] rounded-xl border border-gray-800 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <ImageIcon className="text-[#D4AF37] w-6 h-6" />
            </div>
            Tu Galería de Renders
          </h2>
          <p className="text-gray-400 mt-2">
            Historial de renders solicitados y procesados
          </p>
        </div>
        <span className="text-sm text-gray-400 bg-gray-900 px-4 py-2 rounded-full font-semibold">
          {renders.length} {renders.length === 1 ? 'render' : 'renders'}
        </span>
      </div>

      {renders.length === 0 ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center p-12 md:p-16 border-2 border-dashed border-gray-700 rounded-xl bg-[#0a0a0a] min-h-[400px]"
        >
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-12 h-12 text-gray-600" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            Acá aparecerán tus renders
          </h3>
          
          <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
            Una vez que los procese nuestro equipo, todos tus renders aparecerán en esta galería.
          </p>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg max-w-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300 text-left">
                <strong>Nota:</strong> Los renders solicitados por WhatsApp también aparecen aquí automáticamente.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renders.map((render, index) => (
            <motion.div
              key={render.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-700 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-700" />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white text-sm font-semibold truncate">
                  {render.transaction_type || 'Render'}
                </span>
                <span className="text-gray-300 text-xs truncate">
                  {render.description || 'Sin descripción'}
                </span>
                <span className="text-gray-500 text-xs mt-1">
                  {new Date(render.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>
              
              <div className="absolute top-2 right-2 bg-[#D4AF37]/90 text-black px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {render.amount_credits || 1} crédito{(render.amount_credits || 1) > 1 ? 's' : ''}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderGallerySection;