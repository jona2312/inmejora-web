import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
    </div>
  );
};

export default Spinner;