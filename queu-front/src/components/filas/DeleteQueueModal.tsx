'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Queue } from '@/types/queue'
import { QueueService } from '@/services/queueService'
import { useQueueStore } from '@/store/queueStore'
import { handleResult } from '@/handlers/resultHandler'

interface DeleteQueueModalProps {
  isOpen: boolean
  onClose: () => void
  queue: Queue | null
}

export function DeleteQueueModal({
  isOpen,
  onClose,
  queue,
}: DeleteQueueModalProps) {
  const { removeQueue } = useQueueStore()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!queue) return

    setLoading(true)
    try {
      const response = await QueueService.delete(queue.id)
      handleResult(response, () => {
        removeQueue(queue.id)
        onClose()
      })
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao excluir fila',
        }
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !queue) return null

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 rounded-full'>
              <AlertTriangle className='text-red-600' size={24} />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>Excluir Fila</h2>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        <div className='mb-6'>
          <p className='text-gray-600 mb-4'>
            Tem certeza que deseja excluir a fila abaixo?
          </p>
          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
            <p className='font-semibold text-gray-900'>{queue.name}</p>
            <p className='text-sm text-gray-500'>Código: {queue.code}</p>
            <p className='text-sm text-gray-500 mt-2'>
              Fila atual: {queue.currentQueueSize} / {queue.maxQueueSize}
            </p>
          </div>
          <p className='text-sm text-red-600 mt-4'>
            Esta ação não pode ser desfeita. Todos os tickets desta fila serão
            perdidos.
          </p>
        </div>

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
