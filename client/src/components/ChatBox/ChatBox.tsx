import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBox.scss';

export interface ChatMessage {
  id: string;
  senderSocketId: string;
  senderNickname: string;
  stickerPath: string;
  timestamp: number;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  currentPlayerSocketId: string | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentPlayerSocketId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box">
      <AnimatePresence>
        {messages.map((message) => {
          const isOwnMessage = message.senderSocketId === currentPlayerSocketId;
          
          return (
            <motion.div
              key={message.id}
              className={`chat-message ${isOwnMessage ? 'own' : 'opponent'}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-sender">{message.senderNickname}</div>
              <div className="message-sticker">
                <img 
                  src={message.stickerPath} 
                  alt="Sticker"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};
