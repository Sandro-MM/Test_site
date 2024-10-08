// ErrorContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const ErrorContext = createContext();

// Create a provider component
export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const handleError = (error) => {
        setError(error);
        // You can add more error handling logic here if needed
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ error, handleError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};
