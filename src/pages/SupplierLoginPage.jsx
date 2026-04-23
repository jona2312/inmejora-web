import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useSupplier } from '@/contexts/SupplierContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SupplierLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useSupplier();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast({ title: "Bienvenido al Portal de Proveedores" });
      const from = location.state?.from?.pathname || '/proveedores/portal';
      navigate(from, { replace: true });
    } else {
      setApiError(result.error || "Credenciales incorrectas");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col justify-center items-center p-4">
      <Link to="/" className="mb-8 flex items-baseline">
        <span className="text-3xl font-black text-white tracking-tight">IN</span>
        <span className="text-3xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
        <span className="text-sm text-gray-500 ml-2 font-medium tracking-widest uppercase">Proveedores</span>
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[450px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Acceso Proveedores</h1>
          <p className="text-gray-400 mt-2">Gestiona tus productos y listas de precios</p>
        </div>

        {apiError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-white">Email Corporativo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input 
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg"
                placeholder="ventas@empresa.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-white">Contraseña</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input 
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="pl-10 bg-[#222] border-[#333] text-white focus-visible:ring-[#d4af37] rounded-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg mt-4 rounded-lg">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Ingresar al Portal"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          ¿Querés sumarte como proveedor? <Link to="/proveedores/registro" className="text-[#d4af37] hover:underline font-medium">Solicitar Alta</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SupplierLoginPage;