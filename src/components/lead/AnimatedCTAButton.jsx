import React from 'react';

const AnimatedCTAButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden w-full md:w-[350px] py-4 px-8 rounded-full text-white font-bold text-lg transition-transform hover:scale-110 bg-gradient-cta animate-complex-cta shine-effect z-10"
    >
      🚀 Hablar con el Asistente GRATIS
    </button>
  );
};

export default AnimatedCTAButton;