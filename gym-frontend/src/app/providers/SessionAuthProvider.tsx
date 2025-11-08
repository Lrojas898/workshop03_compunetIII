/**
 * SESSION AUTH PROVIDER
 *
 * Provider de NextAuth para manejo de sesiones.
 * Envuelve la app y proporciona el SessionProvider.
 */

'use client'

// TODO: Implementar provider de NextAuth
// import { SessionProvider } from 'next-auth/react'

// export function SessionAuthProvider({
//   children,
//   session,
// }: {
//   children: React.ReactNode
//   session?: any
// }) {
//   return <SessionProvider session={session}>{children}</SessionProvider>
// }

export function SessionAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
