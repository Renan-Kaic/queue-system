'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'

interface TicketNotificationProps {
  ticketCode: string
  queueName: string
  departmentName: string
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function TicketNotification({
  ticketCode,
  queueName,
  departmentName,
  onClose,
  autoClose = true,
  duration = 5000,
}: TicketNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!autoClose) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        setIsVisible(false)
        setTimeout(onClose, 300) // Aguardar animação
      }
    }, 50)

    return () => clearInterval(interval)
  }, [autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className='bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 min-w-[320px] max-w-md'>
        <div className='flex items-start gap-3'>
          {/* Ícone */}
          <div className='shrink-0'>
            <div className='bg-green-100 rounded-full p-2'>
              <Bell className='w-5 h-5 text-green-600 animate-bounce' />
            </div>
          </div>

          {/* Conteúdo */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2 mb-1'>
              <h3 className='font-bold text-gray-900 text-sm'>
                Nova Senha Chamada
              </h3>
              <button
                onClick={handleClose}
                className='shrink-0 text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Fechar notificação'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-1'>
              <p className='text-2xl font-bold text-green-600'>{ticketCode}</p>
              <p className='text-xs text-gray-600 truncate'>{queueName}</p>
              <p className='text-xs text-gray-500 truncate'>{departmentName}</p>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        {autoClose && (
          <div className='mt-3 h-1 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-green-500 transition-all duration-50 ease-linear'
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
