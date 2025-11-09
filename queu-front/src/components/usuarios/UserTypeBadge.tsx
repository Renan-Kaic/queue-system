import { CitizenType } from '@/types/usuarios'

interface UserTypeBadgeProps {
  type: CitizenType
}

export function UserTypeBadge({ type }: UserTypeBadgeProps) {
  const typeConfig: Record<CitizenType, { label: string; className: string }> =
    {
      [CitizenType.Normal]: {
        label: 'Normal',
        className: 'badge badge-neutral',
      },
      [CitizenType.Priority]: {
        label: 'Prioridade',
        className: 'badge badge-warning',
      },
      [CitizenType.Vip]: {
        label: 'VIP',
        className: 'badge badge-success',
      },
    }

  const config = typeConfig[type]

  return <span className={config.className}>{config.label}</span>
}
