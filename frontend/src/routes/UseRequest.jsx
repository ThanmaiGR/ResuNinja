import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useRequest = () => {
    const navigate = useNavigate();

    const sendRequest = async (method, url, data = {}, headers = null) => {
        // console.log("method", method)
        // console.log("url", url)
        console.log("data", data)

        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        if (!(access_token && refresh_token)) {
            navigate('/login');
            return null;
        }

        try {
            const response = await axios.request({
                method: method,
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    // 'Content-Type': 'application/json',
                    ...headers,
                },
                data: data,
            });
            console.log(response)
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const refreshResponse = await axios.post('http://localhost:8000/auth/refresh/', {
                        refresh: refresh_token,
                    });
                    localStorage.setItem('access_token', refreshResponse.data.access);
                    // Retry the original request
                    return sendRequest(method, url, data, headers);
                } catch (refreshError) {
                    navigate('/login');
                }
            } else {
                return Promise.reject(error);
            }
        }
    };

    return sendRequest;
};

export default useRequest;
