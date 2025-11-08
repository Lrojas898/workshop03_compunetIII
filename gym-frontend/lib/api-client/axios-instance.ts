/**
 * AXIOS CLIENT INSTANCE
 *
 * Instancia configurada de Axios para hacer peticiones HTTP al backend.
 *
 * Características:
 * - Base URL del backend API
 * - Interceptores para agregar token de autenticación
 * - Manejo global de errores
 * - Timeout configurado
 * - Transformación de respuestas
 */

// TODO: Implementar instancia de Axios configurada
// import axios from 'axios'

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor para agregar token
// apiClient.interceptors.request.use(
//   (config) => {
//     // Agregar token de autenticación
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor para manejo de errores
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Manejo global de errores
//     return Promise.reject(error)
//   }
// )

// export { apiClient }

export const apiClient = {}
