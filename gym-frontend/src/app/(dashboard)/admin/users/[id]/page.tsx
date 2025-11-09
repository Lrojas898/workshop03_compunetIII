/**
 * USER DETAIL PAGE
 *
 * Página de detalle y edición de un usuario específico.
 *
 * Características:
 * - Información completa del usuario
 * - Formulario de edición
 * - Navegación de regreso
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, User as UserIcon, Calendar, Shield } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import authenticationService from '@/app/services/auth/authentication.service'
import type { User } from '@/app/interfaces/auth.interface'

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Unwrap params promise
    params.then((p) => {
      setUserId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (userId) {
      loadUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const loadUser = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const data = await authenticationService.getUserById(userId)
      setUser(data)
    } catch (error: any) {
      console.error('Error loading user:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error loading user'

      // Check if it's a 401 (unauthorized) - token might have expired
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      alert(`Error loading user: ${errorMessage}`)
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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
          <Button onClick={() => router.push('/admin/users')} variant="secondary" className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          onClick={() => router.push('/admin/users')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <UserIcon size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-lg text-gray-900">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Mail size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1 text-lg text-gray-900">{user.age} years</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Shield size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.roles[0]?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-100">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-lg text-gray-900">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <UserIcon size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="mt-1 text-sm text-gray-600 font-mono">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
