import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplier } from '@/contexts/SupplierContext';
import { supplierApiCall } from '@/utils/supplierApi';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { LogOut, Package, Plus, Edit2, Trash2, Loader2, LayoutDashboard } from 'lucide-react';

const SupplierPortalPage = () => {
  const { supplier, logout, validateSession } = useSupplier();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("productos");
  
  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await supplierApiCall('/supplier-products', { method: 'GET' });
      setProducts(data || []);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
    } finally {
      setLoadingProducts(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === 'productos') fetchProducts();
  }, [activeTab, fetchProducts]);

  const handleLogout = () => {
    logout();
  };

  // --- Product Handlers ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEdit = !!currentProduct?.id;
    const method = isEdit ? 'PUT' : 'POST';
    
    try {
      await supplierApiCall('/supplier-products', { method, body: JSON.stringify(currentProduct) });
      toast({ title: isEdit ? "Producto actualizado" : "Producto agregado" });
      setProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct?.id) return;
    try {
      await supplierApiCall('/supplier-products', { method: 'DELETE', body: JSON.stringify({ id: currentProduct.id }) });
      toast({ title: "Producto eliminado" });
      setDeleteModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans">
      <header className="bg-[#1a1a1a] border-b border-[#333] sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-white tracking-tight">IN<span className="text-[#d4af37]">MEJORA</span></span>
            <div className="h-6 w-px bg-[#333] hidden sm:block"></div>
            <span className="text-sm text-gray-400 font-medium hidden sm:block">Portal Proveedores</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={`uppercase hidden sm:inline-flex`}>
              {supplier?.status || 'Activo'}
            </Badge>
            <span className="font-bold text-sm hidden md:block">{supplier?.company_name || 'Proveedor'}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white hover:bg-[#333]">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#333] mb-8 inline-flex rounded-xl p-1">
            <TabsTrigger value="productos" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#d4af37] py-2 px-4 rounded-lg flex items-center gap-2">
              <Package className="w-4 h-4" /> <span className="hidden sm:inline">Mis Productos</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden min-h-[500px]">
            {/* PRODUCTOS TAB */}
            <TabsContent value="productos" className="m-0 p-0">
              <div className="p-6 border-b border-[#333] flex justify-between items-center">
                <h2 className="text-xl font-bold">Catálogo de Productos</h2>
                <Button onClick={() => { setCurrentProduct({ product_name: '', sku: '', category: '', price: '' }); setProductModalOpen(true); }} className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Agregar Manual
                </Button>
              </div>
              <div className="p-0 overflow-x-auto">
                {loadingProducts ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>
                ) : products.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes productos cargados.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#222] text-xs uppercase text-gray-400 border-b border-[#333]">
                      <tr>
                        <th className="p-4 font-medium">SKU</th>
                        <th className="p-4 font-medium">Nombre</th>
                        <th className="p-4 font-medium">Categoría</th>
                        <th className="p-4 font-medium">Precio</th>
                        <th className="p-4 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-[#222]/50">
                          <td className="p-4 text-gray-300 text-sm font-mono">{p.sku || '-'}</td>
                          <td className="p-4 font-medium">{p.product_name}</td>
                          <td className="p-4 text-sm text-gray-400 capitalize">{p.category || '-'}</td>
                          <td className="p-4 font-bold text-[#d4af37]">${parseFloat(p.price || 0).toLocaleString('es-AR')}</td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentProduct(p); setProductModalOpen(true); }} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentProduct(p); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={currentProduct?.sku || ''} onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})} className="bg-[#222] border-[#444]" />
            </div>
            <div className="space-y-2">
              <Label>Nombre del Producto</Label>
              <Input required value={currentProduct?.product_name || ''} onChange={e => setCurrentProduct({...currentProduct, product_name: e.target.value})} className="bg-[#222] border-[#444]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select 
                  required 
                  value={currentProduct?.category || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} 
                  className="w-full bg-[#222] border border-[#444] text-white rounded-md h-10 px-3 focus:outline-none"
                >
                  <option value="">Seleccionar</option>
                  <option value="pintura">Pintura</option>
                  <option value="material">Material</option>
                  <option value="mueble">Mueble</option>
                  <option value="decoracion">Decoración</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Precio ($)</Label>
                <Input required type="number" step="0.01" min="0" value={currentProduct?.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="bg-[#222] border-[#444]" />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setProductModalOpen(false)} className="border-[#444] hover:bg-[#333]">Cancelar</Button>
              <Button type="submit" className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2"><Trash2 className="w-5 h-5"/> Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 sm:justify-between w-full">
            <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)} className="border-[#444] hover:bg-[#333] flex-1">Cancelar</Button>
            <Button type="button" onClick={handleDeleteProduct} className="bg-red-500 text-white hover:bg-red-600 font-bold flex-1">Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierPortalPage;