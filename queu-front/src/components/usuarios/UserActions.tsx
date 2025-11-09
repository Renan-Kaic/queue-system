'use client'

import { Pencil, Trash2 } from 'lucide-react'
import Usuario from '@/types/usuarios'

interface UserActionsProps {
  user: Usuario
}

export function UserActions({ user }: UserActionsProps) {
  const handleEdit = () => {
    window.dispatchEvent(
      new CustomEvent('citizen:edit', {
        detail: user,
      })
    )
  }

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent('citizen:delete', {
        detail: user,
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
