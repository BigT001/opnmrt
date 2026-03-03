import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
    baseURL: API_URL,
});

// Add interceptor to add token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
