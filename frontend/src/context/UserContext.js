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
        if (user?.username) {
            localStorage.setItem('username', user.username);
        } else {
            localStorage.removeItem('username');
        }
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
