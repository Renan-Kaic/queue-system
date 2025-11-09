'use client'

import { Queue } from '@/types/queue'
import { Edit2, Trash2 } from 'lucide-react'

interface QueueActionsProps {
  queue: Queue
  onEdit: (queue: Queue) => void
  onDelete: (queue: Queue) => void
}

export function QueueActions({ queue, onEdit, onDelete }: QueueActionsProps) {
  return (
    <div className='flex gap-2'>
      <button
        onClick={() => onEdit(queue)}
        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
        title='Editar fila'
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={() => onDelete(queue)}
        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
        title='Excluir fila'
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}
