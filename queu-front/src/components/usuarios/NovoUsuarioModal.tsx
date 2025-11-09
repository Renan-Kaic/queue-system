'use client'
import { useResultHandler } from '@/handlers/resultHandler'
import { CitizenService } from '@/services/citizenService'
import Usuario, { CitizenType } from '@/types/usuarios'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

const getEmptyForm = () => ({
  name: '',
  document: '',
  email: '',
  phone: '',
  type: CitizenType.Normal,
})

export default function NovoUsuarioModal() {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [formData, setFormData] = useState(getEmptyForm)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const { handleResult } = useResultHandler()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const typeOptions = useMemo(
    () => [
      { value: CitizenType.Normal, label: 'Normal' },
      { value: CitizenType.Priority, label: 'Prioritário' },
      { value: CitizenType.Vip, label: 'VIP' },
    ],
    []
  )

  const openPopover = () => {
    const popover = modalRef.current as
      | (HTMLDivElement & {
          showPopover?: () => void
        })
      | null
    popover?.showPopover?.()
  }

  const resetForm = () => {
    setFormData(getEmptyForm())
    setEditingUser(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = editingUser
        ? await CitizenService.update(editingUser.id, formData)
        : await CitizenService.create(formData)
      resetForm()
      handleResult(response)
      handleCancel()

      window.dispatchEvent(new CustomEvent('citizen:refresh'))
    } catch (error: any) {
      handleResult(
        error.response?.data || {
          success: false,
          message: 'Erro ao processar solicitação',
          errors: [error.message || 'Erro desconhecido'],
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? Number(value) : value,
    }))
  }

  const handleCancel = () => {
    const popover = modalRef.current as
      | (HTMLDivElement & {
          hidePopover?: () => void
        })
      | null
    popover?.hidePopover?.()
    resetForm()
  }

  useEffect(() => {
    const handleEditEvent = (event: Event) => {
      const { detail } = event as CustomEvent<Usuario>
      if (!detail) return

      setEditingUser(detail)
      setFormData({
        name: detail.name ?? '',
        document: detail.document ?? '',
        email: detail.email ?? '',
        phone: detail.phone ?? '',
        type: detail.type ?? CitizenType.Normal,
      })
      openPopover()
    }

    const handleCreateEvent = () => {
      resetForm()
      openPopover()
    }

    window.addEventListener('citizen:edit', handleEditEvent as EventListener)
    window.addEventListener('citizen:create', handleCreateEvent)

    return () => {
      window.removeEventListener(
        'citizen:edit',
        handleEditEvent as EventListener
      )
      window.removeEventListener('citizen:create', handleCreateEvent)
    }
  }, [])

  return (
    <div
      className='dropdown menu w-130 h-fit rounded-box bg-base-100 shadow-sm z-0!'
      popover='auto'
      id='popover-user-1'
      style={{ '--position-anchor': '--anchor-user-1' } as React.CSSProperties}
      ref={modalRef}
    >
      <form className='p-4' onSubmit={handleSubmit}>
        <span className='label w-full flex justify-center'>
          {editingUser
            ? 'Editar Usuário'
            : 'Novo Usuário - Formulário de Criação'}
        </span>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <label className='label w-full flex flex-col items-start md:col-span-2'>
            Nome *
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='input w-full outline-none'
              required
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            Documento
            <input
              type='text'
              name='document'
              value={formData.document}
              onChange={handleChange}
              className='input w-full outline-none'
              placeholder='CPF, RG, etc.'
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            Telefone
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className='input w-full outline-none'
              placeholder='(11) 99999-9999'
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            E-mail
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='input w-full outline-none'
              placeholder='usuario@exemplo.com'
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            Tipo de Usuário
            <select
              name='type'
              value={formData.type}
              onChange={handleChange}
              className='select w-full outline-none'
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            type='button'
            className='btn btn-ghost btn-sm'
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type='submit'
            className={`btn btn-primary btn-sm ${
              isSubmitting ? 'loading loading-spinner' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Salvando...'
              : editingUser
              ? 'Atualizar'
              : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
