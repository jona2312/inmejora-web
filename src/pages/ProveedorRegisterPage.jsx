import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Building2, Briefcase, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProveedorRegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    empresa: '',
    rubro: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'El nombre de la empresa es requerido';
    }

    if (!formData.rubro.trim()) {
      newErrors.rubro = 'El rubro es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, revisá los campos del formulario.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu solicitud fue enviada correctamente. Te contactaremos pronto.",
      });

      setTimeout(() => {
        navigate('/proveedores/login');
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrarte. Por favor, intentá nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-400">Redirigiendo al inicio de sesión...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[600px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Registrarse como Proveedor</h1>
            <p className="text-gray-400">Unite a la red de proveedores de INMEJORA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="empresa" className="text-white">Nombre de la Empresa *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                <Input
                  id="empresa"
                  name="empresa"
                  type="text"
                  value={formData.empresa}
                  onChange={handleChange}
                  className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.empresa ? 'border-red-500' : ''}`}
                  placeholder="Ej: Materiales San Martín"
                  disabled={isLoading}
                />
              </div>
              {errors.empresa && <p className="text-red-500 text-sm mt-1">{errors.empresa}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rubro" className="text-white">Rubro *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                <Input
                  id="rubro"
                  name="rubro"
                  type="text"
                  value={formData.rubro}
                  onChange={handleChange}
                  className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.rubro ? 'border-red-500' : ''}`}
                  placeholder="Ej: Materiales de Construcción, Pinturería, Sanitarios"
                  disabled={isLoading}
                />
              </div>
              {errors.rubro && <p className="text-red-500 text-sm mt-1">{errors.rubro}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-white">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.telefono ? 'border-red-500' : ''}`}
                  placeholder="+54 9 11 1234-5678"
                  disabled={isLoading}
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tenés cuenta? <Link to="/proveedores/login" className="text-[#d4af37] hover:underline font-medium">Iniciá sesión</Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProveedorRegisterPage;