import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calculator, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';
import PaywallModal from '@/components/PaywallModal';
import QuoterLimitModal from '@/components/QuoterLimitModal';
import AIAssistantPath from '@/components/AIAssistantPath';
import ManualQuoterPath from '@/components/ManualQuoterPath';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getZoneCoefficient } from '@/utils/CalculationEngine';

const COTIZADOR_USOS_KEY = 'inmejora_cotizador_usos';

const QuoterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [zonas, setZonas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tarifas, setTarifas] = useState([]);

  // UI states
  const [selectedZone, setSelectedZone] = useState('Buenos Aires/AMBA');
  const [selectedPath, setSelectedPath] = useState('ai'); // 'ai' or 'manual'
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const [usosCount, setUsosCount] = useState(0);

  const ZONES = [
    'Buenos Aires/AMBA',
    'Córdoba',
    'Interior/Centro'
  ];

  useEffect(() => {
    loadData();
    checkUserPlan();
    loadUsageCount();
  }, [user]);

  const loadUsageCount = () => {
    try {
      const stored = localStorage.getItem(COTIZADOR_USOS_KEY);
      const count = stored ? parseInt(stored, 10) : 0;
      setUsosCount(count);
    } catch (err) {
      console.error('Error loading usage count:', err);
      setUsosCount(0);
    }
  };

  const incrementUsageCount = () => {
    try {
      const newCount = usosCount + 1;
      localStorage.setItem(COTIZADOR_USOS_KEY, newCount.toString());
      setUsosCount(newCount);
    } catch (err) {
      console.error('Error incrementing usage count:', err);
    }
  };

  const checkUserPlan = async () => {
    if (!user) {
      setUserPlan('free');
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (!error && profile && profile.plan) {
        setUserPlan(profile.plan);
      }
    } catch (err) {
      console.error('Error checking user plan:', err);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Load all data in parallel
      const [zonasRes, serviciosRes, tarifasRes] = await Promise.all([
        supabase.from('zonas').select('*').eq('activo', true),
        supabase.from('servicios_precios').select('*').eq('activo', true),
        supabase.from('tarifas_mano_obra').select('*').eq('activo', true)
      ]);

      if (zonasRes.error) throw zonasRes.error;
      if (serviciosRes.error) throw serviciosRes.error;
      if (tarifasRes.error) throw tarifasRes.error;

      setZonas(zonasRes.data || []);
      setServicios(serviciosRes.data || []);
      setTarifas(tarifasRes.data || []);

      if (!serviciosRes.data || serviciosRes.data.length === 0) {
        setLoadError('No se encontraron servicios disponibles');
      }
    } catch (err) {
      console.error('Error loading quoter data:', err);
      setLoadError('Error al cargar los datos del cotizador');
    } finally {
      setIsLoading(false);
    }
  };

  const zonaCoeficiente = getZoneCoefficient(selectedZone);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
  };

  const handleShowPaywall = () => {
    // Check if user is logged in
    if (user) {
      // Logged in users bypass free limit
      if (userPlan === 'free') {
        setShowPaywall(true);
      } else {
        toast({
          title: "Presupuesto guardado",
          description: "Tu presupuesto ha sido guardado correctamente."
        });
      }
      return;
    }

    // Anonymous users: check usage limit
    if (usosCount >= 1) {
      // Reached limit - show limit modal
      setShowLimitModal(true);
      return;
    }

    // First calculation - allow and increment
    incrementUsageCount();
    toast({
      title: "Presupuesto calculado",
      description: "Primera cotización completada. Creá una cuenta para cotizaciones ilimitadas.",
      duration: 5000
    });
  };

  return (
    <>
      <Helmet>
        <title>Cotizador de Reformas | INMEJORA</title>
        <meta
          name="description"
          content="Calculá tu presupuesto de reforma con nuestro cotizador inteligente. Estimaciones basadas en precios reales del mercado argentino."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-24 md:py-32 max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-[#d4af37]/30">
              Cotizador Inteligente
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Calculá tu Presupuesto
              <br />
              <span className="text-[#d4af37]">en Segundos</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Estimaciones instantáneas basadas en precios reales del mercado argentino
            </p>
          </motion.div>

          {/* Zone Selector */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <label className="text-white font-semibold mb-4 block">
                Seleccioná tu zona:
              </label>
              <div className="flex flex-wrap gap-3">
                {ZONES.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => handleZoneSelect(zone)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      selectedZone === zone
                        ? 'bg-[#d4af37] text-black border-2 border-[#d4af37]'
                        : 'bg-[#2a2a2a] text-white border-2 border-[#2a2a2a] hover:border-[#d4af37]'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Path Selector Tabs */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-2 flex gap-2">
              <button
                onClick={() => handlePathSelect('ai')}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedPath === 'ai'
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-transparent text-white hover:bg-[#2a2a2a]'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Asistente IA
              </button>
              <button
                onClick={() => handlePathSelect('manual')}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedPath === 'manual'
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-transparent text-white hover:bg-[#2a2a2a]'
                }`}
              >
                <Calculator className="w-5 h-5" />
                Cotizar manualmente
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-8">
              <SkeletonLoader />
            </div>
          )}

          {/* Error State */}
          {loadError && !isLoading && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error al cargar datos</h3>
              <p className="text-gray-400 mb-6">{loadError}</p>
              <Button
                onClick={loadData}
                className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !loadError && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {selectedPath === 'ai' ? (
                <AIAssistantPath
                  services={servicios}
                  selectedZone={selectedZone}
                  zonaCoeficiente={zonaCoeficiente}
                  onShowPaywall={handleShowPaywall}
                  userPlan={userPlan}
                />
              ) : (
                <ManualQuoterPath
                  services={servicios}
                  selectedZone={selectedZone}
                  zonaCoeficiente={zonaCoeficiente}
                  onShowPaywall={handleShowPaywall}
                  userPlan={userPlan}
                />
              )}
            </motion.div>
          )}

          {/* Bottom CTA Card */}
          {!isLoading && !loadError && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-[#1a1a1a] border-2 border-[#d4af37] rounded-3xl p-8 md:p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-[#d4af37]" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  ¿Proyecto complejo o a medida?
                </h3>

                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Nuestro Asistente IA en la home puede darte una cotización personalizada según tu caso
                </p>

                <Button
                  onClick={() => navigate('/#asistente-ia')}
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ir al Asistente IA
                </Button>
              </div>
            </motion.div>
          )}
        </main>

        <Footer />

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          currentPlan={userPlan}
        />

        {/* Limit Modal (for anonymous users) */}
        <QuoterLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
        />
      </div>
    </>
  );
};

export default QuoterPage;