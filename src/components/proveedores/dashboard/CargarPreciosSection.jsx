import React, { useState } from 'react';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

const CargarPreciosSection = () => {
  const { proveedorFetch } = useProveedorAuth();
  const { toast } = useToast();
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const endpoint = type === 'excel' ? '/api/proveedores/upload-precios' : '/api/proveedores/upload-pdf';
    const setLoading = type === 'excel' ? setLoadingExcel : setLoadingPdf;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // await proveedorFetch(endpoint, {
      //   method: 'POST',
      //   body: formData
      // });
      await new Promise(res => setTimeout(res, 1500)); // mock processing time

      toast({
        title: "Archivo procesado exitosamente",
        description: `Se han actualizado los precios desde tu archivo ${type.toUpperCase()}.`,
        className: "bg-[#141414] border-[#FCB048] text-white",
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Hubo un problema al procesar el archivo." });
    } finally {
      setLoading(false);
      e.target.value = null; // Reset input
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Excel/CSV Upload */}
        <div className="bg-[#141414] rounded-xl border border-white/5 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FCB048]/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] z-0" />
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Subir Excel o CSV</h3>
            <p className="text-gray-400 text-sm mb-6">
              Actualizá miles de productos a la vez subiendo tu lista de precios en formato tabular.
            </p>
            <div className="relative w-full">
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => handleFileUpload(e, 'excel')}
                disabled={loadingExcel}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
              <Button disabled={loadingExcel} className="w-full bg-[#1a1a1a] border border-gray-700 text-white hover:bg-white/5">
                {loadingExcel ? 'Procesando...' : <><UploadCloud className="w-4 h-4 mr-2" /> Seleccionar Archivo</>}
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Upload */}
        <div className="bg-[#141414] rounded-xl border border-white/5 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FCB048]/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] z-0" />
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Subir PDF</h3>
            <p className="text-gray-400 text-sm mb-6">
              Usamos Inteligencia Artificial para extraer los productos y precios directamente de tus PDFs.
            </p>
            <div className="relative w-full">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => handleFileUpload(e, 'pdf')}
                disabled={loadingPdf}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
              <Button disabled={loadingPdf} className="w-full bg-[#1a1a1a] border border-gray-700 text-white hover:bg-white/5">
                {loadingPdf ? 'Analizando PDF...' : <><UploadCloud className="w-4 h-4 mr-2" /> Seleccionar PDF</>}
              </Button>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-[#FCB048] shrink-0 mt-1" />
        <div>
          <h4 className="font-medium text-white mb-1">¿Cómo funciona la actualización?</h4>
          <p className="text-sm text-gray-400">
            Al subir un nuevo archivo, nuestro sistema identificará los productos por su nombre o código. Si el producto ya existe, se actualizará su precio automáticamente. Si es nuevo, se agregará a tu catálogo. Los productos que no estén en el archivo no serán eliminados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CargarPreciosSection;