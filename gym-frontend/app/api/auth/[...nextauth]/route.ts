/**
 * NEXTAUTH API ROUTE
 *
 * Configuración de NextAuth para autenticación.
 *
 * Características:
 * - Autenticación con credenciales (email/password)
 * - Integración con backend API
 * - Manejo de sesiones
 * - Callbacks personalizados para agregar datos de usuario
 */

// TODO: Implementar configuración de NextAuth
// import NextAuth from 'next-auth'
// import { authOptions } from '@/lib/configuration/auth-config'

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

export async function GET() {
  return Response.json({ message: 'NextAuth not configured yet' })
}

export async function POST() {
  return Response.json({ message: 'NextAuth not configured yet' })
}
