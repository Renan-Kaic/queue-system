export interface Ticket {
  id: number
  ticketCode: string
  queueId: number
  citizenId: number
  ticketStatus: TicketStatus
  priority: TicketPriority
  issuedAt: string
  calledAt?: string
  startedAt?: string
  completedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt?: string
  // Relacionamentos opcionais para mostrar dados relacionados
  queue?: {
    id: number
    name: string
    code: string
  }
  citizen?: {
    id: number
    name: string
    document: string
  }
}

export enum TicketStatus {
  Waiting = 0, // Aguardando chamada
  Called = 1, // Chamado
  InService = 2, // Em atendimento
  Completed = 3, // Atendimento concluído
  Cancelled = 4, // Cancelado
  NoShow = 5, // Não compareceu
}

export enum TicketPriority {
  Normal = 0, // Prioridade normal
  Priority = 1, // Prioridade alta
  Urgent = 2, // Urgente
  Late = 3, // Atrasado
}

export interface CreateTicketDto {
  queueId: number
  citizenId: number
  priority: TicketPriority
}

export interface UpdateTicketDto {
  id: number
  ticketNumber: string
  ticketStatus: TicketStatus
  priority: TicketPriority
}

export interface NextTicketDto {
  queueId: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  errors?: string[]
  statusCode: number
  timestamp: string
}

export interface TicketListResponse {
  tickets: Ticket[]
  total: number
  page?: number
  limit?: number
}
