/**
 * REGISTER PAGE
 *
 * Página de registro para nuevos usuarios del gimnasio.
 * Permite crear cuentas de clientes.
 *
 * Características:
 * - Formulario de registro con validación
 * - Verificación de email único
 * - Creación automática de perfil de cliente
 */

import { RegisterForm } from '@/app/components/features/authentication/RegisterForm'

export const metadata = {
  title: 'Registrarse | Gym Manager',
  description: 'Crea una nueva cuenta en Gym Manager',
}

export default function RegisterPage() {
  return <RegisterForm />
}
