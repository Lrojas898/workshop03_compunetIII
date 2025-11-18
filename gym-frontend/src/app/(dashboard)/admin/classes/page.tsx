/**
 * ADMIN CLASSES MANAGEMENT PAGE
 *
 * Página para gestión de clases del gimnasio.
 *
 * Características:
 * - CRUD completo de clases
 * - Activar/desactivar clases
 * - Eliminar clases (solo admin)
 * - Accesible solo para ADMIN
 */

'use client'

import { ClassManagement } from '@/app/components/features/classes/ClassManagement'

export default function AdminClassesPage() {
  return (
    <div className="p-6">
      <ClassManagement userRole="admin" />
    </div>
  )
}
