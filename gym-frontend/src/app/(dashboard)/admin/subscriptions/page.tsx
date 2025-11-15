/**
 * SUBSCRIPTIONS MANAGEMENT PAGE
 *
 * Página de gestión de suscripciones activas.
 * Permite ver y administrar las suscripciones de los usuarios.
 *
 * Características:
 * - Listado de todas las suscripciones
 * - Búsqueda de suscripción por ID
 * - Ver detalles de suscripción
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, Calendar, User as UserIcon } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Table } from '@/app/components/ui/Table'
import subscriptionsService from '@/app/services/subscriptions/subscriptions.service'
import type { Subscription } from '@/app/interfaces/subscriptions.interface'

export default function SubscriptionsManagementPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')

  useEffect(() => {
    loadSubscriptions()
  }, [])

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredSubscriptions(subscriptions)
    } else {
      const filtered = subscriptions.filter(sub =>
        sub.id.toLowerCase().includes(searchId.toLowerCase()) ||
        sub.user?.email.toLowerCase().includes(searchId.toLowerCase()) ||
        sub.user?.fullName.toLowerCase().includes(searchId.toLowerCase())
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchId, subscriptions])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await subscriptionsService.getAll()
      setSubscriptions(data)
      setFilteredSubscriptions(data)
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewSubscription = (id: string) => {
    router.push(`/admin/subscriptions/${id}`)
  }

  const getActiveItem = (subscription: Subscription) => {
    return subscription.items?.find(item => item.status === 'active') || null
  }

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (subscription: Subscription) => (
        <div className="flex items-center gap-2">
          <UserIcon size={16} className="text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{subscription.user?.fullName || 'N/A'}</p>
            <p className="text-sm text-gray-500">{subscription.user?.email || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'name',
      header: 'Subscription Name',
      render: (subscription: Subscription) => {
        const activeItem = getActiveItem(subscription)
        return activeItem?.name || 'N/A'
      }
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (subscription: Subscription) => {
        const activeItem = getActiveItem(subscription)
        return activeItem ? `$${Number(activeItem.cost).toFixed(2)}` : '$0.00'
      }
    },
    {
      key: 'duration_months',
      header: 'Duration',
      render: (subscription: Subscription) => {
        const activeItem = getActiveItem(subscription)
        return activeItem?.duration_months ?
          (activeItem.duration_months === 1 ? '1 Month' : `${activeItem.duration_months} Months`) :
          'N/A'
      }
    },
    {
      key: 'memberships',
      header: 'Memberships',
      render: (subscription: Subscription) => {
        const itemsCount = subscription.items?.length || 0
        return (
          <span className="text-gray-900">
            {itemsCount} {itemsCount === 1 ? 'membership' : 'memberships'}
          </span>
        )
      }
    },
    {
      key: 'purchase_date',
      header: 'Purchase Date',
      render: (subscription: Subscription) => {
        const activeItem = getActiveItem(subscription)
        return (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-gray-400" />
            <span>{activeItem?.purchase_date ? new Date(activeItem.purchase_date).toLocaleDateString() : 'N/A'}</span>
          </div>
        )
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (subscription: Subscription) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {subscription.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (subscription: Subscription) => (
        <button
          onClick={() => handleViewSubscription(subscription.id)}
          className="text-blue-600 hover:text-blue-800 p-1"
          title="View details"
        >
          <Eye size={18} />
        </button>
      )
    }
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscriptions Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage user subscriptions</p>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by ID, email, or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchId && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'subscription' : 'subscriptions'}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          data={filteredSubscriptions}
          columns={columns}
          loading={loading}
          emptyMessage={searchId ? 'No subscriptions found matching your search' : 'No subscriptions found'}
        />
      </div>
    </div>
  )
}
