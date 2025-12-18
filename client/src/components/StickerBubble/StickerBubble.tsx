import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StickerBubble.scss';

interface StickerBubbleProps {
  stickerPath: string | null;
  senderNickname: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export const StickerBubble: React.FC<StickerBubbleProps> = ({ 
  stickerPath, 
  senderNickname,
  onClose,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (stickerPath) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to finish
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [stickerPath, autoCloseDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!stickerPath) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="sticker-bubble"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          <button 
            className="bubble-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="bubble-content">
            <div className="bubble-sender">{senderNickname}</div>
            <img 
              src={stickerPath} 
              alt="Received sticker"
              className="bubble-sticker"
            />
          </div>
          <div className="bubble-tail" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
