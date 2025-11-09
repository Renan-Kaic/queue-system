import { TicketPriority } from '@/types/ticket'

interface TicketPriorityBadgeProps {
  priority: TicketPriority
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const priorityConfig: Record<
    TicketPriority,
    { label: string; className: string }
  > = {
    [TicketPriority.Normal]: {
      label: 'Normal',
      className: 'badge badge-neutral badge-sm',
    },
    [TicketPriority.Priority]: {
      label: 'Prioritário',
      className: 'badge badge-warning badge-sm',
    },
    [TicketPriority.Urgent]: {
      label: 'Urgente',
      className: 'badge badge-error badge-sm',
    },
    [TicketPriority.Late]: {
      label: 'Atrasado',
      className: 'badge badge-error badge-outline badge-sm',
    },
  }

  const config = priorityConfig[priority]

  return <span className={config.className}>{config.label}</span>
}
