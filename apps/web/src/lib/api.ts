import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
    baseURL: API_URL,
});

// Add interceptor for request logging
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        console.log(`%c[API_REQUEST] 🚀 ${config.method?.toUpperCase()} ${config.url}`, 'color: #3b82f6; font-weight: bold;');
    }

    // Strip leading slash from URL if it's a relative path to prevent it 
    // from overriding the /api/ prefix in the baseURL
    if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1);
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        if (typeof window !== 'undefined') {
            console.log(`[API_DEBUG] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error) => {
        if (typeof window !== 'undefined') {
            console.error(`[API_DEBUG] ❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'NETWORK_ERROR'}`, error.response?.data);
        }
        return Promise.reject(error);
    }
);

export default api;
