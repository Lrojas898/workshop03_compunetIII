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
import type { Subscription } from '@/app/interfaces/subscriptions.interface'
import type { Membership } from '@/app/interfaces/membership.interface'

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

  const membershipsColumns = [
    {
      key: 'name',
      header: 'Membership Name'
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (membership: Membership) => `$${parseFloat(membership.cost).toFixed(2)}`
    },
    {
      key: 'duration_months',
      header: 'Duration',
      render: (membership: Membership) => (
        membership.duration_months === 1 ? '1 Month' : `${membership.duration_months} Months`
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
      key: 'status',
      header: 'Status',
      render: (membership: Membership) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          membership.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {membership.status ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          onClick={() => router.push('/admin/subscriptions')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft size={16} />
          Back to Subscriptions
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Details</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
            subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {subscription.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Package size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subscription Name</p>
                <p className="mt-1 text-lg text-gray-900">{subscription.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <DollarSign size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cost</p>
                <p className="mt-1 text-lg text-gray-900">${subscription.cost?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1 text-lg text-gray-900">
                  {subscription.duration_months ?
                    (subscription.duration_months === 1 ? '1 Month' : `${subscription.duration_months} Months`) :
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
                  {subscription.purchase_date ? new Date(subscription.purchase_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Max Classes</p>
                <p className="mt-1 text-lg text-gray-900">{subscription.max_classes_assistance || 0} classes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Max Gym Visits</p>
                <p className="mt-1 text-lg text-gray-900">{subscription.max_gym_assistance || 0} visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subscription.user && (
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Included Memberships</h2>
          <p className="text-gray-600 mt-1">
            {subscription.memberships?.length || 0} {subscription.memberships?.length === 1 ? 'membership' : 'memberships'}
          </p>
        </div>
        <div className="p-6">
          {subscription.memberships && subscription.memberships.length > 0 ? (
            <Table
              data={subscription.memberships}
              columns={membershipsColumns}
              emptyMessage="No memberships assigned"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No memberships assigned to this subscription
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
