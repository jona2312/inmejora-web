import { useState, useEffect, useRef } from 'react';
import { useChat, CHAT_CONFIG } from '@/contexts/ChatContext';

const INTENT_RESPONSES = {
  greeting: [
    "¡Hola! 👋 Soy el asistente de INMEJORA. ¿En qué proyecto de reforma o diseño estás pensando hoy?",
    "¡Hola! Qué bueno verte por acá. ¿En qué te puedo ayudar con tu espacio?",
    "¡Buenas! Soy tu asistente virtual de INMEJORA. ¿Tenés alguna idea en mente que quieras hacer realidad?"
  ],
  design: [
    "¡Excelente! Para los renders, podés subir una foto de tu espacio actual o describirme el estilo que buscás (Ej: Moderno, Industrial, Nórdico).",
    "Me encanta la idea. Podemos crear renders personalizados para que veas cómo quedaría. ¿Tenés fotos del espacio actual?",
    "¡Perfecto! El diseño visual es clave. Contame un poco más sobre los colores o materiales que te gustaría incorporar."
  ],
  pricing: [
    "Para prepararte una cotización detallada, necesito que me cuentes un poco más: ¿Qué tipo de ambiente querés reformar y cuántos m² tiene aproximadamente?",
    "Los costos varían según los materiales y el alcance. ¿Podrías darme una idea del tamaño del espacio y qué cambios querés hacer?",
    "Te haremos un presupuesto a medida. Para empezar, decime qué ambiente es y si hay que hacer cambios de cañerías o electricidad."
  ],
  process: [
    "El proceso es simple: primero entendemos tu idea, luego hacemos un render 3D, y finalmente te pasamos la cotización detallada. ¿En qué etapa estás?",
    "Nuestro método de trabajo empieza con conocer tus necesidades. Después pasamos al diseño visual y terminamos con un presupuesto claro.",
    "Todo comienza con tu idea. Nosotros la modelamos en 3D para que la apruebes, y luego armamos el presupuesto exacto."
  ],
  timeline: [
    "Generalmente los renders están listos en 24-48 horas hábiles una vez que tenemos toda la información. ¿Tenés apuro con este proyecto?",
    "El tiempo de diseño suele ser rápido, un par de días para los primeros renders. El tiempo de obra dependerá de la cotización final.",
    "Para la etapa de diseño y presupuesto solemos tardar entre 2 y 3 días. Contame, ¿cuándo te gustaría empezar con los trabajos?"
  ],
  contact: [
    "Después de registrarte, te conectamos directamente por WhatsApp con uno de nuestros especialistas para avanzar.",
    "Para darte una atención más personalizada, te sugiero registrarte así seguimos charlando por WhatsApp con nuestro equipo técnico.",
    "La mejor forma de avanzar es que te registres para que un asesor se comunique con vos directamente."
  ],
  general: [
    "Entiendo. Contame más detalles sobre esa idea para poder asesorarte mejor con los materiales y tiempos de obra.",
    "Interesante. ¿Hay algún otro detalle que creas importante mencionar para tenerlo en cuenta?",
    "Comprendo perfectamente. Cuanta más información me des, mejor podré ayudarte a visualizar el resultado."
  ]
};

const KEYWORDS = {
  greeting: ['hola', 'buen', 'día', 'dia', 'tarde', 'noche', 'buenas'],
  design: ['diseño', 'visualizar', 'render', 'imagen', 'foto', 'estilo', 'colores', '3d'],
  pricing: ['precio', 'costo', 'cotización', 'cotizacion', 'presupuesto', 'pagar', 'cuánto', 'cuanto', 'valor'],
  process: ['cómo', 'como', 'proceso', 'pasos', 'funciona', 'hacen'],
  timeline: ['cuándo', 'cuando', 'tiempo', 'tarda', 'demora', 'plazo', 'días', 'dias'],
  contact: ['dónde', 'donde', 'contacto', 'hablar', 'whatsapp', 'teléfono', 'telefono', 'asesor']
};

