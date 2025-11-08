/**
 * API SERVICE
 *
 * Wrapper genérico de métodos HTTP usando axios instance.
 * Todos los servicios específicos deben usar este servicio base.
 */

import axiosInstance from '../../lib/api';

const apiService = {
    get: async<T>(url: string, config?: any) => {
        const response = await axiosInstance.get<T>(url, config);
        return response.data;
    },

    post: async<T>(url: string, data?: any, config?: any) => {
        const response = await axiosInstance.post<T>(url, data, config);
        return response;
    },

    put: async<T>(url: string, data?: any, config?: any) => {
        const response = await axiosInstance.put<T>(url, data, config);
        return response;
    },

    patch: async<T>(url: string, data?: any, config?: any) => {
        const response = await axiosInstance.patch<T>(url, data, config);
        return response;
    },

    delete: async<T>(url: string, config?: any) => {
        const response = await axiosInstance.delete<T>(url, config);
        return response;
    },
};

export default apiService;
