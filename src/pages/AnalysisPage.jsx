import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const AnalysisPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 flex flex-col items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-6" />
         <h1 className="text-3xl font-bold mb-2">Analizando Espacios</h1>
         <p className="text-gray-400">Esta función estará disponible próximamente.</p>
      </main>
      <Footer />
    </div>
  );
};

export default AnalysisPage;