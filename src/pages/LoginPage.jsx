import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { validateEmail, validatePassword } from '@/utils/authValidation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const emailVal = validateEmail(formData.email);
    const passVal = validatePassword(formData.password);
    setErrors({ email: emailVal.error, password: passVal.error });
    return emailVal.isValid && passVal.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({ variant: "destructive", title: "Error", description: "Revisa los campos ingresados." });
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result && result.success) {
        toast({ title: "¡Bienvenido de vuelta!" });
        navigate('/portal');
      } else {
        toast({ variant: "destructive", title: "Error de acceso", description: result?.error || "Las credenciales son incorrectas." });
        setIsLoading(false);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error inesperado", description: "No pudimos procesar tu inicio de sesión. Intenta de nuevo." });
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: "Renders con IA en minutos" },
    { icon: Shield, text: "Plataforma 100% segura" },
    { icon: Star, text: "Más de 200 proyectos realizados" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] flex-col justify-between p-12 relative overflow-hidden">
        {/* Gold accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-[#d4af37]" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full border border-[#d4af37]" />
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-baseline z-10">
          <span className="text-3xl font-black text-white tracking-tight">IN</span>
          <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
        </Link>

        {/* Center content */}
        <div className="z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Visualizá tu reforma<br />
            <span className="text-[#d4af37]">antes de hacerla.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Renders fotorrealistas con IA, cotizaciones online y gestión completa de tu proyecto.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="z-10 bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />)}
          </div>
          <p className="text-gray-300 text-sm italic">"El render fue exactamente lo que imaginé. En 3 días tenía la vista previa de mi cocina nueva."</p>
          <p className="text-gray-500 text-xs mt-2">— Marcela R., Lomas de Zamora</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 bg-[#0f0f0f] flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Mobile logo */}
        <Link to="/" className="flex items-baseline mb-10 lg:hidden">
          <span className="text-3xl font-black text-white tracking-tight">IN</span>
          <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
            <p className="text-gray-400 mt-1">Accedé a tu panel de control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                <Input
                  id="email" type="email" autoComplete="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={`pl-10 h-11 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37] rounded-lg transition-colors ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300 text-sm">Contraseña</Label>
                <Link to="/forgot-password" className="text-xs text-[#d4af37] hover:text-[#b5952f] transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <PasswordInput
                id="password" autoComplete="current-password"
                leftIcon={Lock}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className={`h-11 bg-[#1a1a1a] border-[#2a2a2a] text-white focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37] rounded-lg transition-colors ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="remember"
                checked={formData.remember}
                onChange={e => setFormData({...formData, remember: e.target.checked})}
                className="rounded border-[#333] text-[#d4af37] focus:ring-[#d4af37] bg-[#1a1a1a] w-4 h-4 cursor-pointer"
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-500 cursor-pointer">
                Recuérdame
              </Label>
            </div>

            <Button
              type="submit" disabled={isLoading}
              className="w-full h-12 bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold text-base rounded-lg transition-colors mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Ingresando...</>
              ) : "Ingresar"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e1e1e] text-center text-sm text-gray-500">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-[#d4af37] hover:text-[#b5952f] font-medium transition-colors">
              Registrate gratis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;