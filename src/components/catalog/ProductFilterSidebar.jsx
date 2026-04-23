import React from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ProductFilterSidebar = () => {
  const { 
    productSearch, 
    setProductSearch, 
    productCategoriesList,
    productUsesList,
    productFinishesList,
    selectedCategories, 
    toggleCategory,
    selectedUses,
    toggleUse,
    selectedFinishes,
    toggleFinish,
    resetProductFilters,
    products
  } = useCatalog();

  const getCount = (field, value) => {
    return products.filter(p => p[field] === value).length;
  };

  const hasActiveFilters = productSearch !== '' || selectedCategories.length > 0 || selectedUses.length > 0 || selectedFinishes.length > 0;

  const FilterSection = ({ title, list, selected, toggleFn, field }) => (
    <div className="space-y-3 pt-4 border-t border-[#333]">
      <Label className="text-sm font-medium text-gray-300">{title}</Label>
      <div className="space-y-2">
        {list.map((item) => (
          <div key={item} className="flex items-center justify-between group">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`filter-${field}-${item}`}
                checked={selected.includes(item)}
                onCheckedChange={() => toggleFn(item)}
                className="border-[#555] data-[state=checked]:bg-[#FCB048] data-[state=checked]:border-[#FCB048] data-[state=checked]:text-black"
              />
              <label 
                htmlFor={`filter-${field}-${item}`} 
                className="text-sm text-gray-400 group-hover:text-white cursor-pointer transition-colors"
              >
                {item}
              </label>
            </div>
            <span className="text-xs text-gray-600 bg-[#222] px-1.5 py-0.5 rounded">
              {getCount(field, item)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

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
            onClick={resetProductFilters}
            className="text-xs h-8 text-gray-400 hover:text-white px-2"
          >
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <Label className="text-sm font-medium text-gray-300">Buscar Producto</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Nombre..."
            className="pl-9 bg-[#222] border-[#444] text-white focus-visible:ring-[#FCB048]"
          />
          {productSearch && (
            <button 
              onClick={() => setProductSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Categoría" list={productCategoriesList} selected={selectedCategories} toggleFn={toggleCategory} field="categoria" />
      <FilterSection title="Uso" list={productUsesList} selected={selectedUses} toggleFn={toggleUse} field="uso" />
      <FilterSection title="Acabado" list={productFinishesList} selected={selectedFinishes} toggleFn={toggleFinish} field="acabado" />
      
    </div>
  );
};

export default ProductFilterSidebar;