import Usuario from '@/types/usuarios'
import { UserTableHeader } from './UserTableHeader'
import { UserTableRow } from './UserTableRow'

interface UserTableProps {
  users: Usuario[]
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        <UserTableHeader />
        <tbody>
          {users.map(user => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
