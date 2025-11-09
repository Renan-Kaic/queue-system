'use client'

import { Plus, ArrowLeft, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import NovoDepartamentoModal from './NovoDepartamentoModal'
import { Departamento, DepartamentoStatus } from '@/types/departmento'

interface DepartamentoHeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
  departamentos: Departamento[]
}

export default function DepartamentoHeader({
  onRefresh,
  isRefreshing = false,
  departamentos
}: DepartamentoHeaderProps) {
  const router = useRouter()
  const handleNewDepartment = () => {
    window.dispatchEvent(new CustomEvent('department:create'))
  }

  const handleGoHome = () => {
    router.push('/app')
  }

  const handleRefresh = () => {
    if (onRefresh && !isRefreshing) {
      onRefresh()
    }
  }

  return (
    <div className='w-screen border-b border-gray-200 bg-white'>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-4 flex-1'>
            <button
              onClick={handleGoHome}
              className='inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200'
              title='Voltar para Home'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Home</span>
            </button>

            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Gerenciamento de Departamentos
              </h1>
              <p className='text-base text-gray-600'>
                Gerencie os departamentos da sua organização, configure
                capacidades e monitore o status de cada setor.
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className='inline-flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              title='Atualizar dados'
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span className='hidden sm:inline'>Atualizar</span>
            </button>

            <button
              onClick={handleNewDepartment}
              className='inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-colors duration-200 shadow-sm hover:shadow-md'
            >
              <Plus className='w-5 h-5' />
              Novo Departamento
            </button>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='bg-base-200 rounded-lg p-4'>
            <p className='text-sm text-gray-600 mb-1'>Total de Departamentos</p>
            <p className='text-2xl font-bold text-gray-900'>{departamentos.length}</p>
          </div>
          <div className='bg-base-200 rounded-lg p-4'>
            <p className='text-sm text-gray-600 mb-1'>Ativos</p>
            <p className='text-2xl font-bold text-success'>{departamentos.filter(dept => dept.status === DepartamentoStatus.Active).length}</p>
          </div>
          <div className='bg-base-200 rounded-lg p-4'>
            <p className='text-sm text-gray-600 mb-1'>Inativos</p>
            <p className='text-2xl font-bold text-warning'>{departamentos.filter(dept => dept.status === DepartamentoStatus.Inactive).length}</p>
          </div>
        </div>
      </div>
      <NovoDepartamentoModal />
    </div>
  )
}
