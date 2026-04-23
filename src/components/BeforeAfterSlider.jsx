import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, category }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl cursor-ew-resize select-none shadow-2xl group bg-[#1a1a1a]"
      onMouseMove={onMouseMove}
      onMouseDown={handleMouseDown}
      onTouchMove={onTouchMove}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) - Always visible */}
      <img
        src={afterImage}
        alt={`${category} Después`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        draggable="false"
        style={{ objectFit: 'cover' }}
      />

      {/* Label After */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none border border-white/10">
        DESPUÉS
      </div>

      {/* Before Image (Clipped) - Always visible */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={`${category} Antes`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          draggable="false"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Label Before */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none shadow-lg">
          ANTES
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#D4AF37] rounded-full shadow-lg flex items-center justify-center border-2 border-white hover:scale-110 transition-transform">
          <ChevronLeft className="w-4 h-4 text-black absolute left-0.5" />
          <ChevronRight className="w-4 h-4 text-black absolute right-0.5" />
        </div>
      </div>

      {/* Category Badge - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-[#D4AF37] text-sm font-bold px-4 py-2 rounded-xl z-20 pointer-events-none border border-[#D4AF37]/30">
        {category}
      </div>
    </div>
  );
};

export default BeforeAfterSlider;