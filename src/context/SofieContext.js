import React, { createContext, useCallback, useState, useContext } from 'react';

export const SofieContext = createContext();

export const SofieProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [errors, setErrors] = useState([]);

  const updateState = useCallback((key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  const clearState = useCallback((key) => {
    setState((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  }, []);

  const addError = useCallback((error) => {
    const errorObj = {
      id: Date.now(),
      message: error.message || error,
      timestamp: new Date(),
    };
    setErrors((prev) => [...prev, errorObj]);
    return errorObj.id;
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors((prev) => prev.filter((e) => e.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value = {
    state,
    updateState,
    clearState,
    errors,
    addError,
    removeError,
    clearErrors,
  };

  return <SofieContext.Provider value={value}>{children}</SofieContext.Provider>;
};

/**
 * useSofie hook - must be used within SofieProvider
 * Provides access to global Sofie state and error handling
 */
export function useSofie() {
  const context = useContext(SofieContext);
  if (!context) {
    throw new Error('useSofie must be used within SofieProvider');
  }
  return context;
}

export default SofieProvider;
