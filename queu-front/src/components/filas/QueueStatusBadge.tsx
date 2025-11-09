import { QueueStatus } from '@/types/queue'

interface QueueStatusBadgeProps {
  status: QueueStatus
}

export function QueueStatusBadge({ status }: QueueStatusBadgeProps) {
  const statusConfig = {
    [QueueStatus.Active]: {
      label: 'Ativo',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    [QueueStatus.Inactive]: {
      label: 'Inativo',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    [QueueStatus.Suspended]: {
      label: 'Suspenso',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    [QueueStatus.Deleted]: {
      label: 'Excluído',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  )
}
