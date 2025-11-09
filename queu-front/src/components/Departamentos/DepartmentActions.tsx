'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Departamento } from '@/types/departmento'

interface DepartmentActionsProps {
  department: Departamento
}

export function DepartmentActions({ department }: DepartmentActionsProps) {
  const handleEdit = () => {
    window.dispatchEvent(
      new CustomEvent('department:edit', {
        detail: department,
      })
    )
  }

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent('department:delete', {
        detail: department,
      })
    )
  }

  return (
    <div className='flex gap-2'>
      <button
        className='flex justify-center items-center btn btn-sm btn-ghost'
        onClick={handleEdit}
      >
        <Pencil className='w-4 h-4 mr-2' />
      </button>
      <button
        className='flex justify-center items-center btn btn-sm btn-ghost '
        onClick={handleDelete}
      >
        <Trash2 className='w-4 h-4 mr-2 text-red-500' />
      </button>
    </div>
  )
}
