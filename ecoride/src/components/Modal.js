import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 text-red-500">
          Fermer
        </button>
      </div>
    </div>
  );
};

export default Modal;