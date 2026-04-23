import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, FileText, Image as ImageIcon, Crown, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PortalPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subData, setSubData] = useState({ plan: 'Explorar', credits: 0, cap: 5, renderCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: subs } = await supabase
          .from('client_subscriptions')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (subs && subs.length > 0) {
          const { data: creds } = await supabase
            .from('client_credits')
            .select('*')
            .eq('subscription_id', subs[0].id);
          
          setSubData({
            plan: subs[0].plan || 'Explorar',
            credits: creds?.length > 0 ? creds[0].credits_remaining : 0,
            cap: creds?.length > 0 ? creds[0].credits_total : 5,
            renderCount: creds?.length || 0
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const formattedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Miembro reciente'; 

  const safeName = user?.full_name || user?.name || 'Usuario';
  const safeEmail = user?.email || '-';
  const safePhone = user?.phone || '-';
  
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#333] shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline">
            <span className="text-2xl font-black text-white tracking-tight">IN</span>
            <span className="text-2xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-[#222] focus:ring-0 pl-2 pr-4 h-10 rounded-full border border-[#333] text-white">
                <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 flex items-center justify-center mr-2">
                  <User className="h-4 w-4 text-[#d4af37]" />
                </div>
                <span className="hidden sm:inline-block font-medium truncate max-w-[150px]">
                  {safeName !== 'Usuario' ? safeName : safeEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-[#333] text-white" align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#333]" />
              <DropdownMenuItem onClick={() => navigate('/portal/perfil')} className="cursor-pointer hover:bg-[#333] focus:bg-[#333]">
                <Settings className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/portal/renders')} className="cursor-pointer hover:bg-[#333] focus:bg-[#333]">
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Mis Renders</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/portal/cotizaciones')} className="cursor-pointer hover:bg-[#333] focus:bg-[#333]">
                <FileText className="mr-2 h-4 w-4" />
                <span>Mis Cotizaciones</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333]" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:bg-[#333] focus:bg-[#333]">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
            Bienvenido, <span className="text-[#d4af37]">{safeName}</span>
          </h1>
          <p className="text-gray-400">Tu centro de control para diseño y cotizaciones.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col gap-6">
            <Card className="bg-[#1a1a1a] border-[#333] rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-[#d4af37]" /> Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-white">{safeEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Teléfono</p>
                    <p className="font-medium text-white">{safePhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Miembro desde</p>
                    <p className="font-medium text-white capitalize">{formattedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-[#333] rounded-2xl hover:border-[#d4af37]/50 transition-colors cursor-pointer" onClick={() => navigate('/portal/renders')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between text-white">
                    Renders Recientes <ImageIcon className="h-5 w-5 text-gray-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{subData.renderCount}</p>
                  <p className="text-sm text-gray-400 mt-1">Imágenes generadas</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-[#333] rounded-2xl hover:border-[#d4af37]/50 transition-colors cursor-pointer" onClick={() => navigate('/portal/cotizaciones')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between text-white">
                    Cotizaciones <FileText className="h-5 w-5 text-gray-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">0</p>
                  <p className="text-sm text-gray-400 mt-1">Presupuestos solicitados</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border-[#d4af37]/30 shadow-[0_0_30px_-15px_rgba(212,175,55,0.3)] rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#d4af37]">
                  <Crown className="h-5 w-5" /> Mi Suscripción
                </CardTitle>
                <CardDescription className="text-gray-400 uppercase font-bold">{subData.plan}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-400">Créditos disponibles</span>
                    <span className="text-white">{subData.credits} / {subData.cap}</span>
                  </div>
                  <div className="w-full bg-[#333] rounded-full h-2.5">
                    <div 
                      className="bg-[#d4af37] h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (subData.credits / (subData.cap || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <Button onClick={() => navigate('/precios')} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold rounded-lg">
                  Actualizar Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#333] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={() => navigate('/portal/renders')} className="w-full justify-start border-[#333] bg-[#222] text-white hover:bg-[#333] hover:text-[#d4af37] transition-colors rounded-lg">
                  <PlusCircle className="mr-2 h-4 w-4" /> Generar Render
                </Button>
                <Button variant="outline" onClick={() => navigate('/cotizador')} className="w-full justify-start border-[#333] bg-[#222] text-white hover:bg-[#333] hover:text-[#d4af37] transition-colors rounded-lg">
                  <FileText className="mr-2 h-4 w-4" /> Nueva Cotización
                </Button>
                <Button variant="outline" onClick={() => navigate('/portal/perfil')} className="w-full justify-start border-[#333] bg-[#222] text-white hover:bg-[#333] hover:text-[#d4af37] transition-colors rounded-lg">
                  <Settings className="mr-2 h-4 w-4" /> Configurar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalPage;