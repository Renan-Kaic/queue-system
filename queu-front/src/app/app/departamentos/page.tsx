'use client'
import { DepartmentTable } from '@/components/Departamentos/DepartmentTable'
import DepartamentoHeader from '@/components/Departamentos/Header'
import ConfirmDelete from '@/components/Departamentos/DeleteModal'
import { Departamento } from '@/types/departmento'
import { useResultHandler } from '@/handlers/resultHandler'
import { useEffect, useState } from 'react'
import { useDepartamentos } from '@/hooks/useStore'

export default function DepartamentosPage() {
  const [departmentToDelete, setDepartmentToDelete] = useState<Departamento | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { handleResult } = useResultHandler()

  const {
    departamentos,
    isLoading,
    error,
    fetchDepartamentos,
    deleteDepartamento,
    clearError
  } = useDepartamentos()

  const handleDeleteRequest = (department: Departamento) => {
    setDepartmentToDelete(department)
    const modal = document.getElementById('deleteModal') as HTMLDialogElement
    modal?.showModal()
  }

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return

    setIsDeleting(true)
    try {
      await deleteDepartamento(departmentToDelete.id)

      handleResult({
        success: true,
        message: 'Departamento excluído com sucesso!',
      })

      setDepartmentToDelete(null)
    } catch (error: any) {
      handleResult({
        success: false,
        message: 'Erro ao excluir departamento',
        errors: [error.message || 'Erro desconhecido'],
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      await fetchDepartamentos()
      handleResult({
        success: true,
        message: 'Dados atualizados com sucesso!',
      })
    } catch (error) {
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  useEffect(() => {
    if (departamentos.length === 0 && !isLoading) {
      fetchDepartamentos()
    }
  }, [departamentos.length, fetchDepartamentos, isLoading])

  useEffect(() => {
    const handleDeleteEvent = (event: Event) => {
      const { detail } = event as CustomEvent<Departamento>
      handleDeleteRequest(detail)
    }

    window.addEventListener('department:delete', handleDeleteEvent as EventListener)

    return () => {
      window.removeEventListener('department:delete', handleDeleteEvent as EventListener)
    }
  }, [])

  useEffect(() => {
    if (error) {
      handleResult({
        success: false,
        message: error,
        errors: [error],
      })
    }
  }, [error, handleResult])

  return (
    <div className='w-screen h-auto'>
      <DepartamentoHeader
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing || isLoading}
        departamentos={departamentos}
      />
      <DepartmentTable departments={departamentos} />
      <ConfirmDelete
        department={departmentToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
