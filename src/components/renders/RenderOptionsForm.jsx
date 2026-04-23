import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const styles = ["Moderno", "Clásico", "Minimalista", "Industrial", "Rústico", "Escandinavo"];
const roomTypes = ["Sala", "Dormitorio", "Cocina", "Baño", "Oficina", "Otro"];

const RenderOptionsForm = ({ options, setOptions }) => {
  
  const handleChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 mt-6 bg-[#1a1a1a] border border-[#333] p-5 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Opciones de Renderizado</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Estilo de Diseño</Label>
          <select 
            className="w-full bg-[#222] border border-[#333] text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
            value={options.style}
            onChange={(e) => handleChange('style', e.target.value)}
          >
            <option value="" disabled>Selecciona un estilo</option>
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Tipo de Habitación</Label>
          <select 
            className="w-full bg-[#222] border border-[#333] text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
            value={options.roomType}
            onChange={(e) => handleChange('roomType', e.target.value)}
          >
            <option value="" disabled>Selecciona tipo</option>
            {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-300">Elementos a incluir</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'muebles', label: 'Incluir muebles' },
            { id: 'decoracion', label: 'Incluir decoración' },
            { id: 'plantas', label: 'Incluir plantas' },
            { id: 'iluminacion', label: 'Iluminación natural' }
          ].map(opt => (
            <div key={opt.id} className="flex items-center space-x-2">
              <Checkbox 
                id={opt.id} 
                checked={options.elements[opt.id]}
                onCheckedChange={(checked) => handleChange('elements', { ...options.elements, [opt.id]: checked })}
                className="border-[#d4af37] text-[#d4af37] data-[state=checked]:bg-[#d4af37] data-[state=checked]:text-black"
              />
              <label htmlFor={opt.id} className="text-sm font-medium leading-none text-gray-300 cursor-pointer">
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-gray-300">Prompt Personalizado (Opcional)</Label>
          <span className="text-xs text-gray-500">{options.prompt.length}/500</span>
        </div>
        <Textarea 
          placeholder="Ej: Sofá de terciopelo verde, paredes color crema, mucha luz natural..."
          className="bg-[#222] border-[#333] text-white resize-none h-24 focus-visible:ring-[#d4af37]"
          value={options.prompt}
          onChange={(e) => {
            if(e.target.value.length <= 500) handleChange('prompt', e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default RenderOptionsForm;