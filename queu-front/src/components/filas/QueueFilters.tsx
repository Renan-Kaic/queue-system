'use client'

import { Search, Filter, X } from 'lucide-react'
import { QueueStatus } from '@/types/queue'
import { useState } from 'react'

interface QueueFiltersProps {
  onSearchChange: (search: string) => void
  onStatusFilter: (status: QueueStatus | 'all') => void
  onDepartmentFilter: (departmentId: number | 'all') => void
  departments: Array<{ id: number; name: string }>
  activeFiltersCount: number
  onClearFilters: () => void
}

export function QueueFilters({
  onSearchChange,
  onStatusFilter,
  onDepartmentFilter,
  departments,
  activeFiltersCount,
  onClearFilters,
}: QueueFiltersProps) {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<QueueStatus | 'all'>(
    'all'
  )
  const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>(
    'all'
  )
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const handleStatusChange = (value: string) => {
    const status = value === 'all' ? 'all' : (parseInt(value) as QueueStatus)
    setSelectedStatus(status)
    onStatusFilter(status)
  }

  const handleDepartmentChange = (value: string) => {
    const dept = value === 'all' ? 'all' : parseInt(value)
    setSelectedDepartment(dept)
    onDepartmentFilter(dept)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedStatus('all')
    setSelectedDepartment('all')
    onClearFilters()
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
      <div className='flex gap-3'>
        {/* Search */}
        <div className='flex-1 relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={18}
          />
          <input
            type='text'
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder='Buscar por nome ou código...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className='px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full'>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearFilters}
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <X size={18} />
            Limpar
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className='grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200'>
          {/* Status Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>Todos</option>
              <option value={QueueStatus.Active}>Ativo</option>
              <option value={QueueStatus.Inactive}>Inativo</option>
              <option value={QueueStatus.Suspended}>Suspenso</option>
              <option value={QueueStatus.Deleted}>Excluído</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Departamento
            </label>
            <select
              value={selectedDepartment}
              onChange={e => handleDepartmentChange(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>Todos</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
