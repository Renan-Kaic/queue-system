import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
  TicketPriority,
} from '@/types/ticket'
import { TicketService } from '@/services/ticketService'

interface TicketState {
  // Estado
  tickets: Ticket[]
  isLoading: boolean
  error: string | null
  currentTicket: Ticket | null

  // Actions
  fetchTickets: () => Promise<void>
  fetchTicketsByQueue: (queueId: number) => Promise<void>
  fetchTicketsByCitizen: (citizenId: number) => Promise<void>
  createTicket: (ticket: CreateTicketDto) => Promise<Ticket>
  updateTicket: (ticket: UpdateTicketDto) => Promise<void>
  deleteTicket: (id: number) => Promise<void>
  fetchTicketById: (id: number) => Promise<Ticket | null>
  callNextTicket: (queueId: number) => Promise<Ticket | null>
  recallLastTicket: (queueId: number) => Promise<Ticket | null>
  startService: (ticketId: number) => Promise<void>
  completeService: (ticketId: number) => Promise<void>
  cancelTicket: (ticketId: number) => Promise<void>
  markNoShow: (ticketId: number) => Promise<void>
  setCurrentTicket: (ticket: Ticket | null) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Seletores
  getTicketById: (id: number) => Ticket | undefined
  getTicketsByQueue: (queueId: number) => Ticket[]
  getTicketsByCitizen: (citizenId: number) => Ticket[]
  getTicketsByStatus: (status: TicketStatus) => Ticket[]
  getTicketsByPriority: (priority: TicketPriority) => Ticket[]
  getWaitingTicketsInQueue: (queueId: number) => Ticket[]
  getNextTicketInQueue: (queueId: number) => Ticket | null
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      tickets: [],
      isLoading: false,
      error: null,
      currentTicket: null,

