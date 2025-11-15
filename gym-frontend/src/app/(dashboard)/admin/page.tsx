/**
 * ADMIN DASHBOARD HOME PAGE
 *
 * Página principal del dashboard de administrador.
 * Muestra accesos rápidos y actividad reciente del gimnasio.
 *
 * Características:
 * - Accesos rápidos a funciones principales
 * - Actividad reciente
 * - Solo accesible para rol ADMIN
 */

'use client'

import Link from 'next/link'
import { Users, CreditCard, FileText, ClipboardList, Calendar } from 'lucide-react'

export default function AdminDashboardPage() {
  const quickAccessLinks = [
    {
      title: 'Gestionar Usuarios',
      description: 'Ver, crear y editar usuarios del gimnasio',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Membresías',
      description: 'Administrar tipos de membresías y precios',
      href: '/admin/memberships',
      icon: CreditCard,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Suscripciones',
      description: 'Revisar y controlar suscripciones activas',
      href: '/admin/subscriptions',
      icon: FileText,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Asistencias',
      description: 'Ver historial de asistencias del gimnasio',
      href: '/admin/attendances',
      icon: ClipboardList,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Gestión de Clases',
      description: 'Crear y administrar clases del gimnasio',
      href: '/admin/classes',
      icon: Calendar,
      color: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-600 mt-2">Bienvenido, Administrador. Aquí está el resumen de tu gimnasio.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickAccessLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${link.color} w-12 h-12 flex items-center justify-center rounded-lg`}>
                    <IconComponent className={link.iconColor} size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Información Útil</h3>
        <p className="text-blue-800 text-sm">
          Este es tu panel administrativo. Desde aquí puedes gestionar todos los aspectos de tu gimnasio incluyendo usuarios,
          membresías, suscripciones, asistencias, clases y acceso a reportes detallados.
        </p>
      </section>
    </div>
  )
}
