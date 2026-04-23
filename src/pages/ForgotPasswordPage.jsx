import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail } from '@/utils/authValidation';
import { supabase } from '@/lib/customSupabaseClient';

// Documentación de enlace esperado:
// El correo electrónico enviado por Supabase contendrá un enlace con el siguiente formato si se usa PKCE:
// https://[tu-dominio]/reset-password?code=xxxx
// O si se usa hash implícito u OTP:
// https://[tu-dominio]/reset-password?token=xxxx o #access_token=xxxx

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error || "Formato de email inválido");
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      // Uso correcto de Supabase para envío de email de recuperación
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setIsSent(true);
      setEmail('');
      toast({ 
        title: "¡Email enviado!", 
        description: "Se ha enviado un correo de recuperación.",
        variant: "default" 
      });
    } catch (err) {
      console.error('[ForgotPassword] Error:', err);
      const errorMessage = "Ocurrió un error al intentar enviar el correo. Verifica tu conexión e intenta nuevamente.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "No se pudo procesar la solicitud",
        description: errorMessage,
      });
    } finally {
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
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">Recuperar Contraseña</h1>
                <p className="text-gray-400 mt-2">Ingresa tu email y te enviaremos instrucciones.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email registrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input 
                      id="email" type="email"
                      value={email} onChange={e => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className={`pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      placeholder="tu@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" disabled={isLoading || !email.trim()}
                  className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Enlace de Recuperación"
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#d4af37]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Revisa tu correo</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Hemos enviado un enlace de recuperación. Si el email existe en nuestro sistema, recibirás instrucciones para resetear tu contraseña en breve. Verifica también tu carpeta de spam.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="w-full bg-[#d4af37] text-black font-bold py-6 rounded-lg hover:bg-[#b5952f] transition-colors"
              >
                Volver a iniciar sesión
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSent && (
          <div className="mt-8 pt-6 border-t border-[#333] flex flex-col items-center gap-4 text-sm">
            <Link to="/login" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
            </Link>
            <div className="text-gray-400">
              ¿No tienes cuenta? <Link to="/registro" className="text-[#d4af37] hover:underline font-medium">Crear cuenta</Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;