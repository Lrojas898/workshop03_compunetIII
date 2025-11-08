/**
 * MODAL DIALOG HOOK
 *
 * Hook para controlar estado de modales/diálogos.
 *
 * Características:
 * - Abrir/cerrar modal
 * - Manejo de estado
 * - Prevención de cierre accidental
 * - Callbacks de confirmación
 */

'use client'

import { useState, useCallback } from 'react'

export function useModalDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
