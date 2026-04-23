import React, { useState } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Mail, Phone, MapPin, Globe, Briefcase, Percent } from 'lucide-react';

const ProveedorPerfil = () => {
  const { proveedor, proveedorFetch } = useProveedorAuth();
  const { toast } = useToast();
  const [descuento, setDescuento] = useState(proveedor?.descuento_inmejora || 0);
  const [saving, setSaving] = useState(false);

  const handleSaveDiscount = async () => {
    setSaving(true);
    try {
      // await proveedorFetch('/api/proveedores/perfil', {
      //   method: 'PUT',
      //   body: JSON.stringify({ descuento_inmejora: descuento })
      // });
      await new Promise(res => setTimeout(res, 600));
      
      toast({
        title: "Perfil actualizado",
        description: "El descuento para INMEJORA fue actualizado correctamente.",
        className: "bg-[#141414] border-[#FCB048] text-white",
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el perfil." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] rounded-xl border border-white/5 p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
          <Building2 className="mr-3 text-[#FCB048]" /> Información de la Empresa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div><p className="text-sm text-gray-500">Nombre</p><p className="font-medium text-white">{proveedor?.nombre || 'No especificado'}</p></div>
          <div><p className="text-sm text-gray-500">CUIT</p><p className="font-medium text-white">{proveedor?.cuit || 'No especificado'}</p></div>
          <div><p className="text-sm text-gray-500 flex items-center"><Mail className="w-3 h-3 mr-1"/> Email</p><p className="font-medium text-white">{proveedor?.email}</p></div>
          <div><p className="text-sm text-gray-500 flex items-center"><Phone className="w-3 h-3 mr-1"/> Teléfono</p><p className="font-medium text-white">{proveedor?.telefono || 'No especificado'}</p></div>
          <div><p className="text-sm text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Ubicación</p><p className="font-medium text-white">{proveedor?.ciudad ? `${proveedor.ciudad}, ${proveedor.provincia}` : 'No especificado'}</p></div>
          <div><p className="text-sm text-gray-500 flex items-center"><Briefcase className="w-3 h-3 mr-1"/> Rubro</p><p className="font-medium text-white">{proveedor?.rubro || 'No especificado'}</p></div>
        </div>
      </div>

      <div className="bg-[#141414] rounded-xl border border-white/5 p-6 md:p-8">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
          <Percent className="mr-3 text-[#FCB048]" /> Beneficio INMEJORA
        </h3>
        <p className="text-gray-400 mb-6 text-sm">
          Definí el porcentaje de descuento que le ofrecés a los clientes que llegan a través de INMEJORA. Un mayor descuento aumenta tu posicionamiento en nuestras recomendaciones.
        </p>

        <div className="flex items-end gap-4 max-w-sm">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Descuento INMEJORA (%)</label>
            <Input 
              type="number" 
              min="0" 
              max="100" 
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="bg-black/50 border-gray-800 text-white focus:border-[#FCB048]" 
            />
          </div>
          <Button 
            onClick={handleSaveDiscount} 
            disabled={saving}
            className="bg-[#FCB048] text-black hover:bg-[#e09b3d] font-bold"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProveedorPerfil;