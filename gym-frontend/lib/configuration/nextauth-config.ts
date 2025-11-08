/**
 * NEXTAUTH CONFIGURATION
 *
 * Configuración de NextAuth para autenticación.
 *
 * Características:
 * - Provider de credenciales (email/password)
 * - Callbacks para JWT y sesión
 * - Páginas personalizadas
 * - Integración con backend API
 */

// TODO: Implementar configuración de NextAuth
// import { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { apiClient } from '../api-client/axios-instance'
// import { API_ENDPOINTS } from '../api-client/endpoint-urls'

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         // Implementar lógica de autenticación
//         return null
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.role = user.role
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id
//         session.user.role = token.role
//       }
//       return session
//     },
//   },
// }

export const authOptions = {}
