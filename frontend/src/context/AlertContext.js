// src/context/AlertContext.js
import { createContext, useState, useCallback, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const addAlert = useCallback((message, type = 'info') => { // Default type is 'info'
        const id = Date.now(); // Generate a unique ID for each alert
        setAlerts((prev) => [...prev, { id, message, type }]);

        // Remove the alert after 3 seconds
        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 3000);
    }, []);

    return (
        <AlertContext.Provider value={{ alerts, addAlert }}>
            {children}
        </AlertContext.Provider>
    );
}
