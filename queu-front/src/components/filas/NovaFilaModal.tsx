'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  CreateQueueDto,
  QueueStatus,
  UpdateQueueDto,
  Queue,
} from '@/types/queue'
import { QueueService } from '@/services/queueService'
import { useQueueStore } from '@/store/queueStore'
import { handleResult } from '@/handlers/resultHandler'
import { Departamento } from '@/types/departmento'

interface NovaFilaModalProps {
  isOpen: boolean
  onClose: () => void
  departmentId?: number
  departments: Departamento[]
  queueToEdit?: Queue | null
}

export function NovaFilaModal({
  isOpen,
  onClose,
  departmentId,
  departments,
  queueToEdit,
}: NovaFilaModalProps) {
  const { addQueue, updateQueue } = useQueueStore()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateQueueDto>({
    name: '',
    code: '',
    description: '',
    maxQueueSize: 100,
    departmentId: departmentId || 0,
    status: QueueStatus.Active,
  })

  useEffect(() => {
    if (queueToEdit) {
      setFormData({
        name: queueToEdit.name,
        code: queueToEdit.code,
        description: queueToEdit.description || '',
        maxQueueSize: queueToEdit.maxQueueSize,
        departmentId: queueToEdit.departmentId,
        status: queueToEdit.status,
      })
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        maxQueueSize: 100,
        departmentId: departmentId || 0,
        status: QueueStatus.Active,
      })
    }
  }, [queueToEdit, departmentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (queueToEdit) {
        // Update
        const updateData: UpdateQueueDto = {
          id: queueToEdit.id,
          ...formData,
        }
        const response = await QueueService.update(updateData)
        handleResult(response, () => {
          updateQueue(response.data)
          onClose()
        })
      } else {
        // Create
        const response = await QueueService.create(formData)
        handleResult(response, () => {
          addQueue(response.data)
          onClose()
        })
      }
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao salvar fila',
        }
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {queueToEdit ? 'Editar Fila' : 'Nova Fila'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nome *
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full input px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent'
                required
                maxLength={255}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Código *
              </label>
              <input
                type='text'
                value={formData.code}
                onChange={e =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className='w-full input px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent uppercase'
                required
                maxLength={50}
                pattern='[A-Z0-9_-]+'
                title='Apenas letras maiúsculas, números, hífen e underscore'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full input px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent'
              rows={3}
              maxLength={500}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Capacidade Máxima *
              </label>
              <input
                type='number'
                value={formData.maxQueueSize}
                onChange={e =>
                  setFormData({
                    ...formData,
                    maxQueueSize: parseInt(e.target.value),
                  })
                }
                className='w-full input px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent'
                required
                min={1}
                max={1000}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Departamento *
              </label>
              <select
                value={formData.departmentId}
                onChange={e =>
                  setFormData({
                    ...formData,
                    departmentId: parseInt(e.target.value),
                  })
                }
                className='w-full input px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent'
                required
              >
                <option value={0}>Selecione um departamento</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status *
            </label>
            <select
              value={formData.status}
              onChange={e =>
                setFormData({
                  ...formData,
                  status: parseInt(e.target.value) as QueueStatus,
                })
              }
              className='w-full input px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent'
              required
            >
              <option value={QueueStatus.Active}>Ativo</option>
              <option value={QueueStatus.Inactive}>Inativo</option>
              <option value={QueueStatus.Suspended}>Suspenso</option>
            </select>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='btn flex-1 px-4 py-2 btn-primary  text-white rounded-lg  transition-colors disabled:opacity-50'
              disabled={loading}
            >
              {loading ? 'Salvando...' : queueToEdit ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
