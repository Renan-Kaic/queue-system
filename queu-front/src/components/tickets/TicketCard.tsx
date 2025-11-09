'use client'
import { useState } from 'react'
import {
  User,
  Clock,
  Phone,
  X,
  CheckCircle,
  RotateCcw,
  UserX,
  Play,
} from 'lucide-react'
import { Ticket, TicketStatus } from '@/types/ticket'
import { TicketStatusBadge } from './TicketStatusBadge'
import { TicketPriorityBadge } from './TicketPriorityBadge'
import { useTickets } from '@/hooks/useStore'
import { handleResult } from '@/handlers/resultHandler'

interface TicketCardProps {
  ticket: Ticket
  showActions?: boolean
  isCurrentTicket?: boolean
}

export function TicketCard({
  ticket,
  showActions = true,
  isCurrentTicket = false,
}: TicketCardProps) {
  const [isActioning, setIsActioning] = useState(false)
  const {
    callNextTicket,
    startService,
    completeService,
    cancelTicket,
    markNoShow,
  } = useTickets()

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    })
  }

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start)
    const endTime = end ? new Date(end) : new Date()
    const diff = endTime.getTime() - startTime.getTime()
    const minutes = Math.floor(diff / 60000)
    return `${minutes} min`
  }

  const handleAction = async (
    action: () => Promise<any>,
    successMessage: string
  ) => {
    setIsActioning(true)
    try {
      await action()
      handleResult({
        success: true,
        message: successMessage,
      })
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao executar ação',
          errors: [error.message || 'Erro desconhecido'],
        }
      )
    } finally {
      setIsActioning(false)
    }
  }

  const handleCall = () => {
    handleAction(
      () => callNextTicket(ticket.queueId),
      'Ticket chamado com sucesso!'
    )
  }

  const handleStart = () => {
    handleAction(() => startService(ticket.id), 'Atendimento iniciado!')
  }

  const handleComplete = () => {
    handleAction(() => completeService(ticket.id), 'Atendimento concluído!')
  }

  const handleCancel = () => {
    handleAction(() => cancelTicket(ticket.id), 'Ticket cancelado!')
  }

  const handleNoShow = () => {
    handleAction(
      () => markNoShow(ticket.id),
      'Ticket marcado como não compareceu!'
    )
  }

  const getActionButtons = () => {
    const baseClasses =
      'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors disabled:opacity-50'

    switch (ticket.ticketStatus) {
      case TicketStatus.Waiting:
        return (
          <>
            <button
              onClick={handleCall}
              disabled={isActioning}
              className={`${baseClasses} bg-blue-100 text-blue-700 hover:bg-blue-200`}
            >
              <Phone className='w-3 h-3' />
              Chamar
            </button>
            <button
              onClick={handleCancel}
              disabled={isActioning}
              className={`${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`}
            >
              <X className='w-3 h-3' />
              Cancelar
            </button>
          </>
        )

      case TicketStatus.Called:
        return (
          <>
            <button
              onClick={handleStart}
              disabled={isActioning}
              className={`${baseClasses} bg-green-100 text-green-700 hover:bg-green-200`}
            >
              <Play className='w-3 h-3' />
              Iniciar
            </button>
            <button
              onClick={handleNoShow}
              disabled={isActioning}
              className={`${baseClasses} bg-orange-100 text-orange-700 hover:bg-orange-200`}
            >
              <UserX className='w-3 h-3' />
              Não Veio
            </button>
            <button
              onClick={handleCancel}
              disabled={isActioning}
              className={`${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`}
            >
              <X className='w-3 h-3' />
              Cancelar
            </button>
          </>
        )

      case TicketStatus.InService:
        return (
          <>
            <button
              onClick={handleComplete}
              disabled={isActioning}
              className={`${baseClasses} bg-green-100 text-green-700 hover:bg-green-200`}
            >
              <CheckCircle className='w-3 h-3' />
              Concluir
            </button>
            <button
              onClick={handleCancel}
              disabled={isActioning}
              className={`${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`}
            >
              <X className='w-3 h-3' />
              Cancelar
            </button>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm p-4 ${
        isCurrentTicket
          ? 'ring-2 ring-blue-500 border-blue-500'
          : 'border-gray-200'
      }`}
    >
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>
            {ticket.ticketCode}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <TicketStatusBadge status={ticket.ticketStatus} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
        </div>
        {isCurrentTicket && (
          <div className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
            ATUAL
          </div>
        )}
      </div>

      {/* Informações do Cidadão */}
      <div className='flex items-center gap-3 mb-3'>
        <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
          <User className='w-4 h-4 text-gray-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-gray-900 truncate'>
            {ticket.citizen?.name || `Cidadão #${ticket.citizenId}`}
          </p>
          {ticket.citizen?.document && (
            <p className='text-sm text-gray-600'>{ticket.citizen.document}</p>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className='space-y-1 mb-4'>
        <div className='flex items-center gap-2 text-xs text-gray-600'>
          <Clock className='w-3 h-3' />
          <span>Emitido: {formatTime(ticket.issuedAt)}</span>
        </div>

        {ticket.calledAt && (
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <Clock className='w-3 h-3' />
            <span>Chamado: {formatTime(ticket.calledAt)}</span>
          </div>
        )}

        {ticket.startedAt && (
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <Clock className='w-3 h-3' />
            <span>Iniciado: {formatTime(ticket.startedAt)}</span>
          </div>
        )}

        {ticket.completedAt && (
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <Clock className='w-3 h-3' />
            <span>Concluído: {formatTime(ticket.completedAt)}</span>
            {ticket.startedAt && (
              <span className='text-green-600 font-medium'>
                ({formatDuration(ticket.startedAt, ticket.completedAt)})
              </span>
            )}
          </div>
        )}

        {ticket.cancelledAt && (
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <Clock className='w-3 h-3' />
            <span>Cancelado: {formatTime(ticket.cancelledAt)}</span>
          </div>
        )}
      </div>

      {/* Ações */}
      {showActions && getActionButtons() && (
        <div className='flex flex-wrap gap-2 pt-3 border-t border-gray-100'>
          {getActionButtons()}
        </div>
      )}

      {/* Indicator de loading */}
      {isActioning && (
        <div className='absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg'>
          <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      )}
    </div>
  )
}
