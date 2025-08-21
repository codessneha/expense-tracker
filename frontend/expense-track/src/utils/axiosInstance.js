import axios from 'axios';
import { BASE_URL } from './apipath';
const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
    },
});

// Request interceptor with logging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        console.log('Full request config:', config);

        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('Authorization header set with token');
        } else {
            console.warn('No access token found in localStorage');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.config.url, response.status);
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                url: error.config.url,
                method: error.config.method,
                headers: error.config.headers,
                data: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Request setup error:', error.message);
        }

        if (error.response.status === 401) {
            window.location.href = "/login";
        } else if (error.response.status === 500) {
            console.log(error.response.data);
        }

        return Promise.reject(error);
    }
)
export default axiosInstance;