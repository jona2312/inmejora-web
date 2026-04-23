import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Building2, MapPin, Phone, FileText, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplier } from '@/contexts/SupplierContext';
import { useToast } from '@/components/ui/use-toast';

const SupplierRegistrationPage = () => {
  const navigate = useNavigate();
  const { register } = useSupplier();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '', email: '', password: '',
    tax_id: '', phone: '', address: '',
    city: '', province: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await register(formData);
    
    if (result.success) {
      toast({ title: "Registro exitoso", description: "Iniciando sesión..." });
      navigate('/proveedores/portal');
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center py-12 px-4">
      <Link to="/" className="mb-8 flex items-baseline">
        <span className="text-3xl font-black text-white tracking-tight">IN</span>
        <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
        <span className="text-sm text-gray-500 ml-2 font-medium tracking-widest uppercase">Proveedores</span>
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Registro de Proveedor</h1>
          <p className="text-gray-400 mt-2">Únete a nuestra red de proveedores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Nombre de Empresa</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input required name="company_name" value={formData.company_name} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">CUIT / Tax ID</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input required name="tax_id" value={formData.tax_id} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Email de Contacto</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input required name="email" type="email" value={formData.email} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input required name="password" type="password" value={formData.password} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input name="phone" value={formData.phone} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input name="address" value={formData.address} onChange={handleChange} className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Ciudad</Label>
              <Input name="city" value={formData.city} onChange={handleChange} className="bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Provincia</Label>
              <Input name="province" value={formData.province} onChange={handleChange} className="bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37]" />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-4">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Registrarse"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#333] text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link to="/proveedores/login" className="text-[#d4af37] hover:underline font-medium">Inicia sesión</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SupplierRegistrationPage;