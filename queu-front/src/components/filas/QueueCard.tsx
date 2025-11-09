'use client'

import { useState } from 'react'
import { Queue } from '@/types/queue'
import { QueueStatusBadge } from './QueueStatusBadge'
import { QueueActions } from './QueueActions'
import { useTickets } from '@/hooks/useStore'
import { handleResult } from '@/handlers/resultHandler'

interface QueueCardProps {
  queue: Queue
  onEdit: (queue: Queue) => void
  onDelete: (queue: Queue) => void
  onEmitTicket?: (queue: Queue) => void
}

export function QueueCard({
  queue,
  onEdit,
  onDelete,
  onEmitTicket,
}: QueueCardProps) {
  const [isActioning, setIsActioning] = useState(false)
  const { callNextTicket, recallLastTicket } = useTickets()

  const handleEmitTicket = () => {
    if (onEmitTicket) {
      onEmitTicket(queue)
    } else {
      handleResult({
        success: false,
        message: 'Funcionalidade de emitir senha não implementada',
      })
    }
  }

  const handleCallNext = async () => {
    if (isActioning) return

    setIsActioning(true)
    try {
      await callNextTicket(queue.id)
      handleResult({
        success: true,
        message: 'Próximo ticket chamado com sucesso!',
      })
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao chamar próximo ticket',
        }
      )
    } finally {
      setIsActioning(false)
    }
  }

  const handleRecallLast = async () => {
    if (isActioning) return

    setIsActioning(true)
    try {
      await recallLastTicket(queue.id)
      handleResult({
        success: true,
        message: 'Último ticket rechamado com sucesso!',
      })
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao rechamar último ticket',
        }
      )
    } finally {
      setIsActioning(false)
    }
  }

  const handleCallLate = () => {
    handleResult({
      success: false,
      message: 'Funcionalidade de chamar atrasado não implementada ainda',
    })
  }
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {queue.name}
            </h3>
            <QueueStatusBadge status={queue.status} />
          </div>
          <p className='text-sm text-gray-500 mb-1'>Código: {queue.code}</p>
          {queue.description && (
            <p className='text-sm text-gray-600 mt-2'>{queue.description}</p>
          )}
        </div>
        <QueueActions queue={queue} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100'>
        <div>
          <p className='text-xs text-gray-500 mb-1'>Fila Atual</p>
          <p className='text-2xl font-bold text-blue-600'>
            {queue.currentQueueSize}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500 mb-1'>Capacidade Máxima</p>
          <p className='text-2xl font-bold text-gray-700'>
            {queue.maxQueueSize}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <button
          onClick={handleEmitTicket}
          disabled={isActioning}
          className='px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Emitir Senha
        </button>
        <button
          onClick={handleCallNext}
          disabled={isActioning}
          className='px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isActioning ? 'Chamando...' : 'Chamar Próximo'}
        </button>
        <button
          onClick={handleRecallLast}
          disabled={isActioning}
          className='px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Rechamar Último
        </button>
        <button
          onClick={handleCallLate}
          disabled={isActioning}
          className='px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Chamar Atrasado
        </button>
      </div>

      <div className='mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500'>
        Criado em: {new Date(queue.createdAt).toLocaleString('pt-BR')}
      </div>
    </div>
  )
}
