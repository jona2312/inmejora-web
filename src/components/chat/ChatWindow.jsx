import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, MinusCircle, Image as ImageIcon, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { useChatLogic } from '@/hooks/useChatLogic';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import QuotaBar from './QuotaBar';
import RegistrationModal from './RegistrationModal';

const ChatWindow = () => {
  const { 
    isOpen, 
    toggleChat, 
    messages, 
    isLoading,
    isRegistered 
  } = useChat();
  const { sendMessage } = useChatLogic();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[380px] h-[100dvh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#1a1a1a] p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-[#D4AF37]/20">
            IM
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Asistente INMEJORA</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">En línea ahora</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <MinusCircle size={20} />
          </button>
          <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors md:hidden">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Quota Bar (Registered only) */}
      <QuotaBar />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
        <div className="space-y-4 pb-4">
          {/* Welcome Message */}
          <div className="flex justify-start mb-6">
             <div className="max-w-[85%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <p className="text-gray-800 text-sm mb-3">
                   ¡Hola! 👋 Soy el asistente virtual de INMEJORA.
                </p>
                <p className="text-gray-600 text-sm mb-4">
                   Estoy acá para ayudarte a visualizar tus reformas, darte ideas de diseño o preparar un presupuesto preliminar.
                </p>
                <p className="text-gray-800 text-sm font-medium">
                   ¿Qué te gustaría hacer hoy?
                </p>
             </div>
          </div>

          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
               <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Registration Modal Overlay */}
        <RegistrationModal />
      </div>

      {/* Quick Actions */}
      {messages.length < 2 && (
        <div className="px-4 pb-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button 
            onClick={() => handleQuickAction("Quiero ver cómo quedaría mi living")}
            className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#D4AF37] px-3 py-2 rounded-full text-xs font-medium text-gray-700 transition-colors shadow-sm"
          >
            <ImageIcon size={14} className="text-[#D4AF37]" />
            Quiero un render
          </button>
          <button 
             onClick={() => handleQuickAction("Necesito un presupuesto aproximado")}
             className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#D4AF37] px-3 py-2 rounded-full text-xs font-medium text-gray-700 transition-colors shadow-sm"
          >
            <FileText size={14} className="text-blue-500" />
            Presupuesto
          </button>
           <button 
             onClick={() => handleQuickAction("Tengo una consulta sobre reformas")}
             className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#D4AF37] px-3 py-2 rounded-full text-xs font-medium text-gray-700 transition-colors shadow-sm"
          >
            <MessageCircle size={14} className="text-green-500" />
            Consulta
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribí tu mensaje..."
            className="flex-1 bg-gray-50 border-gray-200 focus:ring-[#D4AF37] focus:border-[#D4AF37] rounded-full px-4 text-gray-900"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputText.trim()}
            className="rounded-full w-10 h-10 p-0 bg-[#D4AF37] hover:bg-[#b8952b] text-black shadow-md flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </form>
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">
                {!isRegistered ? "Modo invitado • 10 mensajes disponibles" : "Sesión verificada • InAI Connect"}
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;