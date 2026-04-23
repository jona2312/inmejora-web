import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useHealthCheck } from '@/contexts/HealthCheckContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineBanner = () => {
  const { healthStatus, isChecking, checkHealth } = useHealthCheck();

  if (healthStatus.ok) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#141414] border-b border-[#D4AF37]/30 text-white relative z-50"
      >
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <WifiOff size={18} />
            <span className="font-medium">Servicio temporalmente no disponible</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-gray-400 hidden sm:inline text-xs">
                Nuestros sistemas están experimentando dificultades.
             </span>
             <Button 
                size="sm" 
                variant="outline" 
                onClick={checkHealth}
                disabled={isChecking}
                className="h-8 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-xs"
             >
                {isChecking ? (
                   <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : (
                   <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Reintentar
             </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineBanner;