/**
 * AXIOS INSTANCE CONFIGURATION
 *
 * Configuración base de axios con interceptores para Temple Gym API.
 */

import axios from "axios";
import { getSession } from 'next-auth/react';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor - Agregar token de autenticación
instance.interceptors.request.use(
    async (config) => {
        // Intentar obtener token desde NextAuth primero
        const session = await getSession();

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        } else {
            // Fallback a localStorage para compatibilidad
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
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
