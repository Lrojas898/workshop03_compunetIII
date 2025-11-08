/**
 * TOAST NOTIFICATIONS HOOK
 *
 * Hook para mostrar notificaciones toast.
 *
 * Características:
 * - Success, error, warning, info
 * - Duración configurable
 * - Posición personalizable
 * - Auto-dismiss
 */

'use client'

// TODO: Implementar hook de toast (puede usar sonner o react-hot-toast)
// import { toast } from 'sonner'

// export function useToast() {
//   return {
//     success: (message: string) => toast.success(message),
//     error: (message: string) => toast.error(message),
//     warning: (message: string) => toast.warning(message),
//     info: (message: string) => toast.info(message),
//   }
// }

export function useToast() {
  return {
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.error('Error:', message),
    warning: (message: string) => console.warn('Warning:', message),
    info: (message: string) => console.info('Info:', message),
  }
}
