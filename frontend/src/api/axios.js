import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Matches your backend port 5001
    withCredentials: true, // Important for cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
