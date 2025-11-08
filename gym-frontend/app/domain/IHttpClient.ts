/**
 * HTTP CLIENT INTERFACE (Domain Layer)
 *
 * Interface abstracta que define el contrato para todas las operaciones HTTP.
 * Implementa el principio de Inversión de Dependencias (SOLID).
 *
 * Beneficios:
 * - Desacoplamiento: Permite cambiar la implementación (Axios, Fetch, etc.) sin afectar el código
 * - Testeable: Fácil de mockear en tests unitarios
 * - Tipado fuerte: TypeScript asegura el cumplimiento del contrato
 *
 * @template T - Tipo de datos esperado en la respuesta
 */

export interface HttpConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
  signal?: AbortSignal
}

export interface HttpClientResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface IHttpClient {
  /**
   * Realiza una petición GET
   * @param url - URL del endpoint
   * @param config - Configuración adicional (headers, params, etc.)
   * @returns Promise con la respuesta tipada
   */
  get<T>(url: string, config?: HttpConfig): Promise<HttpClientResponse<T>>

  /**
   * Realiza una petición POST
   * @param url - URL del endpoint
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional
   */
  post<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>>

  /**
   * Realiza una petición PUT
   * @param url - URL del endpoint
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional
   */
  put<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>>

  /**
   * Realiza una petición PATCH
   * @param url - URL del endpoint
   * @param data - Datos parciales a actualizar
   * @param config - Configuración adicional
   */
  patch<T>(url: string, data?: any, config?: HttpConfig): Promise<HttpClientResponse<T>>

  /**
   * Realiza una petición DELETE
   * @param url - URL del endpoint
   * @param config - Configuración adicional
   */
  delete<T>(url: string, config?: HttpConfig): Promise<HttpClientResponse<T>>

  /**
   * Establece un interceptor para requests
   * Útil para agregar tokens de autenticación automáticamente
   */
  setRequestInterceptor?(
    onFulfilled: (config: any) => any,
    onRejected?: (error: any) => any
  ): void

  /**
   * Establece un interceptor para responses
   * Útil para manejo global de errores
   */
  setResponseInterceptor?(
    onFulfilled: (response: any) => any,
    onRejected?: (error: any) => any
  ): void
}
