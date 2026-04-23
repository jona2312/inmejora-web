import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProveedorProductFormPage = () => {
  const { id } = useParams();
  const { provider } = useProveedorAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'material',
    description: '',
    price: '',
    currency: 'ARS',
    sku: '',
    stock: 0,
    is_active: true
  });

  useEffect(() => {
    if (id) {
      // Mock fetch product
      toast({ title: "Aviso", description: "Carga de producto simulada (Supabase inactivo)" });
    }
  }, [id, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider?.id) return;
    
    setLoading(true);
    
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);

    toast({ title: "Éxito", description: "Producto guardado correctamente (Simulado)" });
    navigate('/proveedores/productos');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/proveedores/productos')} className="mb-6 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">{id ? 'Editar' : 'Agregar'} Producto</h1>

        <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Producto *</label>
              <Input name="product_name" required value={formData.product_name} onChange={handleChange} className="bg-[#1a1a1a] border-gray-800 text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 text-white rounded-md h-10 px-3">
                <option value="material">Materiales de Construcción</option>
                <option value="pintura">Pinturas y Revestimientos</option>
                <option value="mueble">Mobiliario</option>
                <option value="decoracion">Decoración</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SKU / Código</label>
              <Input name="sku" value={formData.sku || ''} onChange={handleChange} className="bg-[#1a1a1a] border-gray-800 text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Precio *</label>
              <div className="flex gap-2">
                  <Input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="bg-[#1a1a1a] border-gray-800 text-white flex-grow" />
                  <select name="currency" value={formData.currency} onChange={handleChange} className="w-24 bg-[#1a1a1a] border border-gray-800 text-white rounded-md h-10 px-3">
                      <option value="ARS">ARS</option>
                      <option value="USD">USD</option>
                  </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock Disponible</label>
              <Input type="number" name="stock" value={formData.stock} onChange={handleChange} className="bg-[#1a1a1a] border-gray-800 text-white" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <Textarea name="description" value={formData.description || ''} onChange={handleChange} className="bg-[#1a1a1a] border-gray-800 text-white" rows={4} />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 rounded bg-gray-800 border-gray-700" />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-300">Producto Activo (Visible en cotizaciones)</label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10 mt-6">
            <Button type="submit" disabled={loading} className="bg-[#FCB048] hover:bg-[#e09b3d] text-black font-bold px-8">
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />} Guardar Producto
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ProveedorProductFormPage;