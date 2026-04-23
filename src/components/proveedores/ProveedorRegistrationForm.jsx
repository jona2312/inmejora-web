import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Mail, Phone, MapPin, Globe, Lock, Briefcase } from 'lucide-react';

const ProveedorRegistrationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', email: '', telefono: '', cuit: '',
    rubro: '', descripcion: '', ciudad: '', provincia: '',
    website: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Las contraseñas no coinciden." });
      return;
    }

    setLoading(true);
    try {
      // Mock API call since backend is not available
      // const response = await fetch('/api/proveedores/registro', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu solicitud fue enviada. El equipo de INMEJORA va a revisar tu información y te contactaremos para activar tu cuenta. Revisá tu email.",
        className: "bg-[#141414] border-[#FCB048] text-white",
      });
      
      setFormData({
        nombre: '', email: '', telefono: '', cuit: '', rubro: '', descripcion: '',
        ciudad: '', provincia: '', website: '', password: '', confirmPassword: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registro-proveedores" className="py-24 bg-[#0a0a0a] relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCB048]/5 rounded-full blur-[80px]" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Unite a nuestra red</h2>
            <p className="text-gray-400">Completá tus datos para registrarte como proveedor oficial de INMEJORA.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#FCB048]"/> Nombre de la Empresa</label>
                <Input required name="nombre" value={formData.nombre} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="Ej: Materiales San Juan" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#FCB048]"/> CUIT</label>
                <Input required name="cuit" value={formData.cuit} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="30-12345678-9" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Mail className="w-4 h-4 text-[#FCB048]"/> Email Comercial</label>
                <Input required type="email" name="email" value={formData.email} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="ventas@empresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Phone className="w-4 h-4 text-[#FCB048]"/> Teléfono / WhatsApp</label>
                <Input required name="telefono" value={formData.telefono} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="+54 9 11 1234-5678" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FCB048]"/> Ciudad</label>
                <Input required name="ciudad" value={formData.ciudad} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="CABA" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FCB048]"/> Provincia</label>
                <Input required name="provincia" value={formData.provincia} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="Buenos Aires" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Globe className="w-4 h-4 text-[#FCB048]"/> Sitio Web (Opcional)</label>
                <Input name="website" value={formData.website} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="www.tuempresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#FCB048]"/> Rubro Principal</label>
                <Input required name="rubro" value={formData.rubro} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="Ej: Sanitarios, Pinturas, etc." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Descripción de la Empresa</label>
              <Textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048] min-h-[100px]" placeholder="Contanos brevemente sobre los productos que ofrecés..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Lock className="w-4 h-4 text-[#FCB048]"/> Contraseña</label>
                <Input required type="password" name="password" value={formData.password} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Lock className="w-4 h-4 text-[#FCB048]"/> Confirmar Contraseña</label>
                <Input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="bg-black/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FCB048]" placeholder="Repetí tu contraseña" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#FCB048] hover:bg-[#e09b3d] text-black font-bold text-lg py-6 mt-8">
              {loading ? 'Enviando solicitud...' : 'Solicitar Alta de Proveedor'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProveedorRegistrationForm;