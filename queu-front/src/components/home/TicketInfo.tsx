'use client'
import { Departamento } from '@/store'
import { useEffect, useState, useMemo } from 'react'
import { Queue } from '@/types/queue'
import { QueueService } from '@/services/queueService'
import { QueueCard } from '@/components/filas/QueueCard'
import { NovaFilaModal } from '@/components/filas/NovaFilaModal'
import { DeleteQueueModal } from '@/components/filas/DeleteQueueModal'
import { handleResult } from '@/handlers/resultHandler'
import { Plus, RefreshCw, Ticket } from 'lucide-react'
import { useTickets } from '@/hooks/useStore'
import { Ticket as TicketType } from '@/types/ticket'
import {
  TicketsHeader,
  TicketCard,
  TicketFilters,
  NovoTicketModal,
  DeleteTicketModal,
  TicketFilterState,
  TicketDashboard,
} from '@/components/tickets'

export default function TicketInfo({ departamento }: TicketInfoProps) {
  const [queues, setQueues] = useState<Queue[]>([])
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [queueToEdit, setQueueToEdit] = useState<Queue | null>(null)
  const [queueToDelete, setQueueToDelete] = useState<Queue | null>(null)

  // Estados para tickets
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isDeleteTicketModalOpen, setIsDeleteTicketModalOpen] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<TicketType | null>(null)
  const [ticketFilters, setTicketFilters] = useState<TicketFilterState>({})

  const {
    tickets,
    isLoading: isLoadingTickets,
    fetchTicketsByQueue,
    callNextTicket,
    recallLastTicket,
    currentTicket,
  } = useTickets()

  const loadQueues = async () => {
    setIsLoading(true)
    try {
      const response = await QueueService.getAll()
      handleResult(response, data => {
        // Filtrar apenas as filas do departamento atual
        if (data) {
          const departmentQueues = data.filter(
            (q: Queue) => q.departmentId === departamento.id
          )
          setQueues(departmentQueues)

          // Se havia uma fila selecionada e ela ainda existe, manter seleção
          if (selectedQueue) {
            const stillExists = departmentQueues.find(
              q => q.id === selectedQueue.id
            )
            if (stillExists) {
              setSelectedQueue(stillExists)
            } else {
              setSelectedQueue(null)
            }
          }

          // Se não há fila selecionada e existe pelo menos uma, selecionar a primeira
          if (!selectedQueue && departmentQueues.length > 0) {
            setSelectedQueue(departmentQueues[0])
          }
        }
      })
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao carregar filas',
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const loadTickets = async (queueId: number) => {
    try {
      await fetchTicketsByQueue(queueId)
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao carregar tickets',
        }
      )
    }
  }

  useEffect(() => {
    if (departamento?.id) {
      loadQueues()
    }
  }, [departamento])

  // Carregar tickets quando uma fila for selecionada
  useEffect(() => {
    if (selectedQueue?.id) {
      loadTickets(selectedQueue.id)
    }
  }, [selectedQueue, fetchTicketsByQueue])

  // Filtrar tickets com base nos filtros aplicados
  const filteredTickets = useMemo(() => {
    let result = tickets.filter(t => t.queueId === selectedQueue?.id)

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
  }, [tickets, selectedQueue?.id, ticketFilters])

  const handleAddQueue = () => {
    setQueueToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditQueue = (queue: Queue) => {
    setQueueToEdit(queue)
    setIsModalOpen(true)
  }

  const handleDeleteQueue = (queue: Queue) => {
    setQueueToDelete(queue)
    setIsDeleteModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setQueueToEdit(null)
    loadQueues() // Recarregar após fechar modal
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setQueueToDelete(null)
    loadQueues() // Recarregar após fechar modal
  }

  // Handlers para tickets
  const handleNewTicket = () => {
    if (!selectedQueue) return
    setIsTicketModalOpen(true)
  }

  const handleCallNext = async () => {
    if (!selectedQueue) return

    try {
      await callNextTicket(selectedQueue.id)
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
    if (!selectedQueue) return

    try {
      await recallLastTicket(selectedQueue.id)
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

  const handleRefreshTickets = () => {
    if (selectedQueue) {
      loadTickets(selectedQueue.id)
    }
  }

  const handleTicketDelete = (ticket: TicketType) => {
    setTicketToDelete(ticket)
    setIsDeleteTicketModalOpen(true)
  }

  return (
    <div>
      <div className='mb-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nome
              </label>
              <p className='text-gray-900'>{departamento.name}</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Código
              </label>
              <p className='text-gray-900'>{departamento.code}</p>
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descrição
              </label>
              <p className='text-gray-900'>
                {departamento.description || 'Sem descrição'}
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Capacidade
              </label>
              <p className='text-gray-900'>{departamento.capacity} filas</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Data de Criação
              </label>
              <p className='text-gray-900'>
                {new Date(departamento.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Filas */}
        <div className='mt-6'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                Filas do Departamento
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                {queues.length}{' '}
                {queues.length === 1 ? 'fila cadastrada' : 'filas cadastradas'}
              </p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={loadQueues}
                disabled={isLoading}
                className='flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? 'animate-spin' : ''}
                />
                Atualizar
              </button>
              <button
                onClick={handleAddQueue}
                className='flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Plus size={16} />
                Nova Fila
              </button>
            </div>
          </div>

          {isLoading && queues.length === 0 ? (
            <div className='flex justify-center items-center h-48 bg-white rounded-lg border border-gray-200'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3'></div>
                <p className='text-gray-600 text-sm'>Carregando filas...</p>
              </div>
            </div>
          ) : queues.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
              <div className='max-w-md mx-auto'>
                <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <svg
                    className='w-6 h-6 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Nenhuma fila cadastrada
                </h3>
                <p className='text-gray-600 text-sm mb-4'>
                  Crie a primeira fila para este departamento e comece a
                  gerenciar os atendimentos.
                </p>
                <button
                  onClick={handleAddQueue}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Criar Primeira Fila
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de filas com seleção */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                {queues.map(queue => (
                  <div key={queue.id} className='relative'>
                    <QueueCard
                      queue={queue}
                      onEdit={handleEditQueue}
                      onDelete={handleDeleteQueue}
                      onEmitTicket={q => {
                        setSelectedQueue(q)
                        handleNewTicket()
                      }}
                    />
                    <button
                      onClick={() => setSelectedQueue(queue)}
                      className={`absolute top-2 right-2 px-2 py-1 text-xs rounded transition-colors ${
                        selectedQueue?.id === queue.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedQueue?.id === queue.id
                        ? 'Selecionada'
                        : 'Selecionar'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Seção de gerenciamento de tickets */}
              {selectedQueue && (
                <div className='border-t border-gray-200 pt-6'>
                  <TicketsHeader
                    queue={selectedQueue}
                    tickets={filteredTickets}
                    onNewTicket={handleNewTicket}
                    onRefresh={handleRefreshTickets}
                    onCallNext={handleCallNext}
                    onRecallLast={handleRecallLast}
                    isLoading={isLoadingTickets}
                  />

                  <TicketDashboard
                    queueId={selectedQueue.id}
                    className='mb-6'
                  />

                  <TicketFilters
                    onFilterChange={setTicketFilters}
                    className='mb-6'
                  />

                  {/* Lista de tickets */}
                  {isLoadingTickets && filteredTickets.length === 0 ? (
                    <div className='flex justify-center items-center h-48 bg-white rounded-lg border border-gray-200'>
                      <div className='text-center'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3'></div>
                        <p className='text-gray-600 text-sm'>
                          Carregando tickets...
                        </p>
                      </div>
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
                      <div className='max-w-md mx-auto'>
                        <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                          <Ticket className='w-6 h-6 text-gray-400' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          Nenhum ticket encontrado
                        </h3>
                        <p className='text-gray-600 text-sm mb-4'>
                          Não há tickets para esta fila ou que correspondam aos
                          filtros aplicados.
                        </p>
                        <button
                          onClick={handleNewTicket}
                          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                          Gerar Primeiro Ticket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <NovaFilaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        departments={[departamento]}
        departmentId={departamento.id}
        queueToEdit={queueToEdit}
      />

      <DeleteQueueModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        queue={queueToDelete}
      />

      {selectedQueue && (
        <NovoTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          queue={selectedQueue}
        />
      )}

      <DeleteTicketModal
        isOpen={isDeleteTicketModalOpen}
        onClose={() => setIsDeleteTicketModalOpen(false)}
        ticket={ticketToDelete}
      />
    </div>
  )
}

interface TicketInfoProps {
  departamento: Departamento
}
