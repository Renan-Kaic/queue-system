'use client'

import Usuario from '@/types/usuarios'

interface ConfirmDeleteUserProps {
  user: Usuario | null
  onConfirm: () => void
  isLoading: boolean
}

export default function ConfirmDeleteUser({
  user,
  onConfirm,
  isLoading,
}: ConfirmDeleteUserProps) {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      const modal = document.getElementById(
        'deleteUserModal'
      ) as HTMLDialogElement
      modal?.close()
    }
  }

  return (
    <dialog id='deleteUserModal' className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg text-gray-900 mb-4'>
          Confirmar Exclusão
        </h3>

        <div className='py-4'>
          <p className='text-gray-700 mb-2'>
            Tem certeza que deseja excluir este usuário?
          </p>
          {user && (
            <div className='bg-gray-50 p-3 rounded-lg mt-3'>
              <p className='font-medium text-gray-900'>{user.name}</p>
              {user.email && (
                <p className='text-sm text-gray-600'>{user.email}</p>
              )}
              {user.document && (
                <p className='text-sm text-gray-600'>Doc: {user.document}</p>
              )}
            </div>
          )}
          <p className='text-red-600 text-sm mt-3 font-medium'>
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className='modal-action'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='btn btn-ghost'
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={isLoading}
            className={`btn btn-error ${
              isLoading ? 'loading loading-spinner' : ''
            }`}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop' onClick={handleClose}>
        <button type='button' disabled={isLoading}>
          close
        </button>
      </form>
    </dialog>
  )
}
