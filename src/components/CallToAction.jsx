import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.p
        className='text-lg md:text-xl text-white max-w-lg mx-auto text-center font-light'
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Formá parte de la red de proveedores más innovadora del sector.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button 
          onClick={() => navigate('/proveedores/registro')}
          className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold px-8 py-6 text-lg rounded-full"
        >
          Registrarme Ahora
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default CallToAction;