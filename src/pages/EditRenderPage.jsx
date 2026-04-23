import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Sparkles, Layers, PaintBucket, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { rendersAPI } from '@/utils/rendersAPI';
import { useAuth } from '@/contexts/InmejoraAuthContext';

const EditRenderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuth } = useAuth();
  
  const [originalImg, setOriginalImg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [edits, setEdits] = useState({
    wallColor: '#ffffff',
    furnitureColor: '#555555',
    wallTexture: 'Liso',
    floorTexture: 'Madera',
    furnitureTexture: 'Tela',
    elements: { muebles: true, decoracion: true, plantas: false, lamparas: true },
    customPrompt: ''
  });

  const textures = {
    wall: ['Liso', 'Texturado', 'Ladrillo', 'Piedra', 'Madera'],
    floor: ['Cerámica', 'Madera', 'Vinilo', 'Hormigón', 'Mármol'],
    furniture: ['Tela', 'Cuero', 'Madera', 'Metal', 'Plástico']
  };
  const palettes = ['#d4af37', '#2c3e50', '#8b4513', '#27ae60', '#8e44ad', '#c0392b'];

  useEffect(() => {
    const fetchRender = async () => {
      try {
        const data = await rendersAPI.detail(id);
        setOriginalImg(data.render?.imageUrl || data.imageUrl);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el render original." });
        navigate('/portal/renders');
      } finally {
        setLoading(false);
      }
    };
    fetchRender();
  }, [id, navigate, toast]);

  const handleChange = (key, value) => setEdits(prev => ({ ...prev, [key]: value }));

  const handleGenerateVersion = async () => {
    setIsGenerating(true);
    try {
      await rendersAPI.edit(id, edits);
      await checkAuth(true); // Update credits
      toast({ title: "¡Nueva versión generada!", description: "Se ha guardado en tu galería." });
      navigate('/portal/renders');
    } catch (error) {
      const msg = error.response?.status === 402 ? 'Créditos insuficientes.' : (error.response?.data?.message || 'Error al generar.');
      toast({ variant: "destructive", title: "Error al editar", description: msg });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]"><Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-[#333] shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/portal/renders')} className="hover:bg-[#222] text-gray-400 hover:text-white pl-0">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver a Galería
          </Button>
          <div className="text-sm px-3 py-1 bg-[#333] rounded-full border border-[#444]">
            Editando Render #{id.substring(0,6)}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden p-4">
              <h3 className="text-gray-400 text-sm font-medium mb-3">Imagen Original</h3>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <img src={originalImg} alt="Original" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#d4af37]/30 overflow-hidden p-4 relative">
              <div className="absolute top-6 right-6 z-10">
                <span className="bg-[#d4af37] text-black text-xs font-bold px-2 py-1 rounded">Vista Previa</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-3">Resultado Esperado (Aproximación)</h3>
              <div className="aspect-video bg-[#222] rounded-xl overflow-hidden flex items-center justify-center border border-[#333]">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#d4af37] mb-4" />
                    <p className="text-[#d4af37] font-medium animate-pulse">Generando nueva versión (10-30s)...</p>
                  </div>
                ) : (
                  <img src={originalImg} alt="Preview" className="w-full h-full object-cover filter brightness-110 contrast-110 saturate-110" />
                )}
              </div>
            </div>
          </div>

          {/* Right: Tools */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="text-[#d4af37]" /> Herramientas de Edición
              </h2>
              <p className="text-gray-400 text-sm">Modifica colores, texturas y elementos de tu render actual.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-[#333] pb-2 flex items-center gap-2"><PaintBucket className="w-4 h-4" /> Colores</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {palettes.map(c => <button key={c} onClick={() => handleChange('wallColor', c)} className="w-8 h-8 rounded-full border-2 border-[#333] hover:border-white transition-colors" style={{ backgroundColor: c }} />)}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-[#333] pb-2 flex items-center gap-2"><Layers className="w-4 h-4" /> Texturas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries({ Paredes: 'wallTexture', Piso: 'floorTexture', Muebles: 'furnitureTexture' }).map(([label, key]) => (
                  <div key={key}>
                    <Label className="text-gray-300 text-xs mb-1 block">{label}</Label>
                    <select value={edits[key]} onChange={e => handleChange(key, e.target.value)} className="w-full bg-[#222] border border-[#333] text-sm text-white rounded-lg px-2 py-2 focus:ring-[#d4af37]">
                      {textures[key.replace('Texture', '')].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-[#333] pb-2 flex items-center gap-2"><Box className="w-4 h-4" /> Elementos</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(edits.elements).map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} checked={edits.elements[item]} onCheckedChange={c => handleChange('elements', {...edits.elements, [item]: c})} className="border-[#d4af37] data-[state=checked]:bg-[#d4af37]" />
                    <label htmlFor={item} className="text-sm text-gray-300 capitalize cursor-pointer">{item}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-[#333] pb-2">Instrucciones Adicionales</h3>
              <Textarea 
                placeholder="Ej: Cambiar la lámpara de techo por una de estilo industrial..."
                className="bg-[#222] border-[#333] text-white resize-none h-20"
                value={edits.customPrompt} onChange={e => handleChange('customPrompt', e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-[#333]">
              <Button onClick={handleGenerateVersion} disabled={isGenerating} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg rounded-xl">
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                {isGenerating ? "Generando..." : "Generar Nueva Versión (1 Crédito)"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditRenderPage;