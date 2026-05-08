import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const N8N_WEBHOOK = 'https://n8n.inbigfinanzas.com/webhook/color-match';

// ΔE quality label
const getQuality = (de) => {
  const val = parseFloat(de);
  if (val < 5)  return { label: 'Excelente', color: '#22c55e' };
  if (val < 15) return { label: 'Muy bueno', color: '#eab308' };
  if (val < 30) return { label: 'Bueno',     color: '#f97316' };
  return           { label: 'Aproximado',    color: '#ef4444' };
};

// Luminance-based text color for hex swatches
const textColorFor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? '#1a1a1a' : '#ffffff';
};

const ColorCard = ({ match, rank }) => {
  const medals = ['🥇', '🥈', '🥉'];
  const quality = getQuality(match.delta_e);
  const tc = textColorFor(match.hex || '#888888');

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Swatch */}
      <div
        className="h-28 flex items-center justify-center text-3xl font-bold"
        style={{ backgroundColor: match.hex || '#888888', color: tc }}
      >
        {match.hex || '?'}
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-lg">{medals[rank]}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: quality.color + '22', color: quality.color, border: `1px solid ${quality.color}44` }}
          >
            {quality.label}
          </span>
        </div>
        <p className="text-white font-semibold text-sm mt-1 leading-tight">{match.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{match.family}</p>
        <p className="text-gray-400 text-xs mt-2">
          ΔE: <span className="font-mono" style={{ color: quality.color }}>{match.delta_e}</span>
        </p>
      </div>
    </div>
  );
};

const AnalysisPage = () => {
  const [image, setImage]       = useState(null);   // { file, preview, base64 }
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);   // API response
  const [error, setError]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Convert file → base64 data URL
  const fileToBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload  = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede superar 10 MB.');
      return;
    }
    setError(null);
    setResult(null);
    const base64 = await fileToBase64(file);
    setImage({ file, preview: base64, base64 });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: image.base64 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text.substring(0, 200)}`);
      }

      const data = await res.json();
      if (!data.matches || !data.matches.length) {
        throw new Error('El servicio no devolvió resultados. Intentá con otra imagen.');
      }
      setResult(data);
    } catch (e) {
      setError(e.message || 'Error desconocido. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-2xl">
        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Análisis de Color</h1>
          <p className="text-gray-400 text-sm">
            Subí una foto de tu pared y encontramos el color Alba más cercano.
          </p>
        </div>

        {/* Upload zone */}
        {!result && (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#2a2a2a] hover:border-[#D4AF37]/50'
            }`}
            onClick={() => !image && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {image ? (
              /* Preview */
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={image.preview}
                    alt="preview"
                    className="max-h-64 rounded-xl object-contain mx-auto"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute -top-2 -right-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full p-1 hover:bg-red-900/40 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs">{image.file.name}</p>
              </div>
            ) : (
              /* Empty state */
              <div className="space-y-3 pointer-events-none">
                <Upload className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <p className="text-white font-medium">Arrastrá o hacé click para subir</p>
                <p className="text-gray-500 text-xs">JPG, PNG, WEBP · máx. 10 MB</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 bg-red-900/20 border border-red-800/40 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Analizar button */}
        {image && !result && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 w-full py-3 px-6 bg-[#D4AF37] hover:bg-[#c49f27] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analizando…
              </>
            ) : (
              'Analizar color'
            )}
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Detected color */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-lg flex-shrink-0"
                style={{ backgroundColor: result.detected_hex || '#888' }}
              />
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Color detectado</p>
                <p className="text-white font-semibold">{result.detected_hex}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Confianza: {Math.round((result.confidence || 0) * 100)}%
                  {result.overexposed && (
                    <span className="ml-2 text-yellow-400">⚠️ imagen sobreexpuesta</span>
                  )}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" />
            </div>

            {/* Top 3 matches */}
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Mejores coincidencias Alba CP5
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {result.matches.slice(0, 3).map((m, i) => (
                  <ColorCard key={i} match={m} rank={i} />
                ))}
              </div>
            </div>

            {/* Nueva consulta */}
            <button
              onClick={reset}
              className="w-full py-2.5 px-6 border border-[#2a2a2a] hover:border-[#D4AF37]/50 text-gray-400 hover:text-white rounded-xl transition-colors text-sm"
            >
              Analizar otra imagen
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AnalysisPage;
