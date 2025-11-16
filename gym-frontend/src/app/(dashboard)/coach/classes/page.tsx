/**
 * COACH CLASSES MANAGEMENT PAGE
 *
 * Página para gestión de clases del gimnasio.
 *
 * Características:
 * - CRUD completo de clases
 * - Activar/desactivar clases
 * - Solo Admin puede eliminar
 * - Accesible para COACH y ADMIN
 */

'use client'

import { ClassManagement } from '@/app/components/features/classes/ClassManagement'

export default function CoachClassesPage() {
  return (
    <div className="p-6">
      <ClassManagement userRole="coach" />
    </div>
  )
}
