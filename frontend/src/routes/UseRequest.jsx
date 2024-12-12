import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useRequest = () => {
    const navigate = useNavigate();

    const sendRequest = async (method, url, data = {}, headers = {}) => {
        try {
            // Send the original request
            const response = await axios.request({
                method: method,
                url: url,
                withCredentials: true, // Ensures cookies are included
                headers: headers,
                data: data,
            });
            return response.data;
        } catch (error) {
            console.log(error.response.status)
            if (error.response && error.response.status === 401) {
                try {
                    // Attempt to refresh the token
                    await axios.post(
                        'http://localhost:8000/auth/refresh/',
                        {},
                        { withCredentials: true } // Send cookies for refresh
                    );

                    // Retry the original request
                    return sendRequest(method, url, data, headers);
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    navigate('/login');
                }
            } else {
                // Handle other errors
                navigate('/login');
                return Promise.reject(error);
            }
        }
    };

    return sendRequest;
};

export default useRequest;
