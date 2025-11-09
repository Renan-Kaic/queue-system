'use client'
import React, { ReactNode } from 'react'
import { useAppInitialization } from '@/hooks/useStore'

interface StoreProviderProps {
  children: ReactNode
}

// Componente para inicializar a aplicação
export function StoreProvider({ children }: StoreProviderProps) {
  const { isInitialized, isLoading, error } = useAppInitialization()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Carregando aplicação...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md'>
          <div className='flex items-center'>
            <div className='py-1'>
              <svg
                className='fill-current h-6 w-6 text-red-500 mr-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z' />
              </svg>
            </div>
            <div>
              <p className='font-bold'>Erro ao inicializar aplicação</p>
              <p className='text-sm'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook para forçar re-sincronização
export function useForcedSync() {
  const { syncAllData } = require('@/store/appStore').useAppStore()

  const forceSync = async () => {
    try {
      await syncAllData()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao sincronizar dados',
      }
    }
  }

  return { forceSync }
}
