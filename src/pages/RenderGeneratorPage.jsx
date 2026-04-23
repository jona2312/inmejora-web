import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RenderOptionsForm from '@/components/renders/RenderOptionsForm';
import CreditsDisplay from '@/components/renders/CreditsDisplay';
import RenderGallerySection from '@/components/renders/RenderGallerySection';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { rendersAPI } from '@/utils/rendersAPI';
import { useToast } from '@/components/ui/use-toast';

const RenderGeneratorPage = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0); 
  
  const [options, setOptions] = useState({
    style: '',
    roomType: '',
    elements: { muebles: false, decoracion: false, plantas: false, iluminacion: false },
    prompt: ''
  });

  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) return setError("Solo se permiten archivos JPG, PNG o WebP.");
    if (selectedFile.size > 10 * 1024 * 1024) return setError(`El archivo excede el límite de 10MB. Tamaño actual: ${formatFileSize(selectedFile.size)}`);

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 600) {
        setError("La imagen debe tener al menos 800x600 px para mejores resultados.");
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setPreview(objectUrl);
      setFile(selectedFile);
    };
    img.src = objectUrl;
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!file) return;
    if (!options.style || !options.roomType) {
      toast({ variant: "destructive", title: "Faltan opciones", description: "Selecciona estilo y tipo de habitación." });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('image', file);
      const uploadResponse = await rendersAPI.upload(formData);
      
      if (!uploadResponse || !uploadResponse.imageId) {
        throw new Error('Error al subir la imagen. Intenta de nuevo.');
      }

      // 2. Generate Render
      const generateData = {
        imageId: uploadResponse.imageId,
        options: options
      };
      
      await rendersAPI.generate(generateData);
      
      await checkAuth(true); // Refresh user state for updated credits
      toast({ title: "¡Simulación completada!", description: "El render se ha añadido exitosamente a tu galería." });
      removeFile();
      setRefreshGallery(prev => prev + 1);
    } catch (err) {
      console.error("Generation error:", err);
      toast({ 
        variant: "destructive", 
        title: "Error de generación", 
        description: err.message || 'Ocurrió un error inesperado al generar el render.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-[#333] shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/portal')} disabled={isGenerating} className="hover:bg-[#222] text-gray-400 hover:text-white pl-0 pr-4 disabled:opacity-50">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Portal
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[#d4af37] font-bold text-lg">Generador de IA</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] flex justify-between items-center">
              <span className="text-gray-300 font-medium">Tus Créditos Disponibles</span>
              <span className="text-xl font-black text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-lg border border-[#d4af37]/30">
                Créditos: {user?.credits || 0}/{user?.creditsCap || 10}
              </span>
            </div>
            
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${isGenerating ? 'opacity-50 pointer-events-none' : ''} ${isDragging ? 'border-[#d4af37] bg-[#d4af37]/5' : preview ? 'border-[#333] bg-[#1a1a1a]' : 'border-[#444] bg-[#1a1a1a] hover:border-[#666]'}`}
              onDragOver={(e) => { e.preventDefault(); if(!isGenerating) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); if(!isGenerating){ setIsDragging(false); processFile(e.dataTransfer.files?.[0]); } }}
            >
              {!preview ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                    <UploadCloud className="w-8 h-8 text-[#d4af37]" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Sube tu foto base</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] mx-auto mb-4">Arrastra una imagen o haz clic para buscar en tu dispositivo. Máx 10MB.</p>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors">
                    Seleccionar archivo
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => processFile(e.target.files?.[0])} disabled={isGenerating} />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[#333]">
                  <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                  {!isGenerating && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={removeFile} className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-md transition-colors shadow-lg"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                  {file && !isGenerating && (
                     <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-xs px-2 py-1 rounded text-gray-300">
                        {formatFileSize(file.size)}
                     </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 shrink-0" /><p className="font-medium">{error}</p>
              </div>
            )}

            {preview && (
              <div className={isGenerating ? 'opacity-50 pointer-events-none' : ''}>
                <RenderOptionsForm options={options} setOptions={setOptions} />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || (user?.credits ?? 0) < 1} 
                  className={`w-full py-6 font-bold text-lg mt-6 shadow-xl transition-all duration-300 ${isGenerating ? 'bg-[#222] text-[#d4af37] border border-[#d4af37]/30' : 'bg-[#d4af37] text-black hover:bg-[#b5952f] hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)]'}`}
                >
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-6 w-6 animate-spin mb-1" /> 
                      <span className="text-sm font-medium animate-pulse">Generando simulación (10-30s)...</span>
                    </div>
                  ) : (
                    'Generar Simulación (1 Crédito)'
                  )}
                </Button>
                {(user?.credits ?? 0) < 1 && !isGenerating && (
                    <p className="text-red-400 text-sm text-center mt-3 font-medium">No tienes créditos suficientes. Compra un plan para continuar.</p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 h-[800px] lg:h-auto">
            <RenderGallerySection key={refreshGallery} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RenderGeneratorPage;