export const useChatLogic = () => {
  const {
    messages,
    setMessages,
    sessionId,
    userId,
    setUserId,
    isRegistered,
    setIsRegistered,
    setIsLoading,
    showRegistrationModal,
    setShowRegistrationModal,
    quota,
    setQuota,
    isOpen,
    isSessionInitialized,
    initializeSession
  } = useChat();

  const [conversationLoaded, setConversationLoaded] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const lastIntentRef = useRef(null);

  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [intent, words] of Object.entries(KEYWORDS)) {
      if (words.some(word => lowerText.includes(word))) {
        return intent;
      }
    }
    return 'general';
  };

  const getRandomResponse = (intent) => {
    const options = INTENT_RESPONSES[intent];
    return options[Math.floor(Math.random() * options.length)];
  };

  const mockChatApi = async (endpoint, payload) => {
    const delay = Math.floor(Math.random() * 500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    if (endpoint === '/api/chat/send') {
      const { session_id, message, is_first_message, user_id } = payload;
      
      let intent = detectIntent(message);
      if (intent === lastIntentRef.current && intent === 'general') {
        intent = 'contact'; 
      }
      lastIntentRef.current = intent;

      const replyContent = getRandomResponse(intent);
      const currentMessages = messages.length + 2;
      const isFreeLimitReached = !isRegistered && currentMessages >= CHAT_CONFIG.MAX_MESSAGES_FREE;
      
      return {
        success: true,
        reply: replyContent,
        requires_registration: isFreeLimitReached,
        quota: {
          messages_remaining: isRegistered ? Math.max(0, CHAT_CONFIG.MAX_MESSAGES_REGISTERED - currentMessages) : Math.max(0, CHAT_CONFIG.MAX_MESSAGES_FREE - currentMessages),
          time_remaining_minutes: isRegistered ? CHAT_CONFIG.MAX_TIME_MINUTES_REGISTERED : CHAT_CONFIG.MAX_TIME_MINUTES_FREE,
          renders_remaining: isRegistered ? CHAT_CONFIG.MAX_RENDERS_FREE : 0
        }
      };
    }

    if (endpoint === '/api/chat/register') {
      const { name, email, phone, session_id } = payload;
      
      const whatsappText = encodeURIComponent(`Hola, soy ${name}. Acabo de registrarme en el chat de INMEJORA y quiero continuar mi consulta.`);
      const whatsappLink = `https://wa.me/5491112345678?text=${whatsappText}`;

      return {
        success: true,
        user_id: crypto.randomUUID(),
        whatsapp_link: whatsappLink,
        quota: {
          messages_remaining: CHAT_CONFIG.MAX_MESSAGES_REGISTERED,
          time_remaining_minutes: CHAT_CONFIG.MAX_TIME_MINUTES_REGISTERED,
          renders_remaining: CHAT_CONFIG.MAX_RENDERS_FREE
        }
      };
    }

    throw new Error('Endpoint not found');
  };

  useEffect(() => {
    if (isSessionInitialized && sessionId && !conversationLoaded) {
      setConversationLoaded(true);
    }
  }, [isSessionInitialized, sessionId, conversationLoaded]);

  useEffect(() => {
    if (isOpen && !isRegistered) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
        const maxTime = CHAT_CONFIG.MAX_TIME_MINUTES_FREE;
        
        const remainingTime = Math.max(0, maxTime - Math.floor(elapsedMinutes));
        setQuota(prev => ({ ...prev, time: remainingTime }));

        if (elapsedMinutes >= maxTime && !showRegistrationModal) {
          setShowRegistrationModal(true);
          clearInterval(timerRef.current);
        }
      }, 1000);
    }
    
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isRegistered, showRegistrationModal, setShowRegistrationModal, setQuota]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    if (!isSessionInitialized || !sessionId) {
        await initializeSession();
        if (!localStorage.getItem('chat_session_id')) {
            console.error("Failed to initialize session before sending");
            return;
        }
    }

    if (!isRegistered) {
      const userMsgCount = messages.filter(m => m.role === 'user').length;
      if (userMsgCount >= CHAT_CONFIG.MAX_MESSAGES_FREE) {
        setShowRegistrationModal(true);
        return;
      }
    }

    const newMessage = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
      session_id: sessionId
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await mockChatApi('/api/chat/send', {
        session_id: sessionId,
        user_id: userId,
        message: text,
        is_first_message: messages.length === 0
      });

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.reply,
          created_at: new Date().toISOString(),
          session_id: sessionId
        };
        setMessages(prev => [...prev, aiMessage]);

        if (response.quota) {
          setQuota({
            messages: response.quota.messages_remaining,
            time: response.quota.time_remaining_minutes,
            renders: response.quota.renders_remaining
          });
        }

        if (response.requires_registration) {
          setShowRegistrationModal(true);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: "Error de conexión. Por favor intentá nuevamente.",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (formData) => {
    try {
      setIsLoading(true);
      
      const response = await mockChatApi('/api/chat/register', {
        session_id: sessionId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (response.success) {
        setIsRegistered(true);
        localStorage.setItem('chat_is_registered', 'true');
        setShowRegistrationModal(false);
        
        if (response.user_id) {
          setUserId(response.user_id);
          localStorage.setItem('chat_user_id', response.user_id);
        }

        if (response.quota) {
          setQuota({
            messages: response.quota.messages_remaining,
            time: response.quota.time_remaining_minutes,
            renders: response.quota.renders_remaining
          });
        }
        
        return { success: true, whatsapp_link: response.whatsapp_link };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    registerUser,
    conversationLoaded
  };
};