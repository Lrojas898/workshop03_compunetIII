/**
 * HOOK PARA SINCRONIZAR ROLES DEL USUARIO
 *
 * Este hook verifica periódicamente si los roles del usuario han cambiado
 * y actualiza automáticamente el estado sin necesidad de cerrar sesión.
 *
 * Características:
 * - Polling cada 30 segundos
 * - Detecta cambios en roles
 * - Actualiza el store de Zustand automáticamente
 * - Redirige al dashboard correcto si cambió el rol principal
 * - Se ejecuta solo si el usuario está autenticado
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import authenticationService from '@/app/services/auth/authentication.service'

const SYNC_INTERVAL = 30000 // 30 segundos

export function useRoleSync() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Solo ejecutar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      return
    }

    const checkRoleChanges = async () => {
      try {
        // Obtener datos actuales del usuario desde el backend
        const currentUserData = await authenticationService.getCurrentUser()

        // Comparar roles actuales con los almacenados
        const storedRoles = user.roles.map((r) => r.name).sort().join(',')
        const currentRoles = currentUserData.roles.map((r) => r.name).sort().join(',')

        // Si los roles cambiaron
        if (storedRoles !== currentRoles) {
          console.log('🔄 Roles changed! Updating user data...')
          console.log('Old roles:', storedRoles)
          console.log('New roles:', currentRoles)

          // Actualizar el store con los nuevos datos
          updateUser(currentUserData)

          // Determinar el rol principal (el primero)
          const oldPrimaryRole = user.roles[0]?.name
          const newPrimaryRole = currentUserData.roles[0]?.name

          // Si el rol principal cambió, redirigir al dashboard correspondiente
          if (oldPrimaryRole !== newPrimaryRole) {
            console.log(`🔀 Primary role changed from ${oldPrimaryRole} to ${newPrimaryRole}`)

            // Determinar la ruta del dashboard según el nuevo rol principal
            let newDashboardPath = '/'
            switch (newPrimaryRole) {
              case 'admin':
                newDashboardPath = '/admin'
                break
              case 'receptionist':
                newDashboardPath = '/receptionist'
                break
              case 'coach':
                newDashboardPath = '/coach'
                break
              case 'client':
                newDashboardPath = '/client'
                break
              default:
                newDashboardPath = '/403'
            }

            // Si no estamos ya en el nuevo dashboard, redirigir
            if (!pathname.startsWith(newDashboardPath)) {
              console.log(`📍 Redirecting to ${newDashboardPath}`)
              router.push(newDashboardPath)
            }
          } else {
            // Aunque el rol principal no cambió, los roles sí cambiaron
            // Recargar la página para actualizar la UI
            console.log('🔄 Roles updated, reloading page...')
            window.location.reload()
          }
        }
      } catch (error) {
        console.error('Error checking role changes:', error)
        // Si hay un error de autenticación (401), podría ser que el token expiró
        // En ese caso, no hacemos nada - el API service debería manejar eso
      }
    }

    // Ejecutar la verificación inmediatamente
    checkRoleChanges()

    // Configurar polling cada 30 segundos
    intervalRef.current = setInterval(checkRoleChanges, SYNC_INTERVAL)

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAuthenticated, user, updateUser, router, pathname])
}
