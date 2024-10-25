import React, { createContext, useState, useContext, useEffect } from 'react';

// Create UserContext
const UserContext = createContext();

// Custom hook to use UserContext easily
export const useUser = () => useContext(UserContext);

// UserProvider to wrap the app and provide user state
export function UserProvider({ children }) {
    const [user, setUser] = useState({});

    // Sync user state with localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser({ username: storedUser });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
