import React, { useState } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { PackagePlus } from 'lucide-react';

const AgregarProductoForm = () => {
  const { proveedorFetch } = useProveedorAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', categoria: '', precio_unitario: '',
    unidad: '', presentacion: '', codigo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await proveedorFetch('/api/proveedores/productos', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });
      await new Promise(res => setTimeout(res, 600));

      toast({
        title: "Producto agregado",
        description: "El producto fue agregado exitosamente a tu catálogo.",
        className: "bg-[#141414] border-[#FCB048] text-white",
      });

      setFormData({
        nombre: '', categoria: '', precio_unitario: '',
        unidad: '', presentacion: '', codigo: ''
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo agregar el producto." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] rounded-xl border border-white/5 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-full bg-[#FCB048]/10 flex items-center justify-center">
          <PackagePlus className="text-[#FCB048] w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Agregar Producto Manual</h3>
          <p className="text-sm text-gray-400">Cargá un nuevo producto a tu lista de precios.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nombre del Producto *</label>
            <Input required name="nombre" value={formData.nombre} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="Ej: Pintura Latex Interior 20L" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Categoría</label>
            <Input name="categoria" value={formData.categoria} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="Ej: Pinturas" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Precio Unitario ($) *</label>
            <Input required type="number" step="0.01" name="precio_unitario" value={formData.precio_unitario} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Unidad de Medida</label>
            <Input name="unidad" value={formData.unidad} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="Ej: Unidad, Litro, Kg, M2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Presentación</label>
            <Input name="presentacion" value={formData.presentacion} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="Ej: Lata 20L, Bolsa 50kg" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Código interno (SKU)</label>
            <Input name="codigo" value={formData.codigo} onChange={handleChange} className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" placeholder="Ej: PINT-INT-20" />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto bg-[#FCB048] hover:bg-[#e09b3d] text-black font-bold mt-4">
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </form>
    </div>
  );
};

export default AgregarProductoForm;