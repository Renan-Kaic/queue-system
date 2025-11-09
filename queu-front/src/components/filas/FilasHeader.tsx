'use client'

import { Plus, RefreshCw } from 'lucide-react'

interface FilasHeaderProps {
  onAddQueue: () => void
  onRefresh: () => void
  isLoading: boolean
  totalQueues: number
}

export function FilasHeader({
  onAddQueue,
  onRefresh,
  isLoading,
  totalQueues,
}: FilasHeaderProps) {
  return (
    <div className='flex justify-between items-center mb-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Gerenciar Filas</h1>
        <p className='text-gray-600 mt-1'>
          {totalQueues}{' '}
          {totalQueues === 1 ? 'fila encontrada' : 'filas encontradas'}
        </p>
      </div>
      <div className='flex gap-3'>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          Atualizar
        </button>
        <button
          onClick={onAddQueue}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <Plus size={18} />
          Nova Fila
        </button>
      </div>
    </div>
  )
}
