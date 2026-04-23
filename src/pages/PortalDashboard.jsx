import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, LayoutDashboard, Settings, FileText, Image as ImageIcon, Crown, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
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

const PortalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recientemente';

  const safeCredits = user?.credits ?? 0;
  const safeCreditsCap = user?.creditsCap ?? 5;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Portal Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/portal" className="flex items-baseline">
            <span className="text-2xl font-black text-white tracking-tight">IN</span>
            <span className="text-2xl font-black text-primary tracking-tight ml-0.5">MEJORA</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-muted focus:ring-0 pl-2 pr-4 h-10 rounded-full border border-border">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden sm:inline-block font-medium truncate max-w-[150px]">
                  {user?.name || user?.email || 'Usuario'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card border-border text-foreground" align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={() => navigate('/portal/perfil')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                <Settings className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/portal/renders')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Mis Renders</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/portal/cotizaciones')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                <FileText className="mr-2 h-4 w-4" />
                <span>Mis Cotizaciones</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:bg-muted focus:bg-muted">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Bienvenido, <span className="text-primary">{user?.name || 'Usuario'}</span>
          </h1>
          <p className="text-muted-foreground">Tu centro de control para diseño y cotizaciones.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Info & Stats */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                      <p className="font-medium text-foreground">{user.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Miembro desde</p>
                    <p className="font-medium text-foreground capitalize">{formattedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-lg hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/portal/renders')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Renders Recientes
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Imágenes generadas</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-lg hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/portal/cotizaciones')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Cotizaciones
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Presupuestos solicitados</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Subscription & Actions */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-card to-card border-primary/30 shadow-[0_0_30px_-15px_rgba(212,175,55,0.3)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Crown className="h-5 w-5" /> Mi Suscripción
                </CardTitle>
                <CardDescription className="text-muted-foreground">Plan Gratuito Explorar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-muted-foreground">Créditos disponibles</span>
                    <span className="text-foreground">{safeCredits} / {safeCreditsCap}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(100, (safeCredits / (safeCreditsCap || 1)) * 100)}%` }}></div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/precios')} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  Mejorar Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/portal/renders')}
                  className="w-full justify-start border-border hover:bg-muted hover:text-primary transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Generar Render
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/portal/cotizaciones')}
                  className="w-full justify-start border-border hover:bg-muted hover:text-primary transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" /> Ver Cotizaciones
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/portal/perfil')}
                  className="w-full justify-start border-border hover:bg-muted hover:text-primary transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PortalDashboard;