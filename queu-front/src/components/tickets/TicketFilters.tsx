'use client'
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { TicketStatus, TicketPriority } from '@/types/ticket'

interface TicketFiltersProps {
  onFilterChange: (filters: TicketFilterState) => void
  className?: string
}

export interface TicketFilterState {
  status?: TicketStatus
  priority?: TicketPriority
  search?: string
}

export function TicketFilters({
  onFilterChange,
  className = '',
}: TicketFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<TicketFilterState>({})

  const statusOptions = [
    { value: TicketStatus.Waiting, label: 'Aguardando' },
    { value: TicketStatus.Called, label: 'Chamado' },
    { value: TicketStatus.InService, label: 'Em Atendimento' },
    { value: TicketStatus.Completed, label: 'Concluído' },
    { value: TicketStatus.Cancelled, label: 'Cancelado' },
    { value: TicketStatus.NoShow, label: 'Não Compareceu' },
  ]

  const priorityOptions = [
    { value: TicketPriority.Normal, label: 'Normal' },
    { value: TicketPriority.Priority, label: 'Prioritário' },
    { value: TicketPriority.Urgent, label: 'Urgente' },
    { value: TicketPriority.Late, label: 'Atrasado' },
  ]

  const handleFilterChange = (key: keyof TicketFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: TicketFilterState = {}
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== ''
  )

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className='p-4 border-b border-gray-200'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center justify-between w-full'
        >
          <div className='flex items-center gap-2'>
            <Filter className='w-4 h-4 text-gray-600' />
            <span className='font-medium text-gray-900'>Filtros</span>
            {hasActiveFilters && (
              <span className='bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full'>
                {
                  Object.values(filters).filter(
                    v => v !== undefined && v !== ''
                  ).length
                }
              </span>
            )}
          </div>
          <div
            className={`transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Busca */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Buscar
              </label>
              <input
                type='text'
                value={filters.search || ''}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder='Código do ticket ou nome do cidadão'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm'
              />
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={e =>
                  handleFilterChange(
                    'status',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm'
              >
                <option value=''>Todos os status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Prioridade
              </label>
              <select
                value={filters.priority || ''}
                onChange={e =>
                  handleFilterChange(
                    'priority',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm'
              >
                <option value=''>Todas as prioridades</option>
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className='flex justify-end pt-2'>
              <button
                onClick={clearFilters}
                className='flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors'
              >
                <X className='w-3 h-3' />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
