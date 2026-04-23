import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Image as ImageIcon, LayoutDashboard, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UploadSuccessModal = ({ isOpen, onClose, data, onReset }) => {
  const navigate = useNavigate();
  
  if (!isOpen || !data) return null;

  const { renderJobId, imageUrl, analysis, creditsRemaining } = data;
  const creditsCap = 5; // Default cap, ideally passed from props or context

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#141414] border border-[#FCD34D]/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden z-50 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center gap-4 bg-gradient-to-r from-[#141414] to-[#1a1a1a]">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">¡Análisis Completado!</h2>
              <p className="text-sm text-gray-400">
                Tu espacio ha sido procesado exitosamente por nuestra IA.
              </p>
            </div>
          </div>

          {/* Body (Scrollable) */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Image Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tu Imagen</label>
                <div className="rounded-xl overflow-hidden border border-gray-800 bg-black relative aspect-video">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded space" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-gray-800 flex justify-between items-center text-sm">
                   <span className="text-gray-400">Créditos restantes:</span>
                   <span className="font-bold text-[#FCD34D]">{creditsRemaining} <span className="text-gray-600 font-normal">/ {creditsCap}</span></span>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Análisis IA</label>
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 h-full max-h-[250px] overflow-y-auto text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {analysis || "No hay análisis disponible."}
                </div>
              </div>

            </div>
          </div>

          {/* Footer / Actions */}
          <div className="p-6 border-t border-gray-800 bg-[#0a0a0a] flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => navigate('/portal/dashboard')}
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-white/5"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" /> Volver al Dashboard
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={onReset}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Subir Otra Imagen
            </Button>

            {renderJobId && (
              <Button 
                onClick={() => navigate(`/portal/renders/${renderJobId}`)}
                className="bg-[#D4AF37] text-black font-bold hover:bg-[#fbbf24]"
              >
                Ver Render <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadSuccessModal;