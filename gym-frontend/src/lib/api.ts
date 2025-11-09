/**
 * AXIOS INSTANCE CONFIGURATION
 *
 * Configuración base de axios con interceptores para Temple Gym API.
 */

import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor - Agregar token de autenticación
instance.interceptors.request.use(
    (config) => {
        // Obtener token desde localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Manejo global de errores
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // Redirigir a login si token expirado o no autorizado
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
