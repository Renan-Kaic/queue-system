'use client'

import { Departamento } from '@/types/departmento'

interface ConfirmDeleteProps {
  department: Departamento | null
  onConfirm: () => void
  isLoading?: boolean
}

export default function ConfirmDelete({
  department,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteProps) {
  const handleConfirm = () => {
    onConfirm()
    // Fecha o modal após confirmar
    const modal = document.getElementById('deleteModal') as HTMLDialogElement
    modal?.close()
  }

  return (
    <dialog id='deleteModal' className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>
        </form>

        <h3 className='font-bold text-lg mb-4'>Excluir Departamento</h3>

        <p className='py-4'>
          {department ? (
            <>
              Tem certeza que deseja excluir o departamento{' '}
              <strong>"{department.name}"</strong>? Esta ação não pode ser
              desfeita.
            </>
          ) : (
            'Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.'
          )}
        </p>

        <div className='modal-action'>
          <form method='dialog'>
            <button className='btn btn-ghost mr-2' disabled={isLoading}>
              Cancelar
            </button>
          </form>
          <button
            className='btn btn-error'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <span className='loading loading-spinner loading-sm mr-2'></span>
            )}
            Excluir
          </button>
        </div>
      </div>
    </dialog>
  )
}
