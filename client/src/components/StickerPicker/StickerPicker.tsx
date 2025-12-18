import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STICKER_CATEGORIES } from '../../utils/stickers';
import { audioManager } from '../../utils/audio';
import './StickerPicker.scss';

interface StickerPickerProps {
  onStickerSelect: (stickerPath: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleStickerClick = (stickerPath: string) => {
    audioManager.play('send', 0.4);
    onStickerSelect(stickerPath);
    onClose(); // Close immediately
  };

  const handleTabChange = (index: number) => {
    audioManager.play('click', 0.2);
    setActiveTab(index);
  };

  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabsRef.current) {
      e.preventDefault();
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="sticker-picker-overlay" onClick={onClose} />
      <motion.div
        className="sticker-picker"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="sticker-picker-header">
          <h3>Send a Sticker</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div 
          className="sticker-tabs" 
          ref={tabsRef}
          onWheel={handleTabsWheel}
        >
          {STICKER_CATEGORIES.map((category, index) => (
            <button
              key={category.name}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="sticker-grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="sticker-grid-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {STICKER_CATEGORIES[activeTab].stickers.map((sticker, index) => (
                <motion.button
                  key={sticker}
                  className="sticker-button"
                  onClick={() => handleStickerClick(sticker)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={sticker} 
                    alt={`Sticker ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
