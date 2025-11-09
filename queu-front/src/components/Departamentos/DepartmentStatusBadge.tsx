import { DepartamentoStatus } from '@/types/departmento'

interface DepartmentStatusBadgeProps {
  status: DepartamentoStatus
}

export function DepartmentStatusBadge({ status }: DepartmentStatusBadgeProps) {
  const statusConfig: Record<
    DepartamentoStatus,
    { label: string; className: string }
  > = {
    [DepartamentoStatus.Active]: {
      label: 'Ativo',
      className: 'badge badge-success',
    },
    [DepartamentoStatus.Inactive]: {
      label: 'Inativo',
      className: 'badge badge-warning',
    },
    [DepartamentoStatus.Suspended]: {
      label: 'Suspenso',
      className: 'badge badge-error',
    },
    [DepartamentoStatus.Deleted]: {
      label: 'Excluído',
      className: 'badge badge-ghost',
    },
  }

  const config = statusConfig[status]

  return <span className={config.className}>{config.label}</span>
}
