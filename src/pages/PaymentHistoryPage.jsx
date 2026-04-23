import React, { useState, useEffect } from 'react';
import { Download, Receipt, Loader2, ArrowLeft, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pagosAPI } from '@/utils/pagosAPI';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await pagosAPI.getHistory({ limit, offset });
        const list = data.payments || data || [];
        setPayments(list);
        setHasMore(list.length === limit);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message || "No se pudo cargar el historial de pagos." });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [toast, offset]);

  const handleDownload = async (id) => {
    toast({ title: "Preparando descarga", description: "Tu factura se descargará en unos instantes." });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate('/portal')} className="mb-6 hover:bg-[#222] text-gray-400 px-0">
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Portal
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-black mb-8 flex items-center gap-3">
          <Receipt className="text-[#d4af37] w-10 h-10" /> Historial de Pagos
        </h1>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden shadow-lg">
          {loading && offset === 0 ? (
            <div className="p-24 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#d4af37] mb-4" />
              <p className="text-gray-400">Cargando transacciones...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No hay pagos registrados</h3>
              <p className="text-gray-500 max-w-md">Tus transacciones y suscripciones aparecerán aquí una vez que realices una compra.</p>
              <Button onClick={() => navigate('/precios')} className="mt-6 bg-[#d4af37] text-black hover:bg-[#b5952f]">Ver Planes</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#222] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#333]">
                    <tr>
                      <th className="p-5">Fecha y Hora</th>
                      <th className="p-5">Plan / Concepto</th>
                      <th className="p-5">Monto</th>
                      <th className="p-5">Estado</th>
                      <th className="p-5 text-right">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-[#222]/50 transition-colors group">
                        <td className="p-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center group-hover:bg-[#444] transition-colors">
                            <Calendar className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-300">{formatDate(payment.date || payment.created_at)}</span>
                        </td>
                        <td className="p-5 font-bold text-white">{payment.planName || payment.description || 'Suscripción'}</td>
                        <td className="p-5 font-black text-[#d4af37]">{formatCurrency(payment.amount || 0)}</td>
                        <td className="p-5">
                          <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            payment.status === 'success' || payment.status === 'approved' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : payment.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {payment.status === 'success' || payment.status === 'approved' ? 'Completado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                          </Badge>
                        </td>
                        <td className="p-5 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(payment.id)} className="text-gray-400 hover:text-white hover:bg-[#333] rounded-full">
                            <Download className="w-5 h-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-[#333] flex items-center justify-between bg-[#1a1a1a]">
                 <span className="text-sm text-gray-500">Mostrando {payments.length} transacciones</span>
                 <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setOffset(Math.max(0, offset - limit))} 
                      disabled={offset === 0}
                      className="border-[#444] text-gray-300 hover:bg-[#333]"
                    >
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setOffset(offset + limit)} 
                      disabled={!hasMore}
                      className="border-[#444] text-gray-300 hover:bg-[#333]"
                    >
                      Siguiente
                    </Button>
                 </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentHistoryPage;