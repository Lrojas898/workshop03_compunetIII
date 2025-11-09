/**
 * COACH DASHBOARD HOME PAGE
 *
 * Página principal del dashboard de entrenador.
 * Muestra gestión de clases y asistencias.
 *
 * Características:
 * - Registro de asistencia a clases
 * - Vista de clases del día
 * - Historial de clases registradas
 * - Solo accesible para rol COACH
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { RegisterClassAttendance } from '@/app/components/features/attendances/RegisterClassAttendance'
import { TodayClasses } from '@/app/components/features/attendances/TodayClasses'
import { MyClassesHistory } from '@/app/components/features/attendances/MyClassesHistory'

export default function CoachDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleClassRegistered = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Coach</h1>
        <p className="text-gray-600 mt-1">Gestiona las clases y asistencias</p>
      </div>

      {/* Quick Access Card */}
      <div className="mb-6">
        <Link href="/coach/classes">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gestión de Clases</h3>
                  <p className="text-blue-100 text-sm">Crea, edita y administra las clases del gimnasio</p>
                </div>
              </div>
              <ArrowRight size={24} className="text-white/80" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RegisterClassAttendance onSuccess={handleClassRegistered} />
          <MyClassesHistory key={`history-${refreshKey}`} />
        </div>

        <div>
          <TodayClasses key={`today-${refreshKey}`} />
        </div>
      </div>
    </div>
  )
}
