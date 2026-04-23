import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { calculateGrandTotal, formatCurrency } from '@/utils/CalculationEngine';
import { logQuotationUsage } from '@/utils/UsageLogger';

const ManualQuoterPath = ({ 
  services, 
  selectedZone, 
  zonaCoeficiente, 
  onShowPaywall,
  userPlan = 'free' 
}) => {
  const [selectedServices, setSelectedServices] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  const CATEGORY_CONFIG = {
    'construccion': { icon: '🏗️', name: 'Construcción' },
    'pintura': { icon: '🎨', name: 'Pintura' },
    'arquitectura': { icon: '📐', name: 'Arquitectura' },
    'diseno_interiores': { icon: '✨', name: 'Diseño de Interiores' },
    'otros': { icon: '🔧', name: 'Otros Servicios' }
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const cat = service.categoria || 'otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  // Expand first category by default
  useEffect(() => {
    const firstCategory = Object.keys(groupedServices)[0];
    if (firstCategory) {
      setExpandedCategories({ [firstCategory]: true });
    }
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isServiceLocked = (serviceId) => {
    if (userPlan !== 'free') return false;
    
    const selectedCount = Object.keys(selectedServices).length;
    const isCurrentlySelected = !!selectedServices[serviceId];
    
    return selectedCount >= 1 && !isCurrentlySelected;
  };

  const toggleService = (serviceId, serviceData) => {
    if (isServiceLocked(serviceId)) {
      onShowPaywall();
      return;
    }

    setSelectedServices(prev => {
      const newSelected = { ...prev };
      
      if (newSelected[serviceId]) {
        delete newSelected[serviceId];
      } else {
        newSelected[serviceId] = {
          m2: 1,
          data: serviceData
        };
      }
      
      return newSelected;
    });
  };

  const updateM2 = (serviceId, m2) => {
    const numM2 = parseFloat(m2) || 0;
    
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        m2: numM2
      }
    }));
  };

  const calculateSubtotal = (service) => {
    const m2 = parseFloat(service.m2) || 0;
    const precio_mano_obra = parseFloat(service.data.precio_mano_obra) || 0;
    return Math.round(precio_mano_obra * m2 * zonaCoeficiente);
  };

  const budget = (() => {
    const selectedArray = Object.values(selectedServices);
    
    if (selectedArray.length === 0) {
      return { subtotal: 0, buffer: 0, iva: 0, total: 0 };
    }

    const servicesForCalc = selectedArray.map(s => ({
      precio_mano_obra: parseFloat(s.data.precio_mano_obra) || 0,
      m2: parseFloat(s.m2) || 0
    }));

    return calculateGrandTotal(servicesForCalc, zonaCoeficiente);
  })();

  const hasSelectedServices = Object.keys(selectedServices).length > 0;

  const handleViewFullBudget = () => {
    if (!hasSelectedServices) return;

    // Log usage
    const serviceIds = Object.values(selectedServices).map(s => s.data.id);
    logQuotationUsage(
      selectedZone === 'Buenos Aires/AMBA' ? 1 : selectedZone === 'Córdoba' ? 2 : 3,
      serviceIds,
      budget.total
    );

    // Show paywall
    onShowPaywall();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Service Selection (2/3) */}
      <div className="lg:col-span-2 space-y-3">
        {Object.entries(groupedServices).map(([category, categoryServices]) => {
          const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.otros;
          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="border border-[#2a2a2a] rounded-xl overflow-hidden bg-[#1a1a1a]">
              {/* Accordion Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full bg-[#222] hover:bg-[#2a2a2a] px-6 py-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <span className="font-semibold text-white text-left">{config.name}</span>
                  <span className="text-xs text-gray-500 bg-[#333] px-2 py-1 rounded">
                    {categoryServices.length} servicios
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 1 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#1a1a1a]">
                      {categoryServices.map((service, idx) => {
                        const isSelected = !!selectedServices[service.id];
                        const isLocked = isServiceLocked(service.id);
                        const serviceData = selectedServices[service.id];
                        const subtotal = isSelected ? calculateSubtotal(serviceData) : 0;

                        return (
                          <div
                            key={service.id}
                            className={`px-6 py-4 border-b border-[#2a2a2a] last:border-b-0 transition-colors ${
                              !isLocked ? 'hover:bg-[#222]' : 'opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              {/* Checkbox + Name */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleService(service.id, service)}
                                    disabled={isLocked}
                                    className="border-[#d4af37] data-[state=checked]:bg-[#d4af37] data-[state=checked]:text-black"
                                  />
                                  {isLocked && (
                                    <Lock className="w-3 h-3 text-gray-500 absolute -top-1 -right-1" />
                                  )}
                                </div>
                                <label className="text-white font-medium cursor-pointer truncate">
                                  {service.servicio}
                                </label>
                              </div>

                              {/* M² Input (shown when selected) */}
                              {isSelected && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    step="0.1"
                                    value={serviceData.m2}
                                    onChange={(e) => updateM2(service.id, e.target.value)}
                                    className="w-20 bg-[#2a2a2a] border-[#333] text-white text-center h-9"
                                  />
                                  <span className="text-gray-400 text-sm min-w-[30px]">
                                    {service.unidad}
                                  </span>
                                </div>
                              )}

                              {/* Subtotal */}
                              {isSelected && (
                                <div className="text-right min-w-[120px]">
                                  <span className="text-gray-400 text-sm">
                                    {formatCurrency(subtotal)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Plan Restriction Notice */}
        {userPlan === 'free' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              <strong>Plan FREE:</strong> Solo podés cotizar 1 servicio. Activá un plan pago para cotizar múltiples servicios.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Budget Summary (1/3, sticky) */}
      <div className="lg:col-span-1">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="text-[#d4af37] w-5 h-5" />
            Resumen de Presupuesto
          </h2>

          {!hasSelectedServices ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#d4af37]/30" />
              </div>
              <p className="text-gray-500 text-sm">
                Seleccioná servicios para ver el presupuesto
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Services List */}
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {Object.values(selectedServices).map((service) => (
                  <div key={service.data.id} className="bg-[#222] rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {service.data.servicio}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {service.m2} {service.data.unidad}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm whitespace-nowrap">
                        {formatCurrency(calculateSubtotal(service))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Budget Breakdown */}
              <div className="border-t border-[#2a2a2a] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal Base</span>
                  <span className="text-white font-medium">
                    {formatCurrency(budget.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Buffer Imprevistos (35%)</span>
                  <span className="text-white font-medium">
                    {formatCurrency(budget.buffer)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">IVA (21%)</span>
                  <span className="text-white font-medium">
                    {formatCurrency(budget.iva)}
                  </span>
                </div>

                <div className="border-t border-[#2a2a2a] pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-bold text-lg">TOTAL AL CLIENTE</span>
                    <span className="text-[#d4af37] font-black text-xl">
                      {formatCurrency(budget.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Zone Note */}
              <div className="text-xs text-gray-500 text-center">
                Zona: {selectedZone} (coef. {zonaCoeficiente})
              </div>

              {/* View Full Budget Button */}
              <Button
                onClick={handleViewFullBudget}
                className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-6 rounded-xl text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ver Presupuesto Completo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualQuoterPath;