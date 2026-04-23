import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GenerateButton = ({ file, options, onGenerateSuccess, hasCredits }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const isFormValid = file && options.style && options.roomType;

  const handleGenerate = async () => {
    if (!isFormValid || !hasCredits) return;

    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('style', options.style);
      formData.append('roomType', options.roomType);
      formData.append('options', JSON.stringify(options.elements));
      formData.append('customPrompt', options.prompt);

      const token = localStorage.getItem('inmejora_token');
      
      const response = await fetch('https://inmejora-dash-n45svwn6.manus.space/api/horizon/renders/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const status = response.status;
        let errorMessage = "Ocurrió un error al generar el render.";
        
        if (status === 400) errorMessage = "Faltan datos requeridos o son inválidos.";
        if (status === 401) errorMessage = "Sesión no válida. Por favor inicia sesión.";
        if (status === 402) errorMessage = "Créditos insuficientes.";
        if (status === 413) errorMessage = "La imagen es demasiado grande.";
        if (status === 500) errorMessage = "Error en los servidores de IA. Intenta más tarde.";
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      toast({
        title: "¡Render Generado!",
        description: "Tu espacio ha sido transformado exitosamente.",
      });
      
      if(onGenerateSuccess) onGenerateSuccess(data);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de generación",
        description: error.message || "Error al conectar con el servidor.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <Button 
        onClick={handleGenerate}
        disabled={!isFormValid || !hasCredits || isGenerating}
        className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Generando render...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 mr-2" />
            Generar Render
          </>
        )}
      </Button>
      {isGenerating && (
        <p className="text-sm text-gray-400 mt-3 animate-pulse">
          Esto puede tomar 30-60 segundos. Por favor espera...
        </p>
      )}
    </div>
  );
};

export default GenerateButton;