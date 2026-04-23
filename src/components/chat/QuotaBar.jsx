import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageSquare, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

const QuotaBar = () => {
  const { quota, isRegistered } = useChat();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isRegistered) return null;

  const getStatusColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage > 50) return "text-green-500";
    if (percentage > 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tu Plan Gratuito</span>
        {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 px-4 pb-3">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Clock size={16} className={cn("mb-1", getStatusColor(quota.time, 60))} />
                <span className="text-xs font-bold text-gray-700">{quota.time}m</span>
                <span className="text-[10px] text-gray-400">Tiempo</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <MessageSquare size={16} className={cn("mb-1", getStatusColor(quota.messages, 300))} />
                <span className="text-xs font-bold text-gray-700">{quota.messages}</span>
                <span className="text-[10px] text-gray-400">Msjes</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Palette size={16} className={cn("mb-1", getStatusColor(quota.renders, 3))} />
                <span className="text-xs font-bold text-gray-700">{quota.renders}</span>
                <span className="text-[10px] text-gray-400">Renders</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuotaBar;