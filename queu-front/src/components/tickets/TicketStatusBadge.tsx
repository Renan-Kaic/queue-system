import { TicketStatus } from '@/types/ticket'

interface TicketStatusBadgeProps {
  status: TicketStatus
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusConfig: Record<
    TicketStatus,
    { label: string; className: string }
  > = {
    [TicketStatus.Waiting]: {
      label: 'Aguardando',
      className: 'badge badge-warning badge-sm',
    },
    [TicketStatus.Called]: {
      label: 'Chamado',
      className: 'badge badge-info badge-sm',
    },
    [TicketStatus.InService]: {
      label: 'Em Atendimento',
      className: 'badge badge-primary badge-sm',
    },
    [TicketStatus.Completed]: {
      label: 'Concluído',
      className: 'badge badge-success badge-sm',
    },
    [TicketStatus.Cancelled]: {
      label: 'Cancelado',
      className: 'badge badge-error badge-sm',
    },
    [TicketStatus.NoShow]: {
      label: 'Não Compareceu',
      className: 'badge badge-error badge-outline badge-sm',
    },
  }

  const config = statusConfig[status]

  return <span className={config.className}>{config.label}</span>
}
