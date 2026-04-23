import React, { createContext, useContext, useState } from 'react';

const ContactFormContext = createContext();

export const useContactForm = () => {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error('useContactForm must be used within a ContactFormProvider');
  }
  return context;
};

export const ContactFormProvider = ({ children }) => {
  const [formDefaults, setFormDefaults] = useState({
    origin: 'contacto',
    service_type: 'general',
    message: ''
  });

  const scrollToContact = (newDefaults = {}) => {
    setFormDefaults((prev) => ({ ...prev, ...newDefaults }));
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ContactFormContext.Provider value={{ formDefaults, scrollToContact }}>
      {children}
    </ContactFormContext.Provider>
  );
};