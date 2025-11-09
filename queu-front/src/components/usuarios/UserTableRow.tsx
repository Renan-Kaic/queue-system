import Usuario from '@/types/usuarios'
import { UserTypeBadge } from './UserTypeBadge'
import { UserActions } from './UserActions'

interface UserTableRowProps {
  user: Usuario
}

export function UserTableRow({ user }: UserTableRowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <tr className={user.id % 2 === 0 ? '' : 'bg-base-200'}>
      <th>{user.id}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.document}</td>
      <td>{user.phone}</td>
      <td>
        <UserTypeBadge type={user.type} />
      </td>
      <td>{formatDate(user.createdAt)}</td>
      <td>{user.updatedAt ? formatDate(user.updatedAt) : '-'}</td>
      <td>
        <UserActions user={user} />
      </td>
    </tr>
  )
}
