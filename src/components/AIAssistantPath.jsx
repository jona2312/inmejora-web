import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateServiceTotal, formatCurrency } from '@/utils/CalculationEngine';
import { logQuotationUsage } from '@/utils/UsageLogger';

const AIAssistantPath = ({ 
  services, 
  selectedZone, 
  zonaCoeficiente, 
  onShowPaywall, 
  userPlan = 'free' 
}) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [m2Value, setM2Value] = useState('');
  const [quotedServices, setQuotedServices] = useState([]);
  const messagesEndRef = useRef(null);

  const PLAN_LIMITS = {
    'free': 1,
    'basico': 3,
    'pro': Infinity
  };

  const currentLimit = PLAN_LIMITS[userPlan] || 1;
  const canAddMore = quotedServices.length < currentLimit;

  useEffect(() => {
    // Initial greeting message
    addAssistantMessage(
      `¡Hola! Soy el Asistente IA de INMEJORA 👋\n\n¿Qué trabajo necesitás cotizar? Por ejemplo:\n• Pintura de interior\n• Instalación de cielorraso\n• Tabiquería durlock\n• Reforma de baño\n• Reforma integral`
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addAssistantMessage = (text) => {
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
  };

  const detectKeywords = (text) => {
    const keywords = {
      'pintura': ['pintura', 'pintar', 'pintado'],
      'cielorraso': ['cielorraso', 'cielo raso', 'techo'],
      'tabique': ['tabique', 'tabiqueria', 'durlock', 'pared'],
      'baño': ['baño', 'bano', 'sanitario'],
      'reforma': ['reforma', 'remodelacion', 'integral']
    };

    const lowerText = text.toLowerCase();
    
    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => lowerText.includes(term))) {
        return category;
      }
    }
    
    return null;
  };

  const getServicesByKeyword = (keyword) => {
    const categoryMap = {
      'pintura': 'pintura',
      'cielorraso': 'construccion',
      'tabique': 'construccion',
      'baño': 'construccion',
      'reforma': 'construccion'
    };

    const category = categoryMap[keyword];
    return services.filter(s => s.categoria === category).slice(0, 6);
  };

  const handleUserSubmit = () => {
    if (!userInput.trim()) return;

    const input = userInput;
    setUserInput('');
    addUserMessage(input);

    if (currentStep === 1) {
      // Detect keyword and show relevant services
      const keyword = detectKeywords(input);
      
      if (keyword) {
        const relevantServices = getServicesByKeyword(keyword);
        setCurrentStep(2);
        
        setTimeout(() => {
          addAssistantMessage(
            `Encontré estos servicios relacionados con "${keyword}". ¿Cuál necesitás?`
          );
        }, 500);
      } else {
        setCurrentStep(2);
        setTimeout(() => {
          addAssistantMessage(
            'Acá están todos los servicios disponibles. Elegí el que necesitás:'
          );
        }, 500);
      }
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    addUserMessage(service.servicio);
    setCurrentStep(3);
    
    setTimeout(() => {
      addAssistantMessage(
        `Perfecto, elegiste: ${service.servicio}\n\n¿Cuántos metros cuadrados (m²) necesitás cotizar?`
      );
    }, 500);
  };

  const handleM2Submit = () => {
    const m2 = parseFloat(m2Value);
    
    if (isNaN(m2) || m2 < 1) {
      addAssistantMessage('Por favor ingresá un valor válido (mínimo 1 m²)');
      return;
    }

    addUserMessage(`${m2} m²`);
    setCurrentStep(4);

    // Calculate result
    const result = calculateServiceTotal(
      selectedService.precio_mano_obra,
      m2,
      zonaCoeficiente
    );

    setTimeout(() => {
      const breakdown = `📊 **Presupuesto Calculado**\n\n` +
        `🏗️ Servicio: ${selectedService.servicio}\n` +
        `📐 Superficie: ${m2} m²\n` +
        `📍 Zona: ${selectedZone}\n\n` +
        `💰 **Desglose de costos:**\n\n` +
        `• Mano de obra base: ${formatCurrency(result.precio_base)}\n` +
        `• Buffer imprevistos (35%): ${formatCurrency(result.buffer)}\n` +
        `• IVA (21%): ${formatCurrency(result.iva)}\n\n` +
        `✨ **TOTAL ESTIMADO: ${formatCurrency(result.total)}**`;

      addAssistantMessage(breakdown);

      // Log usage
      logQuotationUsage(
        selectedZone === 'Buenos Aires/AMBA' ? 1 : selectedZone === 'Córdoba' ? 2 : 3,
        [selectedService.id],
        result.total
      );

      // Add to quoted services
      setQuotedServices(prev => [...prev, {
        service: selectedService,
        m2,
        result
      }]);
    }, 800);

    setM2Value('');
  };

  const handleAddAnother = () => {
    if (!canAddMore) {
      onShowPaywall();
      return;
    }

    setSelectedService(null);
    setCurrentStep(1);
    addAssistantMessage('¿Qué otro servicio querés cotizar?');
  };

  const handleSaveBudget = () => {
    onShowPaywall();
  };

  const groupedServices = services.reduce((acc, service) => {
    const cat = service.categoria || 'otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  const CATEGORY_ICONS = {
    'construccion': '🏗️',
    'pintura': '🎨',
    'arquitectura': '📐',
    'diseno_interiores': '✨',
    'otros': '🔧'
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 h-[600px] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' 
                  ? 'bg-[#d4af37] text-black font-bold' 
                  : 'bg-[#2a2a2a] text-white'
              }`}>
                {msg.role === 'assistant' ? 'IM' : 'TÚ'}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'assistant'
                  ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-white'
                  : 'bg-[#d4af37] text-black'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Service Selection Buttons (Step 2) */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <p className="text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category]}</span>
                  {category.replace('_', ' ').toUpperCase()}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryServices.slice(0, 6).map(service => (
                    <Button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      variant="outline"
                      className="bg-[#2a2a2a] border-[#333] hover:border-[#d4af37] text-white hover:bg-[#d4af37]/10 text-left justify-start h-auto py-3"
                    >
                      {service.servicio}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Action Buttons (Step 4 - After calculation) */}
        {currentStep === 4 && quotedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={handleSaveBudget}
              className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold"
            >
              Guardar este presupuesto
            </Button>

            <Button
              onClick={handleAddAnother}
              variant="outline"
              className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
              disabled={!canAddMore}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar otro servicio
              {!canAddMore && ` (límite: ${currentLimit})`}
            </Button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Step 1 and 3) */}
      {(currentStep === 1 || currentStep === 3) && (
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="flex gap-2">
            {currentStep === 1 && (
              <>
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserSubmit()}
                  placeholder="Escribí qué trabajo necesitás cotizar..."
                  className="flex-1 bg-[#2a2a2a] border-[#333] text-white placeholder:text-gray-500"
                />
                <Button
                  onClick={handleUserSubmit}
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  value={m2Value}
                  onChange={(e) => setM2Value(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleM2Submit()}
                  placeholder="Ingresá los m²..."
                  className="flex-1 bg-[#2a2a2a] border-[#333] text-white placeholder:text-gray-500"
                />
                <Button
                  onClick={handleM2Submit}
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black"
                >
                  Calcular
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPath;