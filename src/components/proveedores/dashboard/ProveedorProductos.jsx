import React, { useState, useEffect } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, PackageSearch } from 'lucide-react';

const ProveedorProductos = () => {
  const { proveedorFetch } = useProveedorAuth();
  const { toast } = useToast();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      // const res = await proveedorFetch('/api/proveedores/productos');
      // const data = await res.json();
      await new Promise(res => setTimeout(res, 800));
      // Mock data
      setProductos([
        { id: 1, nombre: 'Cemento Loma Negra', categoria: 'Materiales Básicos', precio_unitario: 8500, unidad: 'Bolsa', presentacion: '50kg', codigo: 'CEM-01' },
        { id: 2, nombre: 'Ladrillo Hueco 18x18x33', categoria: 'Mampostería', precio_unitario: 450, unidad: 'Unidad', presentacion: 'Pallet x 100', codigo: 'LAD-18' }
      ]);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      // await proveedorFetch(`/api/proveedores/productos/${id}`, { method: 'DELETE' });
      await new Promise(res => setTimeout(res, 400));
      setProductos(productos.filter(p => p.id !== id));
      toast({ title: "Producto eliminado", description: "El producto se eliminó correctamente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar." });
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-10">Cargando productos...</div>;

  return (
    <div className="bg-[#141414] rounded-xl border border-white/5 overflow-hidden">
      {productos.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <PackageSearch className="w-16 h-16 text-gray-700 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No hay productos cargados aún</h3>
          <p className="text-gray-400">Agregá productos manualmente o subí tu lista de precios.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Código</th>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Presentación / Unidad</th>
                <th className="px-6 py-4 font-medium">Precio Unit.</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {productos.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{p.codigo || '-'}</td>
                  <td className="px-6 py-4 font-medium text-white">{p.nombre}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 rounded-md text-xs">{p.categoria || 'General'}</span>
                  </td>
                  <td className="px-6 py-4">{p.presentacion || '-'} ({p.unidad})</td>
                  <td className="px-6 py-4 text-[#FCB048] font-medium">${p.precio_unitario}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-400 hover:bg-red-400/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProveedorProductos;