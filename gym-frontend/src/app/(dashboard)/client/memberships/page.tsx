/**
 * MEMBERSHIPS CATALOG PAGE
 *
 * Página donde el cliente puede ver y adquirir membresías.
 *
 * Características:
 * - Catálogo de membresías disponibles
 * - Selección múltiple de membresías
 * - Cálculo automático del precio total
 * - Proceso de compra/suscripción
 * - Solo accesible para rol CLIENT
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, ShoppingCart, AlertCircle, CreditCard } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import membershipsService from '@/app/services/memberships/memberships.service'
import subscriptionsService from '@/app/services/subscriptions/subscriptions.service'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import type { Membership } from '@/app/interfaces/membership.interface'

export default function MembershipsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [selectedMembershipIds, setSelectedMembershipIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadMemberships()
  }, [])

  const loadMemberships = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await membershipsService.getAll()
      // Filtrar solo membresías activas
      const activeMemberships = data.filter(m => m.status)
      setMemberships(activeMemberships)
    } catch (err: any) {
      console.error('Error loading memberships:', err)
      setError(err.response?.data?.message || 'Error al cargar membresías')
    } finally {
      setLoading(false)
    }
  }

  const toggleMembership = (membershipId: string) => {
    setSelectedMembershipIds(prev => {
      if (prev.includes(membershipId)) {
        return prev.filter(id => id !== membershipId)
      } else {
        return [...prev, membershipId]
      }
    })
  }

  const calculateTotal = () => {
    const selected = memberships.filter(m => selectedMembershipIds.includes(m.id))
    return {
      cost: selected.reduce((sum, m) => sum + m.cost, 0),
      gym: selected.reduce((sum, m) => sum + m.max_gym_assistance, 0),
      classes: selected.reduce((sum, m) => sum + m.max_classes_assistance, 0),
      maxDuration: selected.length > 0 ? Math.max(...selected.map(m => m.duration_months)) : 0
    }
  }

  const handlePurchase = async () => {
    if (selectedMembershipIds.length === 0) {
      setError('Selecciona al menos una membresía')
      return
    }

    // Validar que el usuario esté autenticado
    if (!user || !user.id) {
      setError('No se pudo obtener información del usuario. Por favor, inicia sesión nuevamente.')
      return
    }

    setError('')
    setSuccess('')
    setPurchasing(true)

    try {
      // Agregar membresías a la suscripción existente del usuario
      await subscriptionsService.addMembershipsToUserSubscription(user.id, selectedMembershipIds)

      setSuccess('¡Membresías agregadas exitosamente! Redirigiendo...')

      setTimeout(() => {
        window.location.href = '/client/my-subscription';
      }, 2000)
    } catch (err: any) {
      console.error('Error purchasing memberships:', err)
      setError(err.response?.data?.message || 'Error al procesar la compra')
      setPurchasing(false)
    }
  }

  const totals = calculateTotal()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Membresías Disponibles</h1>
        <p className="text-gray-600 mt-1">Selecciona las membresías que deseas adquirir</p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Cargando membresías...</p>
        </div>
      ) : memberships.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg font-medium">No hay membresías disponibles</p>
        </div>
      ) : (
        <>
          {/* Grid de Membresías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {memberships.map((membership) => {
              const isSelected = selectedMembershipIds.includes(membership.id)
              return (
                <div
                  key={membership.id}
                  onClick={() => toggleMembership(membership.id)}
                  className={`relative bg-white rounded-lg border-2 p-6 cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  }`}
                >
                  {/* Checkbox visual */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {isSelected && <Check size={16} className="text-white" />}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{membership.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    ${membership.cost}
                    <span className="text-sm font-normal text-gray-500">
                      /{membership.duration_months} {membership.duration_months === 1 ? 'mes' : 'meses'}
                    </span>
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span>{membership.max_gym_assistance} visitas al gimnasio/mes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span>{membership.max_classes_assistance} clases/mes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span>Duración: {membership.duration_months} {membership.duration_months === 1 ? 'mes' : 'meses'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen de Compra */}
          {selectedMembershipIds.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 sticky bottom-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Compra</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Membresías</p>
                  <p className="text-xl font-bold text-gray-900">{selectedMembershipIds.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-blue-600">${totals.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visitas Gimnasio/mes</p>
                  <p className="text-xl font-bold text-green-600">{totals.gym}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Clases/mes</p>
                  <p className="text-xl font-bold text-purple-600">{totals.classes}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handlePurchase}
                  isLoading={purchasing}
                  className="flex-1"
                >
                  <ShoppingCart size={18} />
                  Comprar Suscripción
                </Button>
                <Button
                  onClick={() => setSelectedMembershipIds([])}
                  variant="secondary"
                  disabled={purchasing}
                >
                  <X size={18} />
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}