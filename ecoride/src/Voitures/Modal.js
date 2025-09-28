import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        {children}
        <button 
          onClick={onClose} 
          className="mt-4 text-red-600 hover:text-red-800"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default Modal;