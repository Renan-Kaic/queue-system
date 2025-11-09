'use client'
import { useRouter } from 'next/navigation'
import Avatar from './Avatar'
import Watch from './Watch'

export default function Header() {
  const router = useRouter()

  return (
    <header
      className='header relative flex flex-row justify-between
      items-center h-15 px-3 border-b border-gray-300'
    >
      <div className='flex flex-row w-fit gap-2'>
        <button className='btn btn-primary' onClick={() => router.push('/app/departamentos')}>
          <span>Gerenciar Departamentos</span>
        </button>
        <button className='btn btn-secondary w-fit' onClick={() => router.push('/app/usuarios')}>
          <span>Gerenciar Usuários</span>
        </button>
      </div>
      <div className='absolute left-1/2 transform -translate-x-1/2'>
        <Watch />
      </div>
      <Avatar />
    </header>
  )
}
