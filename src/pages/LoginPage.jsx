import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const emailVal = validateEmail(formData.email);
    const passVal = validatePassword(formData.password);
    
    setErrors({
      email: emailVal.error,
      password: passVal.error
    });
    
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
        toast({
          variant: "destructive",
          title: "Error de acceso",
          description: result?.error || "Las credenciales son incorrectas.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "No pudimos procesar tu inicio de sesión. Intenta de nuevo.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col justify-center items-center p-4">
      <Link to="/" className="mb-8 flex items-baseline">
        <span className="text-3xl font-black text-white tracking-tight">IN</span>
        <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-gray-400 mt-2">Accede a tu panel de control</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
              <Input 
                id="email" type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              <Link to="/forgot-password" className="text-sm text-[#d4af37] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <PasswordInput 
              id="password"
              leftIcon={Lock}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className={`bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" id="remember" 
              checked={formData.remember}
              onChange={e => setFormData({...formData, remember: e.target.checked})}
              className="rounded border-[#333] text-[#d4af37] focus:ring-[#d4af37] bg-[#222] w-4 h-4 cursor-pointer"
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal text-gray-400 cursor-pointer">
              Recuérdame
            </Label>
          </div>

          <Button 
            type="submit" disabled={isLoading}
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-4 rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Iniciando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          ¿No tenés cuenta? <Link to="/registro" className="text-[#d4af37] hover:underline font-medium">Registrate</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;