import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

const PhoneInput = ({ value, onChange, placeholder = "549 1155551234", className, error: propError }) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [internalError, setInternalError] = useState('');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const validatePhone = (phone) => {
    // Basic formatting clean up
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if empty (handled by required prop in parent usually, but good to know)
    if (cleaned.length === 0) return true; 

    // Validation logic for Argentine numbers
    // Should be at least 10 digits, usually max 13
    if (cleaned.length < 10 || cleaned.length > 13) return false;
    
    return true;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Normalize for storage
    let normalized = inputValue.replace(/\D/g, '');
    
    // Auto-formatting heuristics
    // If user starts with 11... or 15... (old mobile prefix), assume AR
    // Best effort normalization to 549XXXXXXXXXX format if looks like local number
    if (normalized.length === 10 && (normalized.startsWith('11') || normalized.startsWith('3') || normalized.startsWith('2'))) {
         normalized = `549${normalized}`;
    } else if (normalized.length === 8 && normalized.startsWith('4')) {
        // Maybe landline without area code? risky to assume 11, leave as is or add 5411
        // Let's stick to mobile logic requested
    }
    
    // Check validity
    const isValid = validatePhone(normalized);
    
    if (!isValid && inputValue.length > 0) {
        setInternalError("Teléfono inválido. Usa formato: 549XXXXXXXXXX");
    } else {
        setInternalError('');
    }

    // Propagate changes
    // We send the normalized value if it looks like a phone number, otherwise raw input so parent can decide
    onChange({
        target: {
            name: 'phone',
            value: normalized
        }
    });
  };

  const isError = propError || internalError;

  return (
    <div className="w-full">
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${isError ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {isError && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
           <AlertCircle size={10} /> {propError || internalError}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;