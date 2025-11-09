'use client'

import { useEffect, useState } from 'react'
import { useDepartamentoStore } from '@/store/departamentoStore'
import { Departamento, DepartamentoStatus } from '@/types/departmento'
import { Search, Building2, Users, Clock, AlertCircle, X } from 'lucide-react'

interface DepartmentSelectorProps {
  onSelectDepartment?: (department: Departamento | null) => void
  selectedDepartmentId?: number
}

export default function DepartmentSelector({
  onSelectDepartment,
  selectedDepartmentId,
}: DepartmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<DepartamentoStatus | 'all'>(
    'all'
  )

  const {
    departamentos,
    isLoading,
    error,
    fetchDepartamentos,
    getDepartamentosAtivos,
    getDepartamentosByStatus,
  } = useDepartamentoStore()

  useEffect(() => {
    fetchDepartamentos()
  }, [fetchDepartamentos])

  // Filtrar departamentos baseado na busca e status
  const filteredDepartments = departamentos.filter(dept => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)

    const matchesStatus = filterStatus === 'all' || dept.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: DepartamentoStatus) => {
    switch (status) {
      case DepartamentoStatus.Active:
        return 'bg-green-100 text-green-800 border-green-200'
      case DepartamentoStatus.Inactive:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case DepartamentoStatus.Suspended:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case DepartamentoStatus.Deleted:
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: DepartamentoStatus) => {
    switch (status) {
      case DepartamentoStatus.Active:
        return 'Ativo'
      case DepartamentoStatus.Inactive:
        return 'Inativo'
      case DepartamentoStatus.Suspended:
        return 'Suspenso'
      case DepartamentoStatus.Deleted:
        return 'Excluído'
      default:
        return 'Desconhecido'
    }
  }

  const handleDepartmentClick = (department: Departamento) => {
    if (department.status === DepartamentoStatus.Active && onSelectDepartment) {
      if (selectedDepartmentId === department.id) {
        onSelectDepartment(null)
      } else {
        onSelectDepartment(department) 
      }
    }
  }

  return (
    <div className='h-[94vh] w-[25vw] border-r border-gray-300 bg-white flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between mb-2'>
          <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
            <Building2 size={20} />
            Departamentos
          </h2>

          {selectedDepartmentId && (
            <button
              onClick={() => onSelectDepartment?.(null)}
              className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors'
              title='Limpar seleção'
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className='text-xs text-gray-600 mb-3'>
          {selectedDepartmentId
            ? 'Clique em outro departamento para trocar ou no X para desselecionar'
            : 'Clique em um departamento para selecioná-lo'}
        </p>

        {/* Busca */}
        <div className='relative mb-3'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            size={16}
          />
          <input
            type='text'
            placeholder='Buscar departamentos...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>

        {/* Filtro de Status */}
        <select
          value={filterStatus}
          onChange={e =>
            setFilterStatus(
              e.target.value === 'all'
                ? 'all'
                : (parseInt(e.target.value) as DepartamentoStatus)
            )
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
        >
          <option value='all'>Todos os Status</option>
          <option value={DepartamentoStatus.Active}>Ativos</option>
          <option value={DepartamentoStatus.Inactive}>Inativos</option>
          <option value={DepartamentoStatus.Suspended}>Suspensos</option>
          <option value={DepartamentoStatus.Deleted}>Excluídos</option>
        </select>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='flex items-center justify-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        ) : error ? (
          <div className='p-4 m-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
            <AlertCircle className='text-red-500 mt-0.5' size={16} />
            <div>
              <p className='text-red-800 text-sm font-medium'>
                Erro ao carregar departamentos
              </p>
              <p className='text-red-600 text-xs mt-1'>{error}</p>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>
            <Building2 className='mx-auto mb-3 text-gray-300' size={48} />
            <p className='text-sm'>
              {searchTerm || filterStatus !== 'all'
                ? 'Nenhum departamento encontrado com os filtros aplicados'
                : 'Nenhum departamento cadastrado'}
            </p>
          </div>
        ) : (
          <div className='p-2 space-y-2'>
            {filteredDepartments.map(department => (
              <div
                key={department.id}
                onClick={() => handleDepartmentClick(department)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all duration-200
                  ${
                    selectedDepartmentId === department.id
                      ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm hover:border-gray-300'
                  }
                  ${
                    department.status !== DepartamentoStatus.Active
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex-1'>
                    <h3
                      className={`font-medium text-sm line-clamp-1 ${
                        selectedDepartmentId === department.id
                          ? 'text-primary'
                          : 'text-gray-900'
                      }`}
                    >
                      {selectedDepartmentId === department.id && '✓ '}
                      {department.name}
                    </h3>
                    <p className='text-xs text-gray-600 mt-1'>
                      Código: {department.code}
                    </p>
                  </div>
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full border text-center whitespace-nowrap
                    ${getStatusColor(department.status)}
                  `}
                  >
                    {getStatusText(department.status)}
                  </span>
                </div>

                {department.description && (
                  <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                    {department.description}
                  </p>
                )}

                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Users size={12} />
                    <span>Capacidade: {department.capacity}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock size={12} />
                    <span>
                      {new Date(department.createdAt).toLocaleDateString(
                        'pt-BR'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer com estatísticas */}
      <div className='p-3 border-t border-gray-200 bg-gray-50'>
        <div className='text-xs text-gray-600 space-y-1'>
          <div className='flex justify-between'>
            <span>Total:</span>
            <span className='font-medium'>{departamentos.length}</span>
          </div>
          <div className='flex justify-between'>
            <span>Ativos:</span>
            <span className='font-medium text-green-600'>
              {getDepartamentosAtivos().length}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Filtrados:</span>
            <span className='font-medium'>{filteredDepartments.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
