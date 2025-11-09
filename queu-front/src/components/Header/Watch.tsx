'use client'
import { useState, useEffect } from 'react'

export default function Watch() {
  const [time, setTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())

    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Evita erro de hidratação mostrando placeholder até montar no cliente
  if (!mounted || !time) {
    return (
      <div className='flex items-center justify-center p-4 mr-4 '>
        <div className='text-center'>
          <div className='text-md font-bold text-gray-800 font-mono'>
            --:--:--
          </div>
          <div className='text-md text-gray-600 capitalize'>carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center p-4 mr-4 '>
      <div className='text-center'>
        <div className='text-md font-bold text-gray-800 font-mono'>
          {formatTime(time)}
        </div>
        <div className='text-md text-gray-600 capitalize'>
          {formatDate(time)}
        </div>
      </div>
    </div>
  )
}
