import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    // Mock fetch
    setTimeout(() => {
      setProviders([]);
      setLoading(false);
    }, 500);
  };

  const updateStatus = async (id, status) => {
    toast({ title: "Estado Actualizado", description: `Estado cambiado a ${status} (Simulado)` });
    fetchProviders();
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/50';
          case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
          case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/50';
          case 'suspended': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
          default: return 'bg-gray-800 text-gray-400';
      }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Administración de Proveedores</h1>

        <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a1a1a] border-b border-white/10 text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">CUIT</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">Cargando...</td></tr>
                ) : providers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No hay proveedores registrados.</td></tr>
                ) : (
                  providers.map(prov => (
                    <tr key={prov.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{prov.company_name}</td>
                      <td className="px-6 py-4">{prov.email}</td>
                      <td className="px-6 py-4">{prov.tax_id}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(prov.status)}>
                          {prov.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {prov.status === 'pending' && (
                            <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white" onClick={() => updateStatus(prov.id, 'approved')}>Aprobar</Button>
                                <Button size="sm" variant="destructive" onClick={() => updateStatus(prov.id, 'rejected')}>Rechazar</Button>
                            </>
                        )}
                        {prov.status === 'approved' && (
                             <Button size="sm" variant="outline" className="border-gray-600" onClick={() => updateStatus(prov.id, 'suspended')}>Suspender</Button>
                        )}
                        {prov.status === 'suspended' && (
                             <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white" onClick={() => updateStatus(prov.id, 'approved')}>Reactivar</Button>
                        )}
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

export default AdminProvidersPage;