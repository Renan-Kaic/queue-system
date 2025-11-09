import { Departamento } from '@/types/departmento'
import { DepartmentActions } from './DepartmentActions'
import { DepartmentStatusBadge } from './DepartmentStatusBadge'

interface Department {
  id: number
  code: string
  name: string
  description?: string
  capacity: number
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt?: string
}

interface DepartmentTableRowProps {
  department: Departamento
}

export function DepartmentTableRow({ department }: DepartmentTableRowProps) {
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
    <tr className={department.id % 2 === 0 ? '' : 'bg-base-200'}>
      <th>{department.id}</th>
      <td>{department.code}</td>
      <td>{department.name}</td>
      <td>{department.description || '-'}</td>
      <td>{department.capacity}</td>
      <td>
        <DepartmentStatusBadge status={department.status} />
      </td>
      <td>{formatDate(department.createdAt)}</td>
      <td>{department.updatedAt ? formatDate(department.updatedAt) : '-'}</td>
      <td>
        <DepartmentActions department={department} />
      </td>
    </tr>
  )
}
