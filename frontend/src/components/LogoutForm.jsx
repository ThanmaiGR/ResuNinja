import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../context/AlertContext";
import { useUser } from "../context/UserContext";
import axios from 'axios';

export default function LogoutForm() {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // Destructure setUser from useUser
    const { addAlert } = useAlert();

    useEffect(() => {
        const logout = async () => {
            try {
                // Send logout request, withCredentials ensures cookies are sent
                const response = await axios.post('http://localhost:8000/auth/logout/', null, {
                    withCredentials: true, // Correct property to send cookies
                });
                console.log("Logged out successfully", response);

                // Clear user state and show success message
                setUser({});
                addAlert(`Goodbye, ${user?.username || 'User'}!`, 'success');
            } catch (error) {
                console.error("Logout failed", error.message);
                addAlert('Something went wrong. Please try again later.', 'error');
            } finally {
                // Redirect to the home page after logout
                navigate('/');
            }
        };

        logout(); // Call the logout function inside useEffect
    }, [navigate, setUser, user, addAlert]); // Dependencies

    return null; // This component does not need to render anything
}