      // Buscar todos os tickets
      fetchTickets: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.getAll()
          set({ tickets: response.data || [], isLoading: false })
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao buscar tickets',
            isLoading: false,
          })
        }
      },

      // Buscar tickets por fila
      fetchTicketsByQueue: async (queueId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.getByQueue(queueId)
          const queueTickets = response.data || []

          // Atualizar apenas os tickets dessa fila no estado
          set(state => ({
            tickets: [
              ...state.tickets.filter(t => t.queueId !== queueId),
              ...queueTickets,
            ],
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message ||
              'Erro ao buscar tickets da fila',
            isLoading: false,
          })
        }
      },

      // Buscar tickets por cidadão
      fetchTicketsByCitizen: async (citizenId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.getByCitizen(citizenId)
          const citizenTickets = response.data || []

          // Atualizar apenas os tickets desse cidadão no estado
          set(state => ({
            tickets: [
              ...state.tickets.filter(t => t.citizenId !== citizenId),
              ...citizenTickets,
            ],
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message ||
              'Erro ao buscar tickets do cidadão',
            isLoading: false,
          })
        }
      },

      // Criar ticket
      createTicket: async (ticket: CreateTicketDto) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.create(ticket)
          const novoTicket = response.data

          set(state => ({
            tickets: [...state.tickets, novoTicket],
            isLoading: false,
          }))

          return novoTicket
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao criar ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Atualizar ticket
      updateTicket: async (ticket: UpdateTicketDto) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.update(ticket)
          const ticketAtualizado = response.data

          set(state => ({
            tickets: state.tickets.map(t =>
              t.id === ticket.id ? { ...t, ...ticketAtualizado } : t
            ),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao atualizar ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Deletar ticket
      deleteTicket: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
          await TicketService.delete(id)

          set(state => ({
            tickets: state.tickets.filter(ticket => ticket.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao deletar ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Buscar ticket por ID
      fetchTicketById: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.getById(id)
          const ticket = response.data

          // Atualizar o ticket no store se já existir
          set(state => ({
            tickets: state.tickets.some(t => t.id === id)
              ? state.tickets.map(t => (t.id === id ? ticket : t))
              : [...state.tickets, ticket],
            isLoading: false,
          }))

          return ticket
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao buscar ticket',
            isLoading: false,
          })
          return null
        }
      },

      // Chamar próximo ticket
      callNextTicket: async (queueId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.getNextTicket({ queueId })
          const nextTicket = response.data

          if (nextTicket) {
            set(state => ({
              tickets: state.tickets.map(t =>
                t.id === nextTicket.id ? nextTicket : t
              ),
              currentTicket: nextTicket,
              isLoading: false,
            }))
          } else {
            set({ isLoading: false })
          }

          return nextTicket
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao chamar próximo ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Rechamar último ticket
      recallLastTicket: async (queueId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.recallLastTicket(queueId)
          const recalledTicket = response.data

          if (recalledTicket) {
            set(state => ({
              tickets: state.tickets.map(t =>
                t.id === recalledTicket.id ? recalledTicket : t
              ),
              currentTicket: recalledTicket,
              isLoading: false,
            }))
          } else {
            set({ isLoading: false })
          }

          return recalledTicket
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao rechamar último ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Iniciar atendimento
      startService: async (ticketId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.startService(ticketId)
          const ticketAtualizado = response.data

          set(state => ({
            tickets: state.tickets.map(t =>
              t.id === ticketId ? ticketAtualizado : t
            ),
            currentTicket: ticketAtualizado,
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao iniciar atendimento',
            isLoading: false,
          })
          throw error
        }
      },

      // Concluir atendimento
      completeService: async (ticketId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.completeService(ticketId)
          const ticketAtualizado = response.data

          set(state => ({
            tickets: state.tickets.map(t =>
              t.id === ticketId ? ticketAtualizado : t
            ),
            currentTicket: null, // Limpar ticket atual após concluir
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao concluir atendimento',
            isLoading: false,
          })
          throw error
        }
      },

      // Cancelar ticket
      cancelTicket: async (ticketId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.cancelTicket(ticketId)
          const ticketAtualizado = response.data

          set(state => ({
            tickets: state.tickets.map(t =>
              t.id === ticketId ? ticketAtualizado : t
            ),
            currentTicket:
              state.currentTicket?.id === ticketId ? null : state.currentTicket,
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao cancelar ticket',
            isLoading: false,
          })
          throw error
        }
      },

      // Marcar como não compareceu
      markNoShow: async (ticketId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await TicketService.markNoShow(ticketId)
          const ticketAtualizado = response.data

          set(state => ({
            tickets: state.tickets.map(t =>
              t.id === ticketId ? ticketAtualizado : t
            ),
            currentTicket:
              state.currentTicket?.id === ticketId ? null : state.currentTicket,
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao marcar não compareceu',
            isLoading: false,
          })
          throw error
        }
      },

      // Definir ticket atual
      setCurrentTicket: (ticket: Ticket | null) =>
        set({ currentTicket: ticket }),

      // Definir erro
      setError: (error: string | null) => set({ error }),

      // Limpar erro
      clearError: () => set({ error: null }),

      // Seletores
      getTicketById: (id: number) => {
        const { tickets } = get()
        return tickets.find(ticket => ticket.id === id)
      },

      getTicketsByQueue: (queueId: number) => {
        const { tickets } = get()
        return tickets.filter(ticket => ticket.queueId === queueId)
      },

      getTicketsByCitizen: (citizenId: number) => {
        const { tickets } = get()
        return tickets.filter(ticket => ticket.citizenId === citizenId)
      },

      getTicketsByStatus: (status: TicketStatus) => {
        const { tickets } = get()
        return tickets.filter(ticket => ticket.ticketStatus === status)
      },

      getTicketsByPriority: (priority: TicketPriority) => {
        const { tickets } = get()
        return tickets.filter(ticket => ticket.priority === priority)
      },

      getWaitingTicketsInQueue: (queueId: number) => {
        const { tickets } = get()
        return tickets
          .filter(
            ticket =>
              ticket.queueId === queueId &&
              ticket.ticketStatus === TicketStatus.Waiting
          )
          .sort((a, b) => {
            // Primeiro por prioridade (maior prioridade primeiro)
            if (a.priority !== b.priority) {
              return b.priority - a.priority
            }
            // Depois por data de criação (mais antigo primeiro)
            return (
              new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime()
            )
          })
      },

      getNextTicketInQueue: (queueId: number) => {
        const { getWaitingTicketsInQueue } = get()
        const waitingTickets = getWaitingTicketsInQueue(queueId)
        return waitingTickets.length > 0 ? waitingTickets[0] : null
      },
    }),
    {
      name: 'ticket-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        tickets: state.tickets,
        currentTicket: state.currentTicket,
        // Não persistir loading e error states
      }),
    }
  )
)
