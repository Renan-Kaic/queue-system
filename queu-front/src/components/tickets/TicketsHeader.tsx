'use client'
import { Plus, RefreshCw, Phone, Users, Clock, PhoneIncoming } from 'lucide-react'
import { Queue } from '@/types/queue'
import { Ticket, TicketStatus } from '@/types/ticket'

interface TicketsHeaderProps {
  queue: Queue
  tickets: Ticket[]
  onNewTicket: () => void
  onRefresh: () => void
  onCallNext: () => void
  onRecallLast?: () => void
  isLoading?: boolean
}

export function TicketsHeader({
  queue,
  tickets,
  onNewTicket,
  onRefresh,
  onCallNext,
  onRecallLast,
  isLoading = false,
}: TicketsHeaderProps) {
  const waitingTickets = tickets.filter(
    t => t.ticketStatus === TicketStatus.Waiting
  )
  const inServiceTickets = tickets.filter(
    t => t.ticketStatus === TicketStatus.InService
  )
  const calledTickets = tickets.filter(
    t => t.ticketStatus === TicketStatus.Called
  )
  const completedToday = tickets.filter(t => {
    if (t.ticketStatus !== TicketStatus.Completed || !t.completedAt)
      return false
    const today = new Date().toDateString()
    return new Date(t.completedAt).toDateString() === today
  })

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div className='flex-1'>
          <h2 className='text-xl font-bold text-gray-900 mb-1'>
            Gerenciar Tickets - {queue.name}
          </h2>
          <p className='text-sm text-gray-600'>
            {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} total
          </p>
        </div>

        {/* Estatísticas */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 text-orange-600 mb-1'>
              <Clock className='w-4 h-4' />
              <span className='text-xs font-medium'>AGUARDANDO</span>
            </div>
            <p className='text-2xl font-bold text-orange-600'>
              {waitingTickets.length}
            </p>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 text-blue-600 mb-1'>
              <Users className='w-4 h-4' />
              <span className='text-xs font-medium'>ATENDENDO</span>
            </div>
            <p className='text-2xl font-bold text-blue-600'>
              {inServiceTickets.length}
            </p>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 text-green-600 mb-1'>
              <Users className='w-4 h-4' />
              <span className='text-xs font-medium'>CONCLUÍDOS</span>
            </div>
            <p className='text-2xl font-bold text-green-600'>
              {completedToday.length}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className='flex gap-2'>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className='flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
            title='Atualizar lista'
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Atualizar
          </button>

          {onRecallLast && (
            <button
              onClick={onRecallLast}
              disabled={isLoading || calledTickets.length === 0}
              className='flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              title={
                calledTickets.length === 0
                  ? 'Nenhum ticket foi chamado'
                  : 'Rechamar último ticket'
              }
            >
              <PhoneIncoming className='w-4 h-4' />
              Rechamar
            </button>
          )}

          <button
            onClick={onCallNext}
            disabled={isLoading || waitingTickets.length === 0}
            className='flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            title={
              waitingTickets.length === 0
                ? 'Nenhum ticket aguardando'
                : 'Chamar próximo ticket'
            }
          >
            <Phone className='w-4 h-4' />
            Chamar Próximo
          </button>

          <button
            onClick={onNewTicket}
            disabled={isLoading}
            className='flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
          >
            <Plus className='w-4 h-4' />
            Novo Ticket
          </button>
        </div>
      </div>

      {/* Próximo ticket */}
      {waitingTickets.length > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-700'>
                Próximo na fila:
              </p>
              <p className='text-lg font-bold text-blue-600'>
                {waitingTickets[0].ticketCode}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-600'>
                {waitingTickets[0].citizen?.name ||
                  `Cidadão #${waitingTickets[0].citizenId}`}
              </p>
              <p className='text-xs text-gray-500'>
                Emitido:{' '}
                {new Date(waitingTickets[0].issuedAt).toLocaleTimeString(
                  'pt-BR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
