import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProveedorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useProveedorAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/proveedores/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acceso Proveedores</h1>
            <p className="text-gray-400">Ingresá a tu panel de control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1a1a1a] border-gray-800 text-white"
                placeholder="tu@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1a1a1a] border-gray-800 text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-[#FCB048] hover:bg-[#e09b3d] text-black font-bold">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes cuenta? <Link to="/proveedores/registro" className="text-[#FCB048] hover:underline">Registrate aquí</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProveedorLoginPage;