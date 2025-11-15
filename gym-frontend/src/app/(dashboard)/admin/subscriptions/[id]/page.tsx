/**
 * SUBSCRIPTION DETAIL PAGE
 *
 * Página de detalle de una suscripción específica.
 *
 * Características:
 * - Información completa de la suscripción
 * - Detalles del usuario
 * - Lista de membresías incluidas
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, DollarSign, User as UserIcon, Mail, CreditCard, Package } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Table } from '@/app/components/ui/Table'
import subscriptionsService from '@/app/services/subscriptions/subscriptions.service'
import type { Subscription, SubscriptionItem } from '@/app/interfaces/subscriptions.interface'

interface SubscriptionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SubscriptionDetailPage({ params }: SubscriptionDetailPageProps) {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => {
      setSubscriptionId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionId])

  const loadSubscription = async () => {
    if (!subscriptionId) return

    try {
      setLoading(true)
      const data = await subscriptionsService.getById(subscriptionId)
      console.log('Subscription loaded:', data)
      setSubscription(data)
    } catch (error: any) {
      console.error('Error loading subscription:', error)
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }
      alert('Error loading subscription details')
    } finally {
      setLoading(false)
    }
  }

  // Obtener el item activo
  const getActiveItem = () => {
    if (!subscription) return null
    return subscription.items?.find(item => item.status === 'active') || null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Subscription not found</p>
          <Button onClick={() => router.push('/admin/subscriptions')} variant="secondary" className="mt-4">
            Back to Subscriptions
          </Button>
        </div>
      </div>
    )
  }

  const itemsColumns = [
    {
      key: 'name',
      header: 'Membership Name'
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (item: SubscriptionItem) => `$${Number(item.cost).toFixed(2)}`
    },
    {
      key: 'duration_months',
      header: 'Duration',
      render: (item: SubscriptionItem) => (
        item.duration_months === 1 ? '1 Month' : `${item.duration_months} Months`
      )
    },
    {
      key: 'max_classes_assistance',
      header: 'Max Classes'
    },
    {
      key: 'max_gym_assistance',
      header: 'Max Gym Visits'
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (item: SubscriptionItem) => new Date(item.start_date).toLocaleDateString()
    },
    {
      key: 'end_date',
      header: 'End Date',
      render: (item: SubscriptionItem) => new Date(item.end_date).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: SubscriptionItem) => {
        const statusColors: Record<string, string> = {
          active: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          expired: 'bg-gray-100 text-gray-800',
          cancelled: 'bg-red-100 text-red-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[item.status] || 'bg-gray-100 text-gray-800'
          }`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        )
      }
    }
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <Button
          onClick={() => router.push('/admin/subscriptions')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Subscriptions</span>
          <span className="sm:hidden">Volver</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Details</h1>
          <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium mt-2 ${
            subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {subscription.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Subscription Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Package size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Membership Name</p>
                <p className="mt-1 text-lg text-gray-900">{getActiveItem()?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <DollarSign size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cost</p>
                <p className="mt-1 text-lg text-gray-900">
                  ${getActiveItem() ? Number(getActiveItem()!.cost).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1 text-lg text-gray-900">
                  {getActiveItem()?.duration_months ?
                    (getActiveItem()!.duration_months === 1 ? '1 Month' : `${getActiveItem()!.duration_months} Months`) :
                    'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                <p className="mt-1 text-lg text-gray-900">
                  {getActiveItem()?.purchase_date ? new Date(getActiveItem()!.purchase_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Max Classes</p>
                <p className="mt-1 text-lg text-gray-900">{getActiveItem()?.max_classes_assistance || 0} classes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Max Gym Visits</p>
                <p className="mt-1 text-lg text-gray-900">{getActiveItem()?.max_gym_assistance || 0} visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subscription.user && (
        <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">User Information</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <UserIcon size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-lg text-gray-900">{subscription.user.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-lg text-gray-900">{subscription.user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <UserIcon size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="mt-1 text-lg text-gray-900">{subscription.user.age} years</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-100">
                    <div className={`w-2 h-2 rounded-full ${subscription.user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User Status</p>
                  <p className="mt-1 text-lg text-gray-900">{subscription.user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Subscription Items</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {subscription.items?.length || 0} {subscription.items?.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="p-4 sm:p-6">
          {subscription.items && subscription.items.length > 0 ? (
            <Table
              data={subscription.items}
              columns={itemsColumns}
              emptyMessage="No items found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items in this subscription
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
