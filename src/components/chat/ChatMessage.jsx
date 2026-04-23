import React, { useState } from 'react';
import { User, Bot, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ChatMessage = ({ message, isLast }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!message) return null;

  const isUser = message.role === 'user' || message.direction === 'in';
  const timestamp = message.created_at ? format(new Date(message.created_at), 'HH:mm') : '';
  
  // Detect image
  const imageUrl = message.media_url || message.image_url || message.mediaUrl;
  const isImagePlaceholder = message.content?.startsWith('[Imagen]') || message.type === 'image';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${isLast ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#222] text-gray-400 border border-[#333]'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-[#d4af37] text-black rounded-br-sm' 
            : 'bg-[#222] text-gray-200 border border-[#333] rounded-bl-sm'
        }`}>
          
          {imageUrl ? (
            <div className="mb-2">
              {!imgError ? (
                <img 
                  src={imageUrl} 
                  alt="Adjunto" 
                  className="max-w-xs w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                  onClick={() => window.open(imageUrl, '_blank')}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-black/20 rounded-lg text-sm text-red-400">
                  <AlertCircle size={16} />
                  <span>Error al cargar imagen</span>
                </div>
              )}
            </div>
          ) : isImagePlaceholder ? (
            <div className="flex items-center gap-2 p-3 bg-black/20 rounded-lg text-sm mb-2 text-gray-300">
              <ImageIcon size={18} className={isUser ? "text-black/60" : "text-[#d4af37]"} />
              <span className="italic">Imagen adjunta</span>
            </div>
          ) : null}

          {/* Text Content */}
          {message.content && !message.content.startsWith('[Imagen]') && (
            <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </div>
          )}

          {/* Timestamp */}
          {timestamp && (
            <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-black/60' : 'text-gray-500'}`}>
              {timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;