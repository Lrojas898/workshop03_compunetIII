/**
 * CLASSNAME UTILITY (cn)
 *
 * Utilidad para combinar clases de Tailwind CSS.
 * Usa clsx y tailwind-merge para evitar conflictos.
 *
 * Uso:
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
 */

// TODO: Implementar utilidad cn con clsx y tailwind-merge
// import { clsx, type ClassValue } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function cn(...inputs: any[]) {
  return inputs.join(' ')
}
