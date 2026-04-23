import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const RenderWizardStep1 = ({ file, onFileSelect, onFileRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Sube tu foto base</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Paso</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">3</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '33.33%' }} />
        </div>
      </div>

      {!file ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`wizard-card border-2 border-dashed cursor-pointer min-h-[400px] flex flex-col items-center justify-center text-center p-8 ${
            isDragging ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-700 hover:border-[#D4AF37]/50'
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6"
          >
            <Upload className="w-10 h-10 text-[#D4AF37]" />
          </motion.div>
          
          <h4 className="text-xl font-semibold text-white mb-3">
            {isDragging ? 'Suelta la imagen aquí' : 'Arrastra y suelta tu imagen'}
          </h4>
          
          <p className="text-gray-400 mb-6 max-w-md">
            o haz clic para seleccionar desde tu dispositivo
          </p>
          
          <label className="inline-block">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#b5952f] transition-colors"
            >
              Seleccionar imagen
            </motion.div>
          </label>
          
          <p className="text-xs text-gray-500 mt-4">
            Formatos: JPG, PNG, WEBP (máx. 10MB)
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="wizard-card"
        >
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Vista previa"
              className="w-full h-auto rounded-lg border border-gray-700"
            />
            
            <button
              onClick={onFileRemove}
              className="absolute top-3 right-3 w-10 h-10 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-white font-medium">{file.name}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={onFileRemove}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Cambiar imagen
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Para mejores resultados, usa fotos con buena iluminación y que muestren claramente el espacio completo.
        </p>
      </div>
    </motion.div>
  );
};

export default RenderWizardStep1;