/**
 * CLASS MANAGEMENT COMPONENT
 *
 * Gestión completa de clases del gimnasio.
 *
 * Características:
 * - CRUD completo de clases
 * - Activar/desactivar clases
 * - Validaciones
 * - Solo Admin puede eliminar
 */

'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Power, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import classesService from '@/app/services/classes/classes.service'
import type { Class, CreateClassDto } from '@/app/interfaces/classes.interface'

interface ClassManagementProps {
  userRole?: string
}

export function ClassManagement({ userRole = 'coach' }: ClassManagementProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<CreateClassDto>({
    name: '',
    description: '',
    duration_minutes: 60,
    max_capacity: 20,
    isActive: true,
  })

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const data = await classesService.getAll()
      setClasses(data)
      setError('')
    } catch (err: any) {
      console.error('Error loading classes:', err)
      setError('Error al cargar clases')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_minutes: 60,
      max_capacity: 20,
      isActive: true,
    })
    setEditingClass(null)
    setShowForm(false)
  }

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem)
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      duration_minutes: classItem.duration_minutes || 60,
      max_capacity: classItem.max_capacity,
      isActive: classItem.isActive,
    })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (editingClass) {
        await classesService.update(editingClass.id, formData)
        setSuccess('Clase actualizada exitosamente')
      } else {
        await classesService.create(formData)
        setSuccess('Clase creada exitosamente')
      }
      resetForm()
      await loadClasses()
    } catch (err: any) {
      console.error('Error saving class:', err)
      setError(err.response?.data?.message || 'Error al guardar clase')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      await classesService.toggleActive(id)
      setSuccess('Estado de clase actualizado')
      await loadClasses()
    } catch (err: any) {
      console.error('Error toggling class:', err)
      setError(err.response?.data?.message || 'Error al cambiar estado')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la clase "${name}"?\n\nNOTA: Solo se puede eliminar si no tiene asistencias registradas.`)) {
      return
    }

    try {
      await classesService.delete(id)
      setSuccess('Clase eliminada exitosamente')
      await loadClasses()
    } catch (err: any) {
      console.error('Error deleting class:', err)
      setError(err.response?.data?.message || 'Error al eliminar clase')
    }
  }

  const isAdmin = userRole === 'admin'

  if (loading && classes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500">Cargando clases...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Clases</h2>
          <p className="text-gray-600 text-sm mt-1">Administra las clases del gimnasio</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : <><Plus size={18} /> Nueva Clase</>}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingClass ? 'Editar Clase' : 'Nueva Clase'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ejemplo: Spinning 6:00 PM"
                maxLength={100}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la clase"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad máxima
              </label>
              <input
                id="capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" isLoading={loading}>
              {editingClass ? 'Actualizar' : 'Crear Clase'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{classItem.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{classItem.description || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {classItem.duration_minutes ? `${classItem.duration_minutes} min` : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{classItem.max_capacity}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    classItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {classItem.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleToggleActive(classItem.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title={classItem.isActive ? 'Desactivar' : 'Activar'}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(classItem.id, classItem.name)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay clases registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
