import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Sparkles, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMercadoPagoCheckout } from '@/hooks/useMercadoPagoCheckout';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { trackPricingInquiry } from '@/utils/supabaseUtils';
import { useToast } from '@/components/ui/use-toast';

const PricingCard = ({ plan, isCurrentPlan, isAnnual }) => {
  const safePlan = plan || {};
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const resolvedProductId = typeof safePlan.productId === 'object' && safePlan.productId !== null
    ? (isAnnual ? safePlan.productId.annual : safePlan.productId.monthly)
    : safePlan.productId || safePlan.id;
  
  const { handleSubscribe, loadingProductId } = useMercadoPagoCheckout(resolvedProductId);

  const isPremium = typeof safePlan.id === 'string' && safePlan.id.includes('pro');
  const isFree = safePlan.type === 'free';
  const isMiProyecto = safePlan.id === 'mi_proyecto' || safePlan.name === 'A Medida' || safePlan.name?.text === 'A Medida';
  const isLoading = loadingProductId === resolvedProductId;

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const handleAction = () => {
    if (isCurrentPlan || isMiProyecto) return;

    if (!isAuthenticated) {
      setShowInquiryModal(true);
      return;
    }

    if (isFree) {
      navigate('/portal');
      return;
    }

    if (resolvedProductId) {
      handleSubscribe(resolvedProductId);
    } else {
      console.error("Cannot subscribe: undefined productId");
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail)) {
      toast({ variant: "destructive", description: "Email inválido" });
      return;
    }

    setInquiryLoading(true);
    const result = await trackPricingInquiry(inquiryEmail, safePlan.id);
    setInquiryLoading(false);

    if (result.success) {
      toast({ title: "Interés registrado", description: "Te redirigiremos para que continúes." });
      setShowInquiryModal(false);
      navigate('/registro');
    } else {
      toast({ variant: "destructive", description: "Error al registrar la consulta." });
    }
  };

  const getButtonText = () => {
    if (isMiProyecto) return 'No disponible';
    if (isCurrentPlan) return 'Plan Actual';
    if (isLoading) return 'Creando pago...';
    return typeof safePlan.buttonText === 'string' ? safePlan.buttonText : 'Comprar Ahora';
  };

  const getButtonClass = () => {
    if (isMiProyecto) {
      return 'bg-[#222] text-gray-500 cursor-not-allowed border border-[#333]';
    }
    if (isCurrentPlan) {
      return 'bg-[#222] text-gray-400 cursor-not-allowed border border-[#333] opacity-80';
    }
    if (isPremium || safePlan.type === 'paid') {
      return 'bg-[#d4af37] text-black hover:bg-[#b5952f] hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)] border-0';
    }
    return 'bg-transparent text-white border border-[#444] hover:border-[#d4af37] hover:bg-[#1a1a1a]';
  };

  const displayPrice = typeof safePlan.price === 'object' && safePlan.price !== null 
    ? (isAnnual ? safePlan.price.annual : safePlan.price.monthly) 
    : safePlan.price || 'N/A';

  const displayPeriod = typeof safePlan.period === 'object' && safePlan.period !== null
    ? (isAnnual ? safePlan.period.annual : safePlan.period.monthly)
    : safePlan.period || '';

  const displayName = typeof safePlan.name === 'object' ? safePlan.name?.text || 'Plan' : safePlan.name || 'Plan';
  const displayDesc = typeof safePlan.description === 'object' ? safePlan.description?.text || '' : safePlan.description || '';

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`relative flex flex-col p-6 sm:p-8 bg-[#1a1a1a] rounded-3xl border transition-all duration-300
          ${isPremium ? 'border-[#d4af37] shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)] md:scale-105 z-10' : 'border-[#333] hover:border-[#555] shadow-lg'}
          ${isMiProyecto ? 'opacity-80' : ''}
        `}
      >
        {isMiProyecto ? (
          <div className="absolute -top-4 right-6 px-4 py-1 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider z-20 bg-orange-500/20 text-orange-400 border border-orange-500/50 flex items-center gap-1">
            <Clock className="w-3 h-3" /> PRÓXIMAMENTE
          </div>
        ) : (
          safePlan.badge && typeof safePlan.badge === 'string' && (
            <div 
              className={`absolute -top-4 right-6 px-4 py-1 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider z-20
                ${safePlan.badge === 'PREMIUM' ? 'bg-[#10B981] text-black' : (isAnnual && isPremium ? 'animate-pulse bg-[#d4af37] text-black' : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50')}
              `}
            >
              {safePlan.badge}
            </div>
          )
        )}

        <div className="mb-6 relative z-10">
          <h3 className="text-xl font-bold text-white mb-2" style={{ color: typeof safePlan.color === 'string' ? safePlan.color : '#fff' }}>
            {displayName}
          </h3>
          <p className="text-sm text-gray-400 mb-5 min-h-[40px] leading-relaxed">{displayDesc}</p>
          
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white drop-shadow-sm">
              {displayPrice !== "0" && displayPrice !== "A Medida" ? "$" : ""}
              {displayPrice}
            </span>
          </div>
          {displayPeriod && (
            <p className="text-sm text-gray-500 mt-1 uppercase font-semibold tracking-wider">
              {displayPeriod}
            </p>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-[#333] relative z-10">
          <p className="text-lg font-medium text-white flex items-center gap-2">
            {safePlan.id === 'mi_proyecto' ? <Sparkles className="w-5 h-5 text-[#10B981]" /> : null}
            <span style={{ color: typeof safePlan.color === 'string' ? safePlan.color : '#fff' }} className="font-bold">
              {typeof safePlan.renders === 'object' ? safePlan.renders?.total || 'Varios' : safePlan.renders || '0'}
            </span>
            {safePlan.renders !== "A Medida" && safePlan.renders !== "Ilimitados" && " Créditos IA"}
          </p>
        </div>

        <div className="flex-1 mb-8 relative z-10">
          <ul className="space-y-4">
            {Array.isArray(safePlan.features) && safePlan.features.map((feature, idx) => {
              const isExcl = Array.isArray(safePlan.exclusiveFeatures) && safePlan.exclusiveFeatures.includes(feature);
              return (
                <li key={idx} className={`flex items-start gap-3 text-sm ${isExcl ? 'text-white font-medium bg-[#d4af37]/10 p-3 rounded-xl border border-[#d4af37]/20' : 'text-gray-300'}`}>
                  <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: typeof safePlan.color === 'string' ? safePlan.color : '#fff' }} />
                  <span className="leading-tight">{typeof feature === 'string' ? feature : JSON.stringify(feature)}</span>
                  {isExcl && <span className="text-[10px] bg-[#d4af37] text-black px-2 py-0.5 rounded font-black uppercase tracking-wider ml-auto self-center shadow-sm">Pro</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <Button
          onClick={handleAction}
          disabled={isLoading || isCurrentPlan || isMiProyecto}
          className={`w-full py-7 font-bold text-base transition-all duration-300 mt-auto rounded-xl shadow-md relative z-10 ${getButtonClass()}`}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {isCurrentPlan && !isLoading ? <Check className="w-5 h-5 mr-2" /> : null}
          {getButtonText()}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showInquiryModal && !isMiProyecto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a1a] border border-[#333] p-6 rounded-2xl max-w-sm w-full relative"
            >
              <Button variant="ghost" size="icon" onClick={() => setShowInquiryModal(false)} className="absolute top-2 right-2 text-gray-400">
                <X size={18} />
              </Button>
              <h4 className="text-xl font-bold text-white mb-2">Continuar con {displayName}</h4>
              <p className="text-gray-400 text-sm mb-4">Ingresá tu email para continuar con la suscripción o registro.</p>
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="bg-[#111] text-white border-gray-700"
                  required
                />
                <Button type="submit" disabled={inquiryLoading} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f]">
                  {inquiryLoading ? <Loader2 className="animate-spin" size={18} /> : 'Continuar'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PricingCard;