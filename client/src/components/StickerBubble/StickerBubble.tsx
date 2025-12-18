import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StickerBubble.scss';

interface StickerBubbleProps {
  stickerPath: string | null;
  senderNickname: string;
  onClose: () => void;
}

export const StickerBubble: React.FC<StickerBubbleProps> = ({ 
  stickerPath, 
  senderNickname,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (stickerPath) {
      setIsVisible(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [stickerPath, onClose]);

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
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ 
            type: 'spring',
            stiffness: 500,
            damping: 25
          }}
        >
          <button 
            className="sticker-bubble-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="sticker-bubble-sender">{senderNickname}</div>
          <div className="sticker-bubble-content">
            <img 
              src={stickerPath} 
              alt="Sticker from opponent"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
