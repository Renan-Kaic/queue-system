'use client'
import { useResultHandler } from '@/handlers/resultHandler'
import { DepartmentService } from '@/services/departmentService'
import { Departamento, DepartamentoStatus } from '@/types/departmento'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Toaster } from 'sonner'

const generateDepartmentCode = (name: string) => {
  const trimmedName = name.trim().toUpperCase()
  if (!trimmedName) return ''

  const initials = trimmedName
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')

  const sanitized = trimmedName.replace(/[^A-Z0-9]/g, '')

  let code = (initials + sanitized).slice(0, 5)

  if (code.length < 2) {
    code = (code + 'DEP').slice(0, 2)
  }

  return code
}

const getEmptyForm = () => ({
  code: '',
  name: '',
  description: '',
  capacity: 0,
  status: DepartamentoStatus.Active,
})

export default function NovoDepartamentoModal() {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [formData, setFormData] = useState(getEmptyForm)
  const [editingDepartment, setEditingDepartment] =
    useState<Departamento | null>(null)
  const { handleResult } = useResultHandler()
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const statusOptions = useMemo(
    () => [
      { value: DepartamentoStatus.Active, label: 'Ativo' },
      { value: DepartamentoStatus.Inactive, label: 'Inativo' },
      { value: DepartamentoStatus.Suspended, label: 'Suspenso' },
      { value: DepartamentoStatus.Deleted, label: 'Excluído' },
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
    setCodeManuallyEdited(false)
    setEditingDepartment(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = editingDepartment
        ? await DepartmentService.update(editingDepartment.id, formData)
        : await DepartmentService.create(formData)
      resetForm()
      handleResult(response)
      handleCancel()
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
    if (name === 'code') {
      setCodeManuallyEdited(true)
      setFormData(prev => ({
        ...prev,
        code: value,
      }))
      return
    }

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        code: codeManuallyEdited ? prev.code : generateDepartmentCode(value),
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'status' ? Number(value) : value,
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
      const { detail } = event as CustomEvent<Departamento>
      if (!detail) return

      setEditingDepartment(detail)
      setFormData({
        code: detail.code ?? '',
        name: detail.name ?? '',
        description: detail.description ?? '',
        capacity: detail.capacity ?? 0,
        status: detail.status ?? DepartamentoStatus.Active,
      })
      setCodeManuallyEdited(true)
      openPopover()
    }

    const handleCreateEvent = () => {
      resetForm()
      openPopover()
    }

    window.addEventListener('department:edit', handleEditEvent as EventListener)
    window.addEventListener('department:create', handleCreateEvent)

    return () => {
      window.removeEventListener(
        'department:edit',
        handleEditEvent as EventListener
      )
      window.removeEventListener('department:create', handleCreateEvent)
    }
  }, [])

  return (
    <div
      className='dropdown menu w-130 h-fit rounded-box bg-base-100 shadow-sm z-0!'
      popover='auto'
      id='popover-1'
      style={{ '--position-anchor': '--anchor-1' } as React.CSSProperties}
      ref={modalRef}
    >
      <form className='p-4' onSubmit={handleSubmit}>
        <span className='label w-full flex justify-center'>
          {editingDepartment
            ? 'Editar Departamento'
            : 'Novo Departamento - Formulário de Criação'}
        </span>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <label className='label w-full flex flex-col items-start'>
            Nome
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
            Código
            <input
              type='text'
              name='code'
              value={formData.code}
              onChange={handleChange}
              className='input w-full outline-none'
              required
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            Capacidade
            <input
              type='number'
              name='capacity'
              min={1}
              value={formData.capacity}
              onChange={handleChange}
              className='input w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              required
            />
          </label>

          <label className='label w-full flex flex-col items-start'>
            Status
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='select w-full outline-none'
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className='label w-full flex flex-col items-start md:col-span-2'>
            Descrição
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              className='textarea w-full outline-none'
              rows={3}
            />
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
              : editingDepartment
              ? 'Atualizar'
              : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
