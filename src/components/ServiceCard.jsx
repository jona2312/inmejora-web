import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, onClick, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(service)}
      className="group bg-[#141414] border border-white/5 rounded-2xl p-6 md:p-8 cursor-pointer hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col items-center text-center h-full min-h-[220px] justify-center relative overflow-hidden"
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] transition-all duration-300 relative z-10">
        <Icon 
          className="w-8 h-8 text-[#D4AF37] group-hover:text-black transition-colors duration-300" 
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 relative z-10">
        {service.name}
      </h3>

      {/* "Ver más" text implied by hover or explicitly added if needed, 
          keeping it clean as per modern card design */}
      <div className="w-8 h-1 bg-[#D4AF37]/30 rounded-full mt-4 group-hover:w-16 group-hover:bg-[#D4AF37] transition-all duration-300" />
    </motion.div>
  );
};

export default ServiceCard;