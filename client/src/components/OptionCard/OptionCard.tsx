import React from 'react';
import { motion } from 'framer-motion';
import { GameOption } from '../../../../shared/options';
import { audioManager } from '../../utils/audio';
import './OptionCard.scss';

interface OptionCardProps {
  option: GameOption;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (option: GameOption) => void;
  playerColor?: 'blue' | 'pink';
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  isDisabled,
  onSelect,
  playerColor = 'blue',
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      audioManager.play('click', 0.5);
      onSelect(option);
    }
  };

  const imagePath = `/assets/images/options/${option.toLowerCase()}.png`;

  return (
    <motion.div
      className={`option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${playerColor}`}
      onClick={handleClick}
      whileHover={!isDisabled ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="option-image-wrapper">
        <img 
          src={imagePath} 
          alt={option}
          className="option-image"
          onError={(e) => {
            // Fallback if image not found
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="option-name">{option}</div>
      {isSelected && (
        <motion.div
          className="selected-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};
