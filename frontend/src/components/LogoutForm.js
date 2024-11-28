import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../context/AlertContext";
import { useUser } from "../context/UserContext";
import axios from 'axios';

export default function LogoutForm() {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // Destructure setUser from useUser
    const refresh = localStorage.getItem('refresh_token');
    const { addAlert } = useAlert();

    useEffect(() => {
        axios
            .request({
                method: 'post',
                url: 'http://localhost:8000/auth/logout/',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { refresh },
            })
            .then(() => {
                // Clear localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('username');

                // Update user context
                setUser({}); // Reset user state to an empty object

                // Navigate and show an alert
                navigate('/');
                addAlert(`Goodbye, ${user?.username || 'User'}!`, 'success');
            })
            .catch((e) => {
                console.log(e.response);
                addAlert('Something went wrong. Please try again later.', 'error');
                navigate('/'); // Optional: Redirect on failure
            });
    }, [navigate, refresh, setUser, addAlert, user]);
}
