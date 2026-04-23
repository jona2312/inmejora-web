import React, { useState, useEffect, useCallback } from 'react';
import { Palette, Package, Search, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { catalogAPI } from '@/utils/catalogAPI';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const LocalFilterSidebar = ({ title, options, selected, onChange }) => (
  <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 hidden lg:block sticky top-28">
    <h3 className="text-lg font-bold text-white mb-4 border-b border-[#333] pb-2">{title}</h3>
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group p-1">
          <input 
            type="checkbox" 
            checked={selected.includes(opt)}
            onChange={() => onChange(opt)}
            className="rounded border-[#444] text-[#d4af37] focus:ring-[#d4af37] bg-[#222] w-4 h-4 transition-colors"
          />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CatalogPage = () => {
  const [activeTab, setActiveTab] = useState('colores');
  
  const [colors, setColors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const families = ['Cálidos', 'Fríos', 'Neutros', 'Pasteles', 'Vibrantes'];
  const categories = ['Pintura Interior', 'Pintura Exterior', 'Esmaltes', 'Impermeabilizantes'];

  const [offset, setOffset] = useState(0);
  const limit = 24;
  const [hasMore, setHasMore] = useState(false);

  const fetchCatalogData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'colores') {
        const data = await catalogAPI.getColors({
          search: searchTerm,
          familia: selectedFamilies.join(','),
          limit,
          offset
        });
        const items = data.colors || data || [];
        setColors(prev => offset === 0 ? items : [...prev, ...items]);
        setHasMore(items.length === limit);
      } else {
        const data = await catalogAPI.getProducts({
          search: searchTerm,
          categoria: selectedCategories.join(','),
          limit,
          offset
        });
        const items = data.products || data || [];
        setProducts(prev => offset === 0 ? items : [...prev, ...items]);
        setHasMore(items.length === limit);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo." });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, selectedFamilies, selectedCategories, offset, toast]);

  useEffect(() => {
    setOffset(0);
  }, [activeTab, searchTerm, selectedFamilies, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalogData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCatalogData]);

  const handleFamilyToggle = (family) => setSelectedFamilies(prev => prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]);
  const handleCategoryToggle = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Catálogo <span className="text-[#d4af37]">Virtual</span></h1>
              <p className="text-gray-400 text-lg">Explora nuestros colores y productos de alta calidad para tu proyecto.</p>
            </div>
            
            <div className="relative w-full md:w-72 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input 
                placeholder={`Buscar en ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#333] text-white h-12 rounded-xl focus-visible:ring-[#d4af37]"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#1a1a1a] border border-[#333] h-auto p-1 mb-8 w-full sm:w-auto inline-flex rounded-xl">
              <TabsTrigger value="colores" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black py-3 px-6 text-sm font-bold w-1/2 sm:w-auto rounded-lg transition-all">
                <Palette className="w-4 h-4 mr-2" /> Colores
              </TabsTrigger>
              <TabsTrigger value="productos" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black py-3 px-6 text-sm font-bold w-1/2 sm:w-auto rounded-lg transition-all">
                <Package className="w-4 h-4 mr-2" /> Productos
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <TabsContent value="colores" className="mt-0 outline-none">
                  <LocalFilterSidebar title="Familias de Color" options={families} selected={selectedFamilies} onChange={handleFamilyToggle} />
                </TabsContent>
                <TabsContent value="productos" className="mt-0 outline-none">
                  <LocalFilterSidebar title="Categorías" options={categories} selected={selectedCategories} onChange={handleCategoryToggle} />
                </TabsContent>
              </div>

              <div className="lg:col-span-3">
                {loading && offset === 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="aspect-square bg-[#1a1a1a] border border-[#333] rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    <TabsContent value="colores" className="mt-0 outline-none">
                      {colors.length === 0 ? (
                         <div className="p-12 text-center text-gray-500 border border-dashed border-[#333] rounded-2xl">No se encontraron colores.</div>
                      ) : (
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {colors.map((c, i) => (
                              <div key={i} className="bg-[#1a1a1a] rounded-2xl p-3 border border-[#333] hover:border-[#d4af37] transition-colors cursor-pointer group">
                                <div className="aspect-square rounded-xl mb-3 shadow-inner" style={{ backgroundColor: c.hex || '#ccc' }} />
                                <p className="font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">{c.name || 'Color'}</p>
                                <p className="text-xs text-gray-500 uppercase">{c.family || 'Neutro'}</p>
                              </div>
                            ))}
                         </div>
                      )}
                    </TabsContent>

                    <TabsContent value="productos" className="mt-0 outline-none">
                      {products.length === 0 ? (
                         <div className="p-12 text-center text-gray-500 border border-dashed border-[#333] rounded-2xl">No se encontraron productos.</div>
                      ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((p, i) => (
                              <div key={i} className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#333] hover:border-[#d4af37] transition-all cursor-pointer flex flex-col h-full group">
                                <div className="aspect-square rounded-xl bg-white mb-4 p-4 flex items-center justify-center overflow-hidden">
                                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" /> : <Package className="w-12 h-12 text-gray-300" />}
                                </div>
                                <h4 className="font-bold text-white mb-1 group-hover:text-[#d4af37] transition-colors">{p.name || 'Producto'}</h4>
                                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{p.description || 'Sin descripción'}</p>
                                <div className="mt-auto pt-4 border-t border-[#333] flex justify-between items-center">
                                    <span className="text-xl font-black text-white">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p.price || 0)}</span>
                                </div>
                              </div>
                            ))}
                         </div>
                      )}
                    </TabsContent>
                    
                    {hasMore && (
                      <div className="mt-10 text-center">
                        <Button 
                          onClick={() => setOffset(prev => prev + limit)} 
                          disabled={loading}
                          variant="outline" 
                          className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-8 py-6 rounded-xl font-bold"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                          {loading ? 'Cargando...' : 'Cargar más resultados'}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Tabs>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;