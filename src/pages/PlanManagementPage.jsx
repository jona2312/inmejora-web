import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, AlertTriangle, CreditCard, Calendar, Download, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const PlanManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Mock plan data based on user state
  const isPremium = user?.plan_id?.includes('pro') || false;
  const currentPlan = isPremium ? {
    name: "Pro Mensual",
    price: "$12.500 ARS",
    period: "Mensual",
    nextBilling: "15 de Abril, 2026",
    autoRenew: true,
    creditsTotal: 50,
    creditsUsed: 12
  } : {
    name: "Explorar",
    price: "$0 ARS",
    period: "Gratis",
    nextBilling: "-",
    autoRenew: false,
    creditsTotal: 3,
    creditsUsed: 1
  };

  const handleCancelPlan = async () => {
    setIsCancelling(true);
    try {
      // API call simulation: fetch POST /api/horizon/subscriptions/cancel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Suscripción cancelada",
        description: "Tu plan se mantendrá activo hasta el final del ciclo de facturación actual.",
      });
      setShowCancelModal(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cancelar la suscripción. Intenta más tarde.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="bg-[#1a1a1a] border-b border-[#333] h-16 flex items-center px-4 md:px-8">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/portal')} className="text-gray-400 hover:text-white pl-0">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Portal
          </Button>
          <div className="h-6 w-px bg-[#333] hidden md:block"></div>
          <h1 className="text-lg font-bold text-[#FCB048] hidden md:block">Gestión de Plan</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Mi Suscripción</h2>
          <p className="text-gray-400">Gestiona tu plan actual, créditos y métodos de pago.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Current Plan Card */}
          <div className="md:col-span-2 bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 relative overflow-hidden">
            {isPremium && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FCB048]/10 rounded-full blur-2xl"></div>
            )}
            
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">Plan Actual</p>
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  {currentPlan.name}
                  {isPremium && <Crown className="w-6 h-6 text-[#FCB048]" />}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{currentPlan.price}</p>
                <p className="text-sm text-gray-400">{currentPlan.period}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-[#222] rounded-xl border border-[#333]">
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> Próximo Cobro</p>
                <p className="font-medium">{currentPlan.nextBilling}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1"><CreditCard className="w-4 h-4"/> Renovación Automática</p>
                <p className="font-medium flex items-center gap-2">
                  {currentPlan.autoRenew ? (
                    <><span className="w-2 h-2 rounded-full bg-green-500"></span> Activa</>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-gray-500"></span> Inactiva</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/precios')} className="bg-[#FCB048] text-black hover:bg-[#e09b3d] font-bold">
                Mejorar Plan
              </Button>
              {isPremium && (
                <Button variant="outline" onClick={() => setShowCancelModal(true)} className="border-red-900/50 text-red-500 hover:bg-red-900/20 hover:text-red-400">
                  Cancelar Suscripción
                </Button>
              )}
            </div>
          </div>

          {/* Credits Usage */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-6">Uso de Créditos</h3>
            
            <div className="flex-grow flex flex-col justify-center">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-black">{currentPlan.creditsTotal - currentPlan.creditsUsed}</span>
                <span className="text-gray-400 text-sm mb-1">de {currentPlan.creditsTotal} disp.</span>
              </div>
              
              <div className="w-full bg-[#333] rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-[#FCB048] h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(currentPlan.creditsUsed / currentPlan.creditsTotal) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-400 text-center">
                Tus créditos se renuevan el {currentPlan.nextBilling.split(',')[0]}.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
          <button onClick={() => navigate('/portal/pagos')} className="w-full flex items-center justify-between p-6 hover:bg-[#222] transition-colors border-b border-[#333] group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#333] flex items-center justify-center group-hover:bg-[#FCB048]/20 transition-colors">
                <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-[#FCB048]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Historial de Pagos</p>
                <p className="text-sm text-gray-400">Revisa tus facturas y comprobantes anteriores.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-6 hover:bg-[#222] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#333] flex items-center justify-center group-hover:bg-[#FCB048]/20 transition-colors">
                <Download className="w-5 h-5 text-gray-400 group-hover:text-[#FCB048]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Última Factura</p>
                <p className="text-sm text-gray-400">Descarga la factura de tu último periodo (PDF).</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </main>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-red-500">
              <AlertTriangle className="w-6 h-6" /> Cancelar Suscripción
            </DialogTitle>
            <DialogDescription className="text-gray-400 pt-4 text-base">
              ¿Estás seguro de que quieres cambiar al <strong>Plan Explorar</strong>? 
              <br/><br/>
              Perderás acceso a:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-300">
                <li>Renders ilimitados de alta resolución (4K)</li>
                <li>Opciones de iluminación avanzadas</li>
                <li>Soporte prioritario</li>
              </ul>
              <br/>
              <em>Nota: Tu plan actual seguirá activo hasta el final del ciclo facturado.</em>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="border-[#444] text-white hover:bg-[#333]">
              Mantener mi plan
            </Button>
            <Button variant="destructive" onClick={handleCancelPlan} disabled={isCancelling} className="bg-red-600 hover:bg-red-700">
              {isCancelling ? "Procesando..." : "Sí, cancelar suscripción"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanManagementPage;