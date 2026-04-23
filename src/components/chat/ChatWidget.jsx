import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare as MessageSquareText } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const { 
    isOpen, 
    toggleChat, 
    messages, 
    initializeSession,
    isSessionInitialized 
  } = useChat();

  useEffect(() => {
    // Initialize session as soon as widget mounts (page load)
    initializeSession();
  }, []); // Empty dependency array ensures it runs once on mount

  const unreadCount = messages.filter(m => m.role === 'assistant').length > 0 ? 1 : 0;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="relative group">
               {/* Pulse Animation */}
              <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20 group-hover:opacity-40" />
              
              <button
                onClick={toggleChat}
                className="relative bg-[#10B981] hover:bg-[#059669] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <MessageSquareText size={28} />
                
                {/* Notification Badge */}
                {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                      !
                   </span>
                )}
              </button>
              
              {/* Tooltip on hover */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¿Necesitás ayuda con tu proyecto?
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only render ChatWindow if session is initialized or to show loading state inside it */}
      {isSessionInitialized && <ChatWindow />}
    </>
  );
};

export default ChatWidget;