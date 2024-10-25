import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../context/AlertContext";
import { useUser } from "../context/UserContext";

export default function Logout() {
    const { setUser } = useUser();
    const { addAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const refresh = localStorage.getItem('refresh_token');
            try {
                const response = await fetch('http://localhost:8000/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh }),
                });

                if (!response.ok) {
                    throw new Error('Logout Failed');
                }

                // Clear tokens and user data from local storage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setUser({}); // Reset user state in context

                addAlert('Logout successful!', 'success');
                navigate('/login'); // Navigate to login page after logout
            } catch (e) {
                addAlert(e.message, 'error');
                navigate('/login'); // Navigate to login page on error as well
            }
        };

        handleLogout(); // Call the logout function on component mount
    }, [setUser, navigate, addAlert]); // Add dependencies for useEffect

    return (
        <div>
            Logging out...
        </div>
    );
}
