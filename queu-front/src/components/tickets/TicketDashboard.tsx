'use client'
import { useEffect, useState } from 'react'
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { useTickets } from '@/hooks/useStore'
import { TicketStatus, TicketPriority } from '@/types/ticket'

interface TicketDashboardProps {
  queueId: number
  className?: string
}

export function TicketDashboard({
  queueId,
  className = '',
}: TicketDashboardProps) {
  const { tickets, fetchTicketsByQueue } = useTickets()
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchTicketsByQueue(queueId)
    }, 30000)

    return () => clearInterval(interval)
  }, [queueId, autoRefresh, fetchTicketsByQueue])

  const queueTickets = tickets.filter(t => t.queueId === queueId)

  // Estatísticas por status
  const waitingTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.Waiting
  )
  const calledTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.Called
  )
  const inServiceTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.InService
  )
  const completedTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.Completed
  )
  const cancelledTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.Cancelled
  )
  const noShowTickets = queueTickets.filter(
    t => t.ticketStatus === TicketStatus.NoShow
  )

  // Estatísticas por prioridade
  const priorityTickets = queueTickets.filter(
    t => t.priority === TicketPriority.Priority
  )
  const urgentTickets = queueTickets.filter(
    t => t.priority === TicketPriority.Urgent
  )

  // Tickets concluídos hoje
  const today = new Date().toDateString()
  const completedToday = completedTickets.filter(
    t => t.completedAt && new Date(t.completedAt).toDateString() === today
  )

  // Tempo médio de atendimento (em minutos)
  const getAverageServiceTime = () => {
    const ticketsWithServiceTime = completedTickets.filter(
      t => t.startedAt && t.completedAt
    )
    if (ticketsWithServiceTime.length === 0) return 0

    const totalTime = ticketsWithServiceTime.reduce((acc, ticket) => {
      const start = new Date(ticket.startedAt!).getTime()
      const end = new Date(ticket.completedAt!).getTime()
      return acc + (end - start)
    }, 0)

    return Math.round(totalTime / ticketsWithServiceTime.length / 60000) // converter para minutos
  }

  // Tempo médio de espera (em minutos)
  const getAverageWaitTime = () => {
    const ticketsWithWaitTime = queueTickets.filter(
      t => t.ticketStatus !== TicketStatus.Waiting && t.calledAt
    )
    if (ticketsWithWaitTime.length === 0) return 0

    const totalTime = ticketsWithWaitTime.reduce((acc, ticket) => {
      const issued = new Date(ticket.issuedAt).getTime()
      const called = new Date(ticket.calledAt!).getTime()
      return acc + (called - issued)
    }, 0)

    return Math.round(totalTime / ticketsWithWaitTime.length / 60000) // converter para minutos
  }

  const averageServiceTime = getAverageServiceTime()
  const averageWaitTime = getAverageWaitTime()

  const stats = [
    {
      title: 'Aguardando',
      value: waitingTickets.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Em Atendimento',
      value: inServiceTickets.length,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Concluídos Hoje',
      value: completedToday.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Total',
      value: queueTickets.length,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ]

  const additionalStats = [
    {
      title: 'Prioritários',
      value: priorityTickets.length + urgentTickets.length,
      icon: AlertTriangle,
      color: 'text-yellow-600',
    },
    {
      title: 'Cancelados',
      value: cancelledTickets.length + noShowTickets.length,
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: 'Tempo Médio Espera',
      value: `${averageWaitTime}min`,
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Tempo Médio Atendimento',
      value: `${averageServiceTime}min`,
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Estatísticas principais */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Estatísticas secundárias */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center gap-3'>
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className='text-xs text-gray-600'>{stat.title}</p>
                  <p className={`font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controle de auto-refresh */}
      <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200'>
        <div className='text-sm text-gray-600'>
          <p>
            Atualização automática:{' '}
            <span className='font-medium'>30 segundos</span>
          </p>
          <p className='text-xs'>
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={autoRefresh}
            onChange={e => setAutoRefresh(e.target.checked)}
            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <span className='text-sm text-gray-700'>Auto-refresh</span>
        </label>
      </div>

      {/* Próximo ticket */}
      {waitingTickets.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-blue-900 mb-2'>
            Próximo na Fila
          </h3>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-bold text-blue-900'>
                {waitingTickets[0].ticketCode}
              </p>
              <p className='text-sm text-blue-700'>
                {waitingTickets[0].citizen?.name ||
                  `Cidadão #${waitingTickets[0].citizenId}`}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-xs text-blue-600'>
                Aguardando há{' '}
                {Math.round(
                  (new Date().getTime() -
                    new Date(waitingTickets[0].issuedAt).getTime()) /
                    60000
                )}{' '}
                min
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
