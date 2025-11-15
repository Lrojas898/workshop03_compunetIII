/**
 * AXIOS INSTANCE CONFIGURATION
 *
 * Configuración base de axios con interceptores para Temple Gym API.
 * Actualizado para usar el store de Zustand como fuente de verdad para la autenticación.
 */

import axios from "axios";
import { useAuthStore } from "@/app/_store/auth/auth.store";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

instance.interceptors.request.use(
    (config) => {

        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                useAuthStore.getState().logout();
                
            }
        }

        return Promise.reject(error);
    }
);

export default instance;