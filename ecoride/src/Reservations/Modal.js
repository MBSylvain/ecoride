import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-lg p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        {title && (
          <h2 className="mb-4 text-lg font-bold text-primary-100">{title}</h2>
        )}
        {children}
        <button
          onClick={onClose}
          className="px-4 py-2 mt-6 font-bold text-white rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default Modal;