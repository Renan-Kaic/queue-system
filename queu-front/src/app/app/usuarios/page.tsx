'use client'
import UsuariosHeader from '@/components/usuarios/usersHeader'
import { UserTable } from '@/components/usuarios/UserTable'
import NovoUsuarioModal from '@/components/usuarios/NovoUsuarioModal'
import ConfirmDeleteUser from '@/components/usuarios/DeleteUserModal'
import { useResultHandler } from '@/handlers/resultHandler'
import { useEffect, useState } from 'react'
import Usuario from '@/types/usuarios'
import { useUsuarios } from '@/hooks/useStore'

export default function UsuariosPage() {
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { handleResult } = useResultHandler()

  const {
    usuarios,
    isLoading,
    error,
    fetchUsuarios,
    deleteUsuario,
    clearError
  } = useUsuarios()

  const handleDeleteRequest = (user: Usuario) => {
    setUserToDelete(user)
    const modal = document.getElementById('deleteUserModal') as HTMLDialogElement
    modal?.showModal()
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      await deleteUsuario(userToDelete.id)

      handleResult({
        success: true,
        message: 'Usuário excluído com sucesso!',
      })

      setUserToDelete(null)

      const modal = document.getElementById('deleteUserModal') as HTMLDialogElement
      modal?.close()
    } catch (error: any) {
      handleResult({
        success: false,
        message: 'Erro ao excluir usuário',
        errors: [error.message || 'Erro desconhecido'],
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      await fetchUsuarios()
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
    if (usuarios.length === 0 && !isLoading) {
      fetchUsuarios()
    }
  }, [usuarios.length, fetchUsuarios, isLoading])

  useEffect(() => {
    const handleDeleteEvent = (event: Event) => {
      const { detail } = event as CustomEvent<Usuario>
      handleDeleteRequest(detail)
    }

    const handleRefreshEvent = () => {
      fetchUsuarios()
    }

    window.addEventListener('citizen:delete', handleDeleteEvent as EventListener)
    window.addEventListener('citizen:refresh', handleRefreshEvent)

    return () => {
      window.removeEventListener('citizen:delete', handleDeleteEvent as EventListener)
      window.removeEventListener('citizen:refresh', handleRefreshEvent)
    }
  }, [fetchUsuarios])

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
      <UsuariosHeader
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing || isLoading}
        users={usuarios}
      />
      <UserTable users={usuarios} />
      <NovoUsuarioModal />
      <ConfirmDeleteUser
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
