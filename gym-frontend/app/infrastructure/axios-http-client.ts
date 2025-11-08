/**
 * AXIOS HTTP CLIENT (Infrastructure Layer)
 *
 * Implementación concreta de IHttpClient usando Axios.
 * Esta implementación puede ser reemplazada por otra (Fetch, Ky, etc.)
 * sin afectar el resto de la aplicación.
 *
 * Características:
 * - Configuración de baseURL desde variables de entorno
 * - Timeout configurable
 * - Interceptores para requests y responses
 * - Manejo automático de errores
 * - Transformación de respuestas Axios a formato estándar
 */

import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'
import { IHttpClient, HttpConfig, HttpClientResponse } from '../domain/IHttpClient'

export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance

  /**
   * Constructor del cliente HTTP
   * @param baseURL - URL base del backend API (default: desde env o localhost:9000)
   */
  constructor(baseURL?: string) {
    const apiBaseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    this.axiosInstance = axios.create({
      baseURL: apiBaseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Configurar interceptores por defecto
    this.setupDefaultInterceptors()
  }

  /**
   * Configura interceptores por defecto
   */
  private setupDefaultInterceptors(): void {
    // Request interceptor: agregar token de autenticación desde NextAuth
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Obtener sesión de NextAuth
        const session = await getSession()

        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor: manejo global de errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              // Token expirado - redirigir a login
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
              break
            case 403:
              console.error('Forbidden:', data.message)
              break
            case 404:
              console.error('Not found:', data.message)
              break
            case 500:
              console.error('Server error:', data.message)
              break
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Transforma la respuesta de Axios al formato estándar
   */
  private mapResponse<T>(axiosResponse: AxiosResponse<T>): HttpClientResponse<T> {
    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers as Record<string, string>,
    }
  }

  /**
   * Convierte HttpConfig a AxiosRequestConfig
   */
  private toAxiosConfig(config?: HttpConfig): AxiosRequestConfig {
    if (!config) return {}

    return {
      headers: config.headers,
      params: config.params,
      timeout: config.timeout,
      signal: config.signal,
    }
  }

  // ==================== IMPLEMENTACIÓN DE MÉTODOS HTTP ====================

  async get<T>(url: string, config?: HttpConfig): Promise<HttpClientResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, this.toAxiosConfig(config))
      return this.mapResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, this.toAxiosConfig(config))
      return this.mapResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, this.toAxiosConfig(config))
      return this.mapResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async patch<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, this.toAxiosConfig(config))
      return this.mapResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T>(url: string, config?: HttpConfig): Promise<HttpClientResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, this.toAxiosConfig(config))
      return this.mapResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ==================== INTERCEPTORES ====================

  setRequestInterceptor(
    onFulfilled: (config: any) => any,
    onRejected?: (error: any) => any
  ): void {
    this.axiosInstance.interceptors.request.use(onFulfilled, onRejected)
  }

  setResponseInterceptor(
    onFulfilled: (response: any) => any,
    onRejected?: (error: any) => any
  ): void {
    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected)
  }

  // ==================== MANEJO DE ERRORES ====================

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      const statusCode = error.response?.status

      return new Error(`HTTP Error ${statusCode}: ${message}`)
    }

    return error instanceof Error ? error : new Error('Unknown error occurred')
  }

  /**
   * Obtiene la instancia de Axios (útil para configuraciones avanzadas)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// ==================== INSTANCIA SINGLETON (OPCIONAL) ====================

/**
 * Instancia singleton del HttpClient
 * Usar esta instancia para evitar crear múltiples clientes
 */
let httpClientInstance: AxiosHttpClient | null = null

export function getHttpClient(): AxiosHttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new AxiosHttpClient()
  }
  return httpClientInstance
}
