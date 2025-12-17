import { useState } from 'react';
import './HelpButton.scss';

export const HelpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="help-button" onClick={openModal} aria-label="Help">
        ?
      </button>

      {isModalOpen && (
        <div className="help-modal-backdrop">
          <div className="help-modal-content">
            <button className="help-modal-close" onClick={closeModal} aria-label="Close">
              ✕
            </button>
            <img src="/assets/images/options/rule.jpeg" alt="Game Rules" className="help-modal-image" />
          </div>
        </div>
      )}
    </>
  );
};
