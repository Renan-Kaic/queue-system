// Stores principais
export { useDepartamentoStore } from './departamentoStore'
export { useUsuarioStore } from './usuarioStore'
export { useAppStore, useAppStats } from './appStore'
export { useQueueStore } from './queueStore'
export { useTicketStore } from './ticketStore'

// Types
export type { Departamento, DepartamentoStatus } from '@/types/departmento'

export type { CitizenType } from '@/types/usuarios'

export type { default as Usuario } from '@/types/usuarios'

export type {
  Queue,
  QueueStatus,
  CreateQueueDto,
  UpdateQueueDto,
} from '@/types/queue'

export type {
  Ticket,
  TicketStatus,
  TicketPriority,
  CreateTicketDto,
  UpdateTicketDto,
  NextTicketDto,
  ApiResponse,
} from '@/types/ticket'
