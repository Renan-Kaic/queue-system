'use client'
import { useState, useEffect } from 'react'
import { Search, User, X } from 'lucide-react'
import { useUsuarios } from '@/hooks/useStore'
import Usuario from '@/types/usuarios'
import { UserTypeBadge } from '../usuarios/UserTypeBadge'

interface UserSearchProps {
  onUserSelect: (user: Usuario) => void
  selectedUser?: Usuario | null
  placeholder?: string
  className?: string
}

export function UserSearch({
  onUserSelect,
  selectedUser,
  placeholder = 'Buscar usuário por nome, email ou documento...',
  className = '',
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([])

  const { usuarios, fetchUsuarios, searchUsuarios } = useUsuarios()

  useEffect(() => {
    // Carregar usuários quando o componente monta
    if (usuarios.length === 0) {
      fetchUsuarios()
    }
  }, [usuarios.length, fetchUsuarios])

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchUsuarios(searchQuery.trim())
      setFilteredUsers(results.slice(0, 10)) // Limitar a 10 resultados
      setIsOpen(true)
    } else {
      setFilteredUsers([])
      setIsOpen(false)
    }
  }, [searchQuery, searchUsuarios])

  const handleUserSelect = (user: Usuario) => {
    onUserSelect(user)
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleClearSelection = () => {
    onUserSelect(null as any)
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setIsOpen(true)
    }
  }

  const handleInputBlur = () => {
    // Delay para permitir clique nos resultados
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div className={`relative ${className}`}>
      {selectedUser ? (
        // Mostrar usuário selecionado
        <div className='flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-blue-600' />
            </div>
            <div>
              <p className='font-medium text-gray-900'>{selectedUser.name}</p>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span>{selectedUser.email}</span>
                <UserTypeBadge type={selectedUser.type} />
              </div>
            </div>
          </div>
          <button
            onClick={handleClearSelection}
            className='p-1 hover:bg-gray-200 rounded-full transition-colors'
            title='Remover seleção'
          >
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
      ) : (
        // Campo de pesquisa
        <div className='relative'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
            />
          </div>

          {/* Dropdown com resultados */}
          {isOpen && filteredUsers.length > 0 && (
            <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className='w-full p-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0'>
                      <User className='w-4 h-4 text-blue-600' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900 truncate'>
                        {user.name}
                      </p>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span className='truncate'>{user.email}</span>
                        <span>•</span>
                        <span>{user.document}</span>
                        <UserTypeBadge type={user.type} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Estado vazio */}
          {isOpen &&
            searchQuery.trim().length >= 2 &&
            filteredUsers.length === 0 && (
              <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
                <div className='text-center text-gray-500'>
                  <User className='w-8 h-8 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>Nenhum usuário encontrado</p>
                  <p className='text-xs mt-1'>
                    Tente buscar por nome, email ou documento
                  </p>
                </div>
              </div>
            )}

          {/* Dica de pesquisa */}
          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3'>
              <p className='text-sm text-gray-500 text-center'>
                Digite pelo menos 2 caracteres para buscar
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
