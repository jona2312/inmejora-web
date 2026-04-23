import React, { useState, useEffect } from 'react';
import { User, Shield, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { validateName, validatePhone, validatePassword, validatePasswordMatch } from '@/utils/authValidation';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passErrors, setPassErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setProfileErrors({ ...profileErrors, [e.target.name]: null });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    setPassErrors({ ...passErrors, [e.target.name]: null });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const nameVal = validateName(formData.name);
    const phoneVal = validatePhone(formData.phone);
    
    if (!nameVal.isValid || !phoneVal.isValid) {
      setProfileErrors({ name: nameVal.error, phone: phoneVal.error });
      return;
    }

    setLoadingProfile(true);
    const result = await updateProfile({ name: formData.name, phone: formData.phone });
    if (result && result.success) {
      toast({ title: "Perfil actualizado", description: "Tus datos se guardaron correctamente." });
    }
    setLoadingProfile(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const passVal = validatePassword(passData.new);
    const matchVal = validatePasswordMatch(passData.new, passData.confirm);
    
    if (!passVal.isValid || !matchVal.isValid || !passData.current) {
      setPassErrors({ 
        current: !passData.current ? "La contraseña actual es requerida" : null,
        new: passVal.error, 
        confirm: matchVal.error 
      });
      return;
    }

    toast({ title: "Atención", description: "🚧 El cambio de contraseña está en desarrollo. ¡Pronto disponible! 🚀" });
    setPassData({ current: '', new: '', confirm: '' });
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
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] text-center">
              <div className="w-20 h-20 mx-auto bg-[#222] rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-[#d4af37]" />
              </div>
              <h3 className="font-bold text-lg">{user?.name || 'Usuario'}</h3>
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

          <div className="md:col-span-2 space-y-8">
            <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333]">
              <h2 className="text-xl font-bold mb-6 border-b border-[#333] pb-4">Datos Personales</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input name="name" className={`bg-[#222] border-[#333] mt-1 ${profileErrors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={handleProfileChange} />
                    {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input name="phone" className={`bg-[#222] border-[#333] mt-1 ${profileErrors.phone ? 'border-red-500' : ''}`} value={formData.phone} onChange={handleProfileChange} />
                    {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Email (No editable)</Label>
                    <Input className="bg-[#222] border-[#333] mt-1 opacity-50 cursor-not-allowed text-gray-400" value={user?.email || ''} readOnly />
                  </div>
                </div>
                <Button type="submit" disabled={loadingProfile} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
                  {loadingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Cambios
                </Button>
              </form>
            </div>

            <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333]">
              <h2 className="text-xl font-bold mb-6 border-b border-[#333] pb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-[#d4af37]" /> Seguridad</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label>Contraseña Actual</Label>
                  <Input type="password" name="current" className={`bg-[#222] border-[#333] mt-1 ${passErrors.current ? 'border-red-500' : ''}`} value={passData.current} onChange={handlePassChange} />
                  {passErrors.current && <p className="text-red-500 text-xs mt-1">{passErrors.current}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nueva Contraseña</Label>
                    <Input type="password" name="new" className={`bg-[#222] border-[#333] mt-1 ${passErrors.new ? 'border-red-500' : ''}`} value={passData.new} onChange={handlePassChange} />
                    {passErrors.new && <p className="text-red-500 text-xs mt-1">{passErrors.new}</p>}
                  </div>
                  <div>
                    <Label>Confirmar Contraseña</Label>
                    <Input type="password" name="confirm" className={`bg-[#222] border-[#333] mt-1 ${passErrors.confirm ? 'border-red-500' : ''}`} value={passData.confirm} onChange={handlePassChange} />
                    {passErrors.confirm && <p className="text-red-500 text-xs mt-1">{passErrors.confirm}</p>}
                  </div>
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

export default ProfilePage;