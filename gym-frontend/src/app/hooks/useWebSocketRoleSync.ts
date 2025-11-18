/**
 * HOOK PARA SINCRONIZAR ROLES VÍA WEBSOCKET
 *
 * Este hook se conecta al servidor WebSocket y escucha
 * notificaciones en tiempo real sobre cambios de roles.
 *
 * Características:
 * - Conexión automática cuando el usuario inicia sesión
 * - Escucha eventos de cambio de roles en tiempo real
 * - Actualiza el store automáticamente
 * - Reconexión automática si se pierde la conexión
 * - Se desconecta automáticamente al cerrar sesión
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'
import { API_CONFIG } from '@/lib/configuration/api-endpoints'

export function useWebSocketRoleSync() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, token, updateUser, logout } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Solo conectar si el usuario está autenticado
    if (!isAuthenticated || !user || !token) {
      return
    }

    // Crear conexión WebSocket
    const socket = io(API_CONFIG.BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'], // Intentar websocket primero
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    // Registrar el usuario para recibir notificaciones
    socket.on('connect', () => {
      console.log('✅ WebSocket connected')
      socket.emit('register', user.id)
    })

    // Escuchar cambios de roles
    socket.on('roleChanged', ({ roles, message }) => {
      console.log('🔔 Role change notification received:', message)
      console.log('New roles:', roles)

      // Comparar roles actuales con los nuevos
      const oldRoles = user.roles.map((r) => r.name).sort().join(',')
      const newRoles = roles.map((r: any) => r.name).sort().join(',')

      if (oldRoles !== newRoles) {
        console.log('🔄 Updating user roles in store')

        // Actualizar el store con los nuevos roles
        updateUser({ roles })

        // Determinar el rol principal
        const oldPrimaryRole = user.roles[0]?.name
        const newPrimaryRole = roles[0]?.name

        // Si cambió el rol principal, redirigir
        if (oldPrimaryRole !== newPrimaryRole) {
          console.log(`🔀 Primary role changed from ${oldPrimaryRole} to ${newPrimaryRole}`)

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

          if (!pathname.startsWith(newDashboardPath)) {
            console.log(`📍 Redirecting to ${newDashboardPath}`)
            router.push(newDashboardPath)
          }
        } else {
          // Solo recargamos si no cambió el rol principal
          console.log('🔄 Reloading page to update UI')
          window.location.reload()
        }
      }
    })

    // Escuchar cambios de estado de usuario (activación/desactivación)
    socket.on('userStatusChanged', ({ isActive, message }) => {
      console.log('🔔 User status change notification received:', message)
      console.log('New active status:', isActive)

      if (!isActive) {
        // Usuario fue desactivado - cerrar sesión
        toast.error('Tu cuenta ha sido desactivada por un administrador. Serás redirigido al login.')

        // Esperar 3 segundos antes de cerrar sesión para que el usuario vea el mensaje
        setTimeout(() => {
          logout()
          router.push('/auth/login')
        }, 3000)
      } else {
        // Usuario fue reactivado
        toast.success('Tu cuenta ha sido reactivada. Ya puedes usar el sistema normalmente.')
      }
    })

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Cleanup al desmontar o cuando cambie la autenticación
    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting WebSocket')
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, user, token, updateUser, logout, router, pathname])
}
