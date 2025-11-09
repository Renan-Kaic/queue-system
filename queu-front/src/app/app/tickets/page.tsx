'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTickets } from '@/hooks/useStore'
import { handleResult } from '@/handlers/resultHandler'
import { QueueService } from '@/services/queueService'
import { Queue } from '@/types/queue'
import { Ticket as TicketType } from '@/types/ticket'
import {
  TicketsHeader,
  TicketCard,
  TicketFilters,
  NovoTicketModal,
  DeleteTicketModal,
  TicketFilterState,
} from '@/components/tickets'

export default function TicketsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queueId = searchParams.get('queueId')

  const [queue, setQueue] = useState<Queue | null>(null)
  const [isLoadingQueue, setIsLoadingQueue] = useState(true)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isDeleteTicketModalOpen, setIsDeleteTicketModalOpen] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<TicketType | null>(null)
  const [ticketFilters, setTicketFilters] = useState<TicketFilterState>({})

  const {
    tickets,
    isLoading: isLoadingTickets,
    fetchTicketsByQueue,
    currentTicket,
    callNextTicket,
    recallLastTicket,
  } = useTickets()

  // Carregar dados da fila
  useEffect(() => {
    const loadQueue = async () => {
      if (!queueId) {
        router.push('/app')
        return
      }

      setIsLoadingQueue(true)
      try {
        const response = await QueueService.getById(parseInt(queueId))
        handleResult(response, data => {
          if (data) {
            setQueue(data)
          } else {
            handleResult({
              success: false,
              message: 'Fila não encontrada',
            })
            router.push('/app')
          }
        })
      } catch (error: any) {
        handleResult(
          error.response?.data || {
            success: false,
            message: 'Erro ao carregar fila',
          }
        )
        router.push('/app')
      } finally {
        setIsLoadingQueue(false)
      }
    }

    loadQueue()
  }, [queueId, router])

  // Carregar tickets da fila
  useEffect(() => {
    if (queue?.id) {
      loadTickets()
    }
  }, [queue?.id, fetchTicketsByQueue])

  const loadTickets = async () => {
    if (!queue?.id) return

    try {
      await fetchTicketsByQueue(queue.id)
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao carregar tickets',
        }
      )
    }
  }

  // Filtrar tickets
  const filteredTickets = useMemo(() => {
    let result = tickets.filter(t => t.queueId === queue?.id)

    if (ticketFilters.status !== undefined) {
      result = result.filter(t => t.ticketStatus === ticketFilters.status)
    }

    if (ticketFilters.priority !== undefined) {
      result = result.filter(t => t.priority === ticketFilters.priority)
    }

    if (ticketFilters.search) {
      const search = ticketFilters.search.toLowerCase()
      result = result.filter(
        t =>
          t.ticketCode.toLowerCase().includes(search) ||
          t.citizen?.name.toLowerCase().includes(search) ||
          t.citizen?.document.includes(search)
      )
    }

    return result
  }, [tickets, queue?.id, ticketFilters])

  const handleGoBack = () => {
    router.push('/app')
  }

  const handleNewTicket = () => {
    setIsTicketModalOpen(true)
  }

  const handleCallNext = async () => {
    if (!queue?.id) return

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
    }
  }

  const handleRecallLast = async () => {
    if (!queue?.id) return

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
    }
  }

  const handleTicketDelete = (ticket: TicketType) => {
    setTicketToDelete(ticket)
    setIsDeleteTicketModalOpen(true)
  }

  if (isLoadingQueue) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Carregando fila...</p>
        </div>
      </div>
    )
  }

  if (!queue) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header com navegação */}
        <div className='flex items-center gap-4 mb-6'>
          <button
            onClick={handleGoBack}
            className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Voltar
          </button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Gerenciar Tickets
            </h1>
            <p className='text-sm text-gray-600'>
              Fila: {queue.name} ({queue.code})
            </p>
          </div>
        </div>

        <TicketsHeader
          queue={queue}
          tickets={filteredTickets}
          onNewTicket={handleNewTicket}
          onRefresh={loadTickets}
          onCallNext={handleCallNext}
          onRecallLast={handleRecallLast}
          isLoading={isLoadingTickets}
        />

        <TicketFilters onFilterChange={setTicketFilters} className='mb-6' />

        {/* Lista de tickets */}
        {isLoadingTickets && filteredTickets.length === 0 ? (
          <div className='flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3'></div>
              <p className='text-gray-600 text-sm'>Carregando tickets...</p>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
            <div className='max-w-md mx-auto'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Nenhum ticket encontrado
              </h3>
              <p className='text-gray-600 mb-6'>
                Não há tickets para esta fila ou que correspondam aos filtros
                aplicados.
              </p>
              <button
                onClick={handleNewTicket}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Gerar Primeiro Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                showActions={true}
                isCurrentTicket={currentTicket?.id === ticket.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NovoTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        queue={queue}
      />

      <DeleteTicketModal
        isOpen={isDeleteTicketModalOpen}
        onClose={() => setIsDeleteTicketModalOpen(false)}
        ticket={ticketToDelete}
      />
    </div>
  )
}
