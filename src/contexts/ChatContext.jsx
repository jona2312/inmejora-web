import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const CHAT_CONFIG = {
  MAX_MESSAGES_FREE: 10,
  MAX_TIME_MINUTES_FREE: 5,
  MAX_MESSAGES_REGISTERED: 300,
  MAX_TIME_MINUTES_REGISTERED: 60,
  MAX_RENDERS_FREE: 3
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  
  const [quota, setQuota] = useState({
    messages: CHAT_CONFIG.MAX_MESSAGES_FREE,
    time: CHAT_CONFIG.MAX_TIME_MINUTES_FREE,
    renders: 0
  });

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      
      let currentSessionId = localStorage.getItem('chat_session_id');
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        localStorage.setItem('chat_session_id', currentSessionId);
      }
      setSessionId(currentSessionId);

      const storedUserId = localStorage.getItem('chat_user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      }

      // Mock session initialization without Supabase
      const storedIsRegistered = localStorage.getItem('chat_is_registered') === 'true';
      setIsRegistered(storedIsRegistered);
      
      if (storedIsRegistered) {
         setQuota(prev => ({
             ...prev,
             messages: CHAT_CONFIG.MAX_MESSAGES_REGISTERED, 
             time: CHAT_CONFIG.MAX_TIME_MINUTES_REGISTERED,
             renders: CHAT_CONFIG.MAX_RENDERS_FREE
         }));
      }

      setIsSessionInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat session', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const minimizeChat = () => setIsMinimized(!isMinimized);

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      isMinimized,
      setIsMinimized,
      toggleChat,
      minimizeChat,
      messages,
      setMessages,
      sessionId,
      userId,
      setUserId,
      isRegistered,
      setIsRegistered,
      isLoading,
      setIsLoading,
      showRegistrationModal,
      setShowRegistrationModal,
      quota,
      setQuota,
      initializeSession,
      isSessionInitialized
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;