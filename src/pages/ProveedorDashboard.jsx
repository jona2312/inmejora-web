import React, { useEffect, useState } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FileText, Bell, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProveedorDashboard = () => {
  const { provider, logout } = useProveedorAuth();
  const [stats, setStats] = useState({ products: 0, notifications: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (provider?.id) {
      // Mock stats
      setStats({ products: 0, notifications: 0 });
    }
  }, [provider]);

  const handleLogout = async () => {
    await logout();
    navigate('/proveedores/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        
        {provider?.status === 'pending' && (
          <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertTriangle className="text-amber-500 w-6 h-6" />
            <div>
              <h3 className="font-bold text-amber-500">Cuenta en revisión</h3>
              <p className="text-sm text-amber-200">Tu cuenta está siendo verificada por nuestro equipo. Algunas funciones pueden estar limitadas.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido, {provider?.company_name || 'Proveedor'}</h1>
            <p className="text-gray-400 mt-1">Panel de Control de Proveedor</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/proveedores/productos')} className="border-gray-700 hover:bg-white/5">Mis Productos</Button>
            <Button variant="destructive" onClick={handleLogout}>Cerrar Sesión</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#141414] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.products}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#141414] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Apariciones en Cotizaciones</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500 mt-1">Próximamente</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Notificaciones Nuevas</CardTitle>
              <Bell className="h-4 w-4 text-[#FCB048]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FCB048]">{stats.notifications}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
                <div className="flex flex-col gap-3">
                    <Button onClick={() => navigate('/proveedores/productos')} className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10">
                        <Package className="mr-3 h-5 w-5" /> Gestionar Catálogo
                    </Button>
                    <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10">
                        <FileText className="mr-3 h-5 w-5" /> Ver Cotizaciones
                    </Button>
                </div>
            </div>
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-4">Notificaciones Recientes</h3>
                {stats.notifications === 0 ? (
                    <p className="text-gray-500 text-sm">No tienes notificaciones nuevas.</p>
                ) : (
                    <p className="text-gray-500 text-sm">Tienes notificaciones pendientes de leer.</p>
                )}
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ProveedorDashboard;