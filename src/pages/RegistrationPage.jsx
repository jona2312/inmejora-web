import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, Phone, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateName, validateEmail, validatePassword, validatePhone, validatePasswordMatch } from '@/utils/authValidation';
import { useMercadoPagoCheckout } from '@/hooks/useMercadoPagoCheckout';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planToSubscribe = searchParams.get('plan');
  
  const { register } = useAuth();
  const { toast } = useToast();
  const { handleSubscribe } = useMercadoPagoCheckout();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('weak');

  const handleValidation = (name, value) => {
    let result = { isValid: true, error: null };
    
    if (name === 'name') result = validateName(value);
    if (name === 'email') result = validateEmail(value);
    if (name === 'password') {
      result = validatePassword(value);
      setPasswordStrength(result.strength);
      if (formData.confirmPassword) {
         const matchResult = validatePasswordMatch(value, formData.confirmPassword);
         setErrors(prev => ({ ...prev, confirmPassword: matchResult.error }));
         setValidFields(prev => ({ ...prev, confirmPassword: matchResult.isValid }));
      }
    }
    if (name === 'confirmPassword') {
        result = validatePasswordMatch(formData.password, value);
    }
    if (name === 'phone') result = validatePhone(value);
    if (name === 'terms') {
      result = { isValid: Boolean(value), error: value ? null : "Debes aceptar los términos y condiciones" };
    }

    setErrors(prev => ({ ...prev, [name]: result.error }));
    setValidFields(prev => ({ ...prev, [name]: result.isValid && value !== '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? Boolean(checked) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    handleValidation(name, val);
  };

  const validateAll = () => {
    const nameVal = validateName(formData.name);
    const emailVal = validateEmail(formData.email);
    const passVal = validatePassword(formData.password);
    const matchVal = validatePasswordMatch(formData.password, formData.confirmPassword);
    const phoneVal = validatePhone(formData.phone);
    const termsVal = { isValid: Boolean(formData.terms), error: formData.terms ? null : "Debes aceptar los términos y condiciones" };

    setErrors({
      name: nameVal.error,
      email: emailVal.error,
      password: passVal.error,
      confirmPassword: matchVal.error,
      phone: phoneVal.error,
      terms: termsVal.error
    });

    return nameVal.isValid && emailVal.isValid && passVal.isValid && matchVal.isValid && phoneVal.isValid && termsVal.isValid;
  };

  const isFormValid = 
    validFields.name && 
    validFields.email && 
    validFields.password && 
    validFields.confirmPassword && 
    validFields.phone && 
    formData.terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast({ variant: "destructive", title: "Error de validación", description: "Verifica los datos ingresados y acepta los términos." });
      return;
    }

    setIsLoading(true);
    const result = await register(
      formData.name, 
      formData.email, 
      formData.password, 
      formData.phone, 
      Boolean(formData.terms)
    );
    
    if (result && result.success) {
      if (planToSubscribe) {
        toast({ title: "¡Bienvenido!", description: "Ahora redirigimos a Mercado Pago..." });
        await handleSubscribe(planToSubscribe);
      } else {
        toast({ title: "¡Bienvenido!", description: "Redirigiendo al portal..." });
        setTimeout(() => navigate('/portal'), 1000);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: result?.error || "Ocurrió un error inesperado al procesar el registro.",
      });
      setIsLoading(false);
    }
  };

  const renderStrength = () => {
    if (!formData.password) return null;
    return (
      <div className="flex gap-1 mt-2">
        <div className={`h-1.5 w-1/3 rounded-full transition-colors ${['weak', 'medium', 'strong'].includes(passwordStrength) ? 'bg-red-500' : 'bg-[#333]'}`} />
        <div className={`h-1.5 w-1/3 rounded-full transition-colors ${['medium', 'strong'].includes(passwordStrength) ? 'bg-yellow-500' : 'bg-[#333]'}`} />
        <div className={`h-1.5 w-1/3 rounded-full transition-colors ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-[#333]'}`} />
      </div>
    );
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
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-gray-400 mt-2">
            {planToSubscribe ? "Crea tu cuenta para continuar con tu suscripción" : "Únete a la revolución del diseño de interiores"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 relative">
            <Label htmlFor="name" className="text-white">Nombre completo</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-gray-500" />
              <Input 
                id="name" name="name"
                value={formData.name} onChange={handleChange}
                className={`pl-10 pr-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Juan Pérez"
                disabled={isLoading}
              />
              {validFields.name && <CheckCircle className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1 relative">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-5 w-5 text-gray-500" />
              <Input 
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                className={`pl-10 pr-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                placeholder="tu@email.com"
                disabled={isLoading}
              />
              {validFields.email && <CheckCircle className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1 relative">
            <Label htmlFor="phone" className="text-white">Teléfono</Label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 h-5 w-5 text-gray-500" />
              <Input 
                id="phone" name="phone" type="tel"
                value={formData.phone} onChange={handleChange}
                className={`pl-10 pr-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="+54 9 11 1234-5678"
                disabled={isLoading}
              />
              {validFields.phone && formData.phone && <CheckCircle className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="space-y-1 relative">
            <Label htmlFor="password" className="text-white">Contraseña</Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
              <Input 
                id="password" name="password" type={showPassword ? "text" : "password"}
                value={formData.password} onChange={handleChange}
                className={`pl-10 pr-20 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {validFields.password && <CheckCircle className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            {renderStrength()}
          </div>

          <div className="space-y-1 relative">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar Contraseña</Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
              <Input 
                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword} onChange={handleChange}
                className={`pl-10 pr-20 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-10 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {validFields.confirmPassword && <CheckCircle className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" id="terms" name="terms"
              checked={formData.terms} onChange={handleChange}
              className="rounded border-[#333] text-[#d4af37] focus:ring-[#d4af37] bg-[#222] w-4 h-4" 
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm font-normal text-gray-400 cursor-pointer">
              Acepto los <Link to="/terminos-y-condiciones" className="text-[#d4af37] hover:underline">términos y condiciones</Link>
            </Label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

          <Button 
            type="submit" disabled={isLoading || !isFormValid}
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Crear Cuenta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link to={`/login${planToSubscribe ? `?plan=${planToSubscribe}` : ''}`} className="text-[#d4af37] hover:underline font-medium">Inicia sesión</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;