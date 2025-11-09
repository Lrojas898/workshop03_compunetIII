/**
 * CREATE MEMBERSHIP FORM
 *
 * Formulario para crear nuevas membresías
 */

'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/app/components/ui/Button'
import type { CreateMembershipDto } from '@/app/interfaces/membership.interface'

interface CreateMembershipFormProps {
  onSubmit: (data: CreateMembershipDto) => Promise<void>
  onCancel: () => void
}

export function CreateMembershipForm({ onSubmit, onCancel }: CreateMembershipFormProps) {
  const [formData, setFormData] = useState<CreateMembershipDto>({
    name: '',
    cost: 0,
    max_classes_assistance: 0,
    max_gym_assistance: 0,
    duration_months: 1,
    status: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error creating membership')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Membership Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
          placeholder="e.g., Gold Plan"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
            Cost
          </label>
          <input
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="duration_months" className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            id="duration_months"
            value={formData.duration_months}
            onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) as 1 | 12 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value={1}>1 Month (Monthly)</option>
            <option value={12}>12 Months (Yearly)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="max_classes" className="block text-sm font-medium text-gray-700 mb-1">
            Max Classes
          </label>
          <input
            id="max_classes"
            type="number"
            min="0"
            value={formData.max_classes_assistance}
            onChange={(e) => setFormData({ ...formData, max_classes_assistance: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="max_gym" className="block text-sm font-medium text-gray-700 mb-1">
            Max Gym Visits
          </label>
          <input
            id="max_gym"
            type="number"
            min="0"
            value={formData.max_gym_assistance}
            onChange={(e) => setFormData({ ...formData, max_gym_assistance: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="status"
          type="checkbox"
          checked={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
          className="rounded"
          disabled={loading}
        />
        <label htmlFor="status" className="text-sm text-gray-700">
          Active
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Create Membership
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
