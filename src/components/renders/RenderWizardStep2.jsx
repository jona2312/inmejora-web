import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const STYLE_CHIPS = [
  { id: 'moderno', label: 'Estilo moderno', text: 'Quiero un estilo moderno y minimalista' },
  { id: 'clasico', label: 'Estilo clásico', text: 'Prefiero un estilo clásico y elegante' },
  { id: 'minimalista', label: 'Minimalista', text: 'Busco un diseño minimalista y limpio' },
  { id: 'industrial', label: 'Industrial', text: 'Me gusta el estilo industrial' },
  { id: 'escandinavo', label: 'Escandinavo', text: 'Quiero un ambiente escandinavo' },
  { id: 'amplio', label: 'Amplio y luminoso', text: 'Necesito que sea amplio y luminoso' }
];

const RenderWizardStep2 = ({ description, onDescriptionChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check for Speech Recognition API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-AR';
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        onDescriptionChange(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onDescriptionChange]);

  const startRecording = async () => {
    if (!speechSupported) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleChipClick = (chip) => {
    const newText = description ? `${description} ${chip.text}.` : `${chip.text}.`;
    onDescriptionChange(newText);
    
    setSelectedChips(prev => {
      if (prev.includes(chip.id)) {
        return prev.filter(id => id !== chip.id);
      }
      return [...prev, chip.id];
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Describe los cambios que quieres</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Paso</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">3</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: '66.66%' }} />
        </div>
      </div>

      <div className="wizard-card space-y-6">
        {/* Quick style chips */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Estilos rápidos (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLE_CHIPS.map((chip) => (
              <motion.button
                key={chip.id}
                onClick={() => handleChipClick(chip)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedChips.includes(chip.id)
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {chip.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Describe tu visión en detalle
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Ej: Quiero una cocina moderna con muebles blancos, encimera de cuarzo negro, y electrodomésticos de acero inoxidable. Iluminación cálida y un estilo minimalista..."
            rows={6}
            className="w-full bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#D4AF37] resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {description.length} caracteres
            </span>
          </div>
        </div>

        {/* Voice recording */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">
              O graba tu descripción
            </label>
            {isRecording && (
              <span className="timer-text recording-pulse text-sm flex items-center gap-2">
                🔴 {formatTime(recordingTime)}
              </span>
            )}
          </div>
          
          {speechSupported ? (
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Detener grabación
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Grabar descripción
                </>
              )}
            </motion.button>
          ) : (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-300">
                ⚠️ Grabación disponible solo en Chrome. El texto transcrito se agregará automáticamente al cuadro de arriba.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-300">
          <strong>Tip:</strong> Cuanto más específico seas, mejor será el resultado. Menciona colores, materiales, estilo y cualquier elemento importante.
        </p>
      </div>
    </motion.div>
  );
};

export default RenderWizardStep2;