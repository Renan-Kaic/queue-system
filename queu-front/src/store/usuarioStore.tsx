import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Usuario, { CitizenType } from '@/types/usuarios'
import { CitizenService } from '@/services/citizenService'

interface UsuarioState {
  // Estado
  usuarios: Usuario[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchUsuarios: () => Promise<void>
  createUsuario: (
    usuario: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
  updateUsuario: (id: number, usuario: Partial<Usuario>) => Promise<void>
  deleteUsuario: (id: number) => Promise<void>
  fetchUsuarioById: (id: number) => Promise<Usuario | null>
  setError: (error: string | null) => void
  clearError: () => void

  // Seletores
  getUsuarioById: (id: number) => Usuario | undefined
  getUsuariosByType: (type: CitizenType) => Usuario[]
  getUsuariosByEmail: (email: string) => Usuario | undefined
  getUsuariosByDocument: (document: string) => Usuario | undefined
  searchUsuarios: (query: string) => Usuario[]
}

export const useUsuarioStore = create<UsuarioState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      usuarios: [],
      isLoading: false,
      error: null,

      // Buscar todos os usuários
      fetchUsuarios: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await CitizenService.getAll()
          set({ usuarios: response.data || response, isLoading: false })
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao buscar usuários',
            isLoading: false,
          })
        }
      },

      // Criar usuário
      createUsuario: async usuario => {
        set({ isLoading: true, error: null })
        try {
          const response = await CitizenService.create(usuario)
          const novoUsuario = response.data || response

          set(state => ({
            usuarios: [...state.usuarios, novoUsuario],
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao criar usuário',
            isLoading: false,
          })
          throw error
        }
      },

      // Atualizar usuário
      updateUsuario: async (id, usuario) => {
        set({ isLoading: true, error: null })
        try {
          const response = await CitizenService.update(id, usuario)
          const usuarioAtualizado = response.data || response

          set(state => ({
            usuarios: state.usuarios.map(user =>
              user.id === id ? { ...user, ...usuarioAtualizado } : user
            ),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao atualizar usuário',
            isLoading: false,
          })
          throw error
        }
      },

      // Deletar usuário
      deleteUsuario: async id => {
        set({ isLoading: true, error: null })
        try {
          await CitizenService.delete(id)

          set(state => ({
            usuarios: state.usuarios.filter(user => user.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao deletar usuário',
            isLoading: false,
          })
          throw error
        }
      },

      // Buscar usuário por ID (da API)
      fetchUsuarioById: async id => {
        set({ isLoading: true, error: null })
        try {
          const response = await CitizenService.getById(id)
          const usuario = response.data || response

          // Atualizar o usuário no store se já existir
          set(state => ({
            usuarios: state.usuarios.some(u => u.id === id)
              ? state.usuarios.map(u => (u.id === id ? usuario : u))
              : [...state.usuarios, usuario],
            isLoading: false,
          }))

          return usuario
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Erro ao buscar usuário',
            isLoading: false,
          })
          return null
        }
      },

      // Definir erro
      setError: error => set({ error }),

      // Limpar erro
      clearError: () => set({ error: null }),

      // Seletores
      getUsuarioById: id => {
        const { usuarios } = get()
        return usuarios.find(user => user.id === id)
      },

      getUsuariosByType: type => {
        const { usuarios } = get()
        return usuarios.filter(user => user.type === type)
      },

      getUsuariosByEmail: email => {
        const { usuarios } = get()
        return usuarios.find(
          user => user.email.toLowerCase() === email.toLowerCase()
        )
      },

      getUsuariosByDocument: document => {
        const { usuarios } = get()
        return usuarios.find(user => user.document === document)
      },

      searchUsuarios: query => {
        const { usuarios } = get()
        const searchTerm = query.toLowerCase()

        return usuarios.filter(
          user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.document.includes(searchTerm) ||
            user.phone.includes(searchTerm)
        )
      },
    }),
    {
      name: 'usuario-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        usuarios: state.usuarios,
        // Não persistir loading e error states
      }),
    }
  )
)
