import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const token = searchParams.get('token');
  const code = searchParams.get('code');
  
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenError, setTokenError] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      setIsValidatingToken(true);
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (token) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: 'recovery' });
          if (error) throw error;
        } else {
          // Verify existing session as fallback
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error('No session or token provided');
          }
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setTokenError("El enlace de restablecimiento ha expirado o es inválido.");
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateSession();
  }, [code, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.general) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password.length < 8) {
      setErrors({ general: "La contraseña debe tener al menos 8 caracteres." });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ general: "Las contraseñas no coinciden." });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.password });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({ 
        title: "¡Éxito!",
        description: "Contraseña actualizada correctamente.",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setErrors({ general: "Ocurrió un error al actualizar la contraseña. Intenta de nuevo." });
      toast({ variant: "destructive", title: "Error", description: "Ocurrió un error al actualizar." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col justify-center items-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-[500px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20" />
          
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-black text-white tracking-tight">IN</span>
              <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Restablecer Contraseña</h1>
            <p className="text-gray-400 mt-2 text-sm">Crea una nueva contraseña para tu cuenta.</p>
          </div>

          <AnimatePresence mode="wait">
            {isValidatingToken ? (
              <motion.div 
                key="loading" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="w-12 h-12 animate-spin text-[#d4af37] mb-4" />
                <p className="text-white font-medium">Validando enlace seguro...</p>
              </motion.div>
            ) : tokenError ? (
              <motion.div 
                key="error" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Enlace Inválido</h2>
                <p className="text-red-400 mb-8">{tokenError}</p>
                <Button 
                  onClick={() => navigate('/forgot-password')} 
                  className="w-full bg-[#333] hover:bg-[#444] text-white font-medium py-6 rounded-xl transition-colors"
                >
                  Solicitar un nuevo enlace
                </Button>
              </motion.div>
            ) : isSuccess ? (
              <motion.div 
                key="success" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
                <p className="text-gray-400 mb-8">Serás redirigido al inicio de sesión en unos segundos...</p>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-6 rounded-xl"
                >
                  Ir al Inicio de Sesión
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                key="form" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                {errors.general && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm font-medium">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white ml-1">Nueva Contraseña</Label>
                  <PasswordInput 
                    id="password" 
                    name="password" 
                    leftIcon={Lock}
                    value={formData.password} 
                    onChange={handleChange}
                    className="bg-[#222] border-[#444] text-white focus-visible:ring-[#d4af37] rounded-xl h-14"
                    placeholder="Min. 8 caracteres"
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white ml-1">Confirmar Contraseña</Label>
                  <PasswordInput 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    leftIcon={Lock}
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    className="bg-[#222] border-[#444] text-white focus-visible:ring-[#d4af37] rounded-xl h-14"
                    placeholder="Repite tu contraseña"
                    disabled={isUpdating}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating || !formData.password || !formData.confirmPassword} 
                  className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar Contraseña"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;