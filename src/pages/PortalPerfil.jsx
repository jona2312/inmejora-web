import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const PortalPerfil = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [passData, setPassData] = useState({ current: '', new: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      toast({ title: "Perfil actualizado", description: "Tus datos se guardaron correctamente." });
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    toast({ title: "No implementado", description: "Cambio de contraseña en desarrollo." });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/portal')} className="mb-6 hover:bg-[#222] text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Portal
        </Button>
        
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <User className="text-[#d4af37] w-8 h-8" /> Mi Perfil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] text-center">
              <div className="w-20 h-20 mx-auto bg-[#222] rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-[#d4af37]" />
              </div>
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">Plan Actual</p>
              <p className="font-bold text-[#d4af37] capitalize">{user?.plan_id || 'Explorar'}</p>
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-sm text-gray-400 mb-1">Créditos Disponibles</p>
                <p className="text-2xl font-black">{user?.credits || 0}</p>
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333]">
              <h2 className="text-xl font-bold mb-6 border-b border-[#333] pb-4">Datos Personales</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input className="bg-[#222] border-[#333] mt-1" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input className="bg-[#222] border-[#333] mt-1" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Email (No editable)</Label>
                    <Input className="bg-[#222] border-[#333] mt-1 opacity-50 cursor-not-allowed" value={user?.email || ''} readOnly />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Cambios
                </Button>
              </form>
            </div>

            <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333]">
              <h2 className="text-xl font-bold mb-6 border-b border-[#333] pb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-[#d4af37]" /> Seguridad</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label>Contraseña Actual</Label>
                  <Input type="password" className="bg-[#222] border-[#333] mt-1" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} />
                </div>
                <div>
                  <Label>Nueva Contraseña</Label>
                  <Input type="password" className="bg-[#222] border-[#333] mt-1" value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} />
                </div>
                <Button type="submit" variant="outline" className="border-[#444] text-white hover:bg-[#222]">
                  Actualizar Contraseña
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortalPerfil;