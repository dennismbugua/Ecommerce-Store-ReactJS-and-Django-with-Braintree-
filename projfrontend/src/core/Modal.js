import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning" // warning, danger, info, success
}) => {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-question-circle';
      case 'info':
        return 'fas fa-info-circle';
      case 'success':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container modal-${type}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">
            <i className={getIcon()}></i>
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`modal-btn modal-btn-${type === 'danger' ? 'danger' : 'primary'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
        
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Modal;