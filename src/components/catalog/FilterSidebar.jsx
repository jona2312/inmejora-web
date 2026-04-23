import React from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const FilterSidebar = () => {
  const { 
    colorSearch, 
    setColorSearch, 
    colorFamiliesList, 
    selectedFamilies, 
    toggleFamily, 
    resetColorFilters,
    colors
  } = useCatalog();

  const getFamilyCount = (family) => {
    return colors.filter(c => c.familia === family).length;
  };

  const hasActiveFilters = colorSearch !== '' || selectedFamilies.length > 0;

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#FCB048]" /> Filtros
        </h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetColorFilters}
            className="text-xs h-8 text-gray-400 hover:text-white px-2"
          >
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Buscar Color</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              value={colorSearch}
              onChange={(e) => setColorSearch(e.target.value)}
              placeholder="Nombre o código..."
              className="pl-9 bg-[#222] border-[#444] text-white focus-visible:ring-[#FCB048]"
            />
            {colorSearch && (
              <button 
                onClick={() => setColorSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Families */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Familia de Colores</Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {colorFamiliesList.map((family) => (
              <div key={family} className="flex items-center justify-between group">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`family-${family}`}
                    checked={selectedFamilies.includes(family)}
                    onCheckedChange={() => toggleFamily(family)}
                    className="border-[#555] data-[state=checked]:bg-[#FCB048] data-[state=checked]:border-[#FCB048] data-[state=checked]:text-black"
                  />
                  <label 
                    htmlFor={`family-${family}`} 
                    className="text-sm text-gray-400 group-hover:text-white cursor-pointer transition-colors"
                  >
                    {family}
                  </label>
                </div>
                <span className="text-xs text-gray-600 bg-[#222] px-1.5 py-0.5 rounded">
                  {getFamilyCount(family)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;