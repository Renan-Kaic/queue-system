'use client'

import { useState } from 'react'
import DepartmentSelector from '@/components/home/DepartmentSelector'
import { Departamento } from '@/types/departmento'
import TicketInfo from '@/components/home/TicketInfo'

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Departamento | null>(null)

  const handleSelectDepartment = (department: Departamento | null) => {
    setSelectedDepartment(department)
  }

  return (
    <div className='flex flex-row h-auto w-screen'>
      <DepartmentSelector
        onSelectDepartment={handleSelectDepartment}
        selectedDepartmentId={selectedDepartment?.id}
      />

      <div className='flex-1 p-6 bg-gray-50'>
        {selectedDepartment ? (
          <TicketInfo departamento={selectedDepartment} />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <div className='max-w-md'>
              <div className='mb-4'>
                <svg
                  className='mx-auto h-24 w-24 text-gray-300'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>

              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Selecione um Departamento
              </h2>

              <p className='text-gray-600 mb-4'>
                Escolha um departamento da lista ao lado para visualizar os
                detalhes e começar a gerenciar as filas de atendimento.
              </p>

              <div className='text-sm text-gray-500'>
                💡 <strong>Dica:</strong> Use a busca para encontrar
                departamentos específicos ou filtre por status para ver apenas
                os ativos.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
