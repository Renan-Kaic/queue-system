'use client'
import { useState } from 'react'
import { AlertTriangle, Ticket as TicketIcon } from 'lucide-react'
import { Ticket } from '@/types/ticket'
import { useTickets } from '@/hooks/useStore'
import { handleResult } from '@/handlers/resultHandler'

interface DeleteTicketModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
}

export function DeleteTicketModal({
  isOpen,
  onClose,
  ticket,
}: DeleteTicketModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteTicket } = useTickets()

  const handleConfirm = async () => {
    if (!ticket) return

    setIsDeleting(true)

    try {
      await deleteTicket(ticket.id)

      handleResult({
        success: true,
        message: 'Ticket excluído com sucesso!',
      })

      onClose()
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao excluir ticket',
          errors: [error.message || 'Erro desconhecido'],
        }
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !ticket) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-xl'>
        <div className='p-6'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-6 h-6 text-red-600' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Confirmar Exclusão
              </h2>
              <p className='text-sm text-gray-600'>
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>

          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <TicketIcon className='w-4 h-4 text-blue-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>{ticket.ticketCode}</p>
                <p className='text-sm text-gray-600'>
                  {ticket.citizen?.name || `Cidadão #${ticket.citizenId}`}
                </p>
                <p className='text-xs text-gray-500'>
                  Fila: {ticket.queue?.name || `#${ticket.queueId}`}
                </p>
              </div>
            </div>
          </div>

          <p className='text-sm text-gray-600 mb-6'>
            Tem certeza de que deseja excluir este ticket? O cidadão precisará
            gerar um novo ticket se desejar atendimento.
          </p>

          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
            >
              {isDeleting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Excluindo...
                </>
              ) : (
                <>
                  <AlertTriangle className='w-4 h-4' />
                  Excluir Ticket
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
