import React from 'react';
import { motion } from 'framer-motion';
import './Countdown.scss';

interface CountdownProps {
  count: number;
}

export const Countdown: React.FC<CountdownProps> = ({ count }) => {
  return (
    <div className="countdown-container">
      <motion.div
        className="countdown-number"
        key={count}
        initial={{ scale: 0, opacity: 0 }}
        animate={count === 1 ? { 
          scale: 1, 
          opacity: [1, 0.3, 1, 0.3, 1],
        } : { 
          scale: 1, 
          opacity: 1 
        }}
        exit={{ scale: 2, opacity: 0 }}
        transition={{ 
          duration: count === 1 ? 0.6 : 0.5,
          type: count === 1 ? 'tween' : 'spring',
          stiffness: 200,
          damping: 10,
          times: count === 1 ? [0, 0.2, 0.4, 0.6, 0.8] : undefined
        }}
      >
        {count}
      </motion.div>
    </div>
  );
};
