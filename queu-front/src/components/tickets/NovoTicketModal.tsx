'use client'
import { useState, useEffect } from 'react'
import { X, Ticket } from 'lucide-react'
import { useTickets } from '@/hooks/useStore'
import { handleResult } from '@/handlers/resultHandler'
import { CreateTicketDto, TicketPriority } from '@/types/ticket'
import { Queue } from '@/types/queue'
import Usuario from '@/types/usuarios'
import { UserSearch } from './UserSearch'

interface NovoTicketModalProps {
  isOpen: boolean
  onClose: () => void
  queue: Queue
}

export function NovoTicketModal({
  isOpen,
  onClose,
  queue,
}: NovoTicketModalProps) {
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.Normal
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createTicket } = useTickets()

  // Resetar formulário quando modal abre/fecha
  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null)
      setPriority(TicketPriority.Normal)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) {
      handleResult({
        success: false,
        message: 'Selecione um usuário para gerar o ticket',
        errors: ['Usuário é obrigatório'],
      })
      return
    }

    setIsSubmitting(true)

    try {
      const ticketData: CreateTicketDto = {
        queueId: queue.id,
        citizenId: selectedUser.id,
        priority: priority,
      }

      await createTicket(ticketData)

      handleResult({
        success: true,
        message: 'Ticket criado com sucesso!',
      })

      onClose()
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao criar ticket',
          errors: [error.message || 'Erro desconhecido'],
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityOptions = [
    { value: TicketPriority.Normal, label: 'Normal' },
    { value: TicketPriority.Priority, label: 'Prioritário' },
    { value: TicketPriority.Urgent, label: 'Urgente' },
  ]

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <Ticket className='w-4 h-4 text-blue-600' />
            </div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Novo Ticket - {queue.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Fila Selecionada
            </label>
            <div className='p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <p className='font-medium text-gray-900'>{queue.name}</p>
              <p className='text-sm text-gray-600'>Código: {queue.code}</p>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Usuário *
            </label>
            <UserSearch
              onUserSelect={setSelectedUser}
              selectedUser={selectedUser}
              placeholder='Buscar usuário para gerar o ticket...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Prioridade
            </label>
            <select
              value={priority}
              onChange={e =>
                setPriority(Number(e.target.value) as TicketPriority)
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSubmitting || !selectedUser}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Criando...
                </>
              ) : (
                <>
                  <Ticket className='w-4 h-4' />
                  Gerar Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
