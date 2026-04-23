import React, { useEffect, useState } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const ProveedorProductsPage = () => {
  const { provider } = useProveedorAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (provider?.id) {
      fetchProducts();
    }
  }, [provider]);

  const fetchProducts = async () => {
    setLoading(true);
    // Mock fetch
    setTimeout(() => {
      setProducts([]);
      setLoading(false);
    }, 400);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      toast({ title: "Eliminado", description: "Producto eliminado correctamente (Simulado)" });
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Productos</h1>
            <p className="text-gray-400 mt-1">Gestiona tu catálogo de materiales y servicios.</p>
          </div>
          <Button onClick={() => navigate('/proveedores/productos/nuevo')} className="bg-[#FCB048] hover:bg-[#e09b3d] text-black">
            <Plus className="w-4 h-4 mr-2" /> Agregar Producto
          </Button>
        </div>

        <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a1a1a] border-b border-white/10 text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-500">Cargando...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-500">No hay productos registrados.</td></tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{product.product_name}</td>
                      <td className="px-6 py-4 capitalize">{product.category}</td>
                      <td className="px-6 py-4">${product.price} {product.currency}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={product.is_active ? "text-green-500 border-green-500/30" : "text-gray-500 border-gray-500/30"}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 mr-2" onClick={() => navigate(`/proveedores/productos/editar/${product.id}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProveedorProductsPage;