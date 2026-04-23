import React, { createContext, useContext, useState } from 'react';

const ContactModalContext = createContext();

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
};

export const ContactModalProvider = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  const toggleContactModal = () => setIsContactModalOpen(prev => !prev);

  return (
    <ContactModalContext.Provider value={{ isContactModalOpen, openContactModal, closeContactModal, toggleContactModal }}>
      {children}
    </ContactModalContext.Provider>
  );
};