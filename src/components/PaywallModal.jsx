import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaywallModal = ({ isOpen, onClose, currentPlan = 'free' }) => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: '',
      features: [
        '1 cotización',
        '1 ítem por cotización',
        'Sin PDF descargable',
        'Precios estimados'
      ],
      highlight: false,
      current: currentPlan === 'free'
    },
    {
      name: 'BÁSICO',
      price: '$4.999',
      period: '/mes',
      features: [
        '3 cotizaciones/mes',
        '3 ítems por cotización',
        'PDF descargable',
        'Precios del mercado'
      ],
      highlight: false,
      current: currentPlan === 'basico'
    },
    {
      name: 'PRO',
      price: '$9.999',
      period: '/mes',
      features: [
        'Cotizaciones ilimitadas',
        'Ítems ilimitados',
        'Incluye materiales',
        'PDF + Renders IA'
      ],
      highlight: true,
      current: currentPlan === 'pro'
    }
  ];

  const handleActivatePro = () => {
    navigate('/precios');
    onClose();
  };

  const handleViewPlans = () => {
    navigate('/precios');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white transition-all"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-10 md:p-12">
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#d4af37]" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
                Ya usaste tu cotización gratuita
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-center mb-10 text-lg max-w-2xl mx-auto">
                Activá un plan pago para continuar cotizando y acceder a funciones avanzadas
              </p>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl p-6 border-2 transition-all ${
                      plan.highlight
                        ? 'border-[#d4af37] bg-[#d4af37]/5'
                        : 'border-[#2a2a2a] bg-[#1a1a1a]'
                    } ${plan.current ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0d0d0d]' : ''}`}
                  >
                    {plan.current && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Plan Actual
                        </span>
                      </div>
                    )}
                    
                    {plan.highlight && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-[#d4af37] text-black text-xs font-bold px-3 py-1 rounded-full">
                          Recomendado
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-[#d4af37]">{plan.price}</span>
                      <span className="text-gray-400">{plan.period}</span>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleActivatePro}
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
                >
                  Activar Plan Pro
                </Button>

                <Button
                  onClick={handleViewPlans}
                  variant="outline"
                  className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-bold py-6 px-8 rounded-xl text-lg transition-all"
                >
                  Ver todos los planes
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;