import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Departamento, DepartamentoStatus } from '@/types/departmento'
import { DepartmentService } from '@/services/departmentService'

interface DepartamentoState {
  // Estado
  departamentos: Departamento[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchDepartamentos: () => Promise<void>
  createDepartamento: (
    departamento: Omit<Departamento, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
  updateDepartamento: (
    id: number,
    departamento: Partial<Departamento>
  ) => Promise<void>
  deleteDepartamento: (id: number) => Promise<void>
  setError: (error: string | null) => void
  clearError: () => void

  // Seletores
  getDepartamentoById: (id: number) => Departamento | undefined
  getDepartamentosAtivos: () => Departamento[]
  getDepartamentosByStatus: (status: DepartamentoStatus) => Departamento[]
}

export const useDepartamentoStore = create<DepartamentoState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      departamentos: [],
      isLoading: false,
      error: null,

      // Buscar todos os departamentos
      fetchDepartamentos: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await DepartmentService.getAll()
          set({ departamentos: response.data || response, isLoading: false })
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao buscar departamentos',
            isLoading: false,
          })
        }
      },

      // Criar departamento
      createDepartamento: async departamento => {
        set({ isLoading: true, error: null })
        try {
          const response = await DepartmentService.create(departamento)
          const novoDepartamento = response.data || response

          set(state => ({
            departamentos: [...state.departamentos, novoDepartamento],
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao criar departamento',
            isLoading: false,
          })
          throw error
        }
      },

      // Atualizar departamento
      updateDepartamento: async (id, departamento) => {
        set({ isLoading: true, error: null })
        try {
          const response = await DepartmentService.update(id, departamento)
          const departamentoAtualizado = response.data || response

          set(state => ({
            departamentos: state.departamentos.map(dept =>
              dept.id === id ? { ...dept, ...departamentoAtualizado } : dept
            ),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message ||
              'Erro ao atualizar departamento',
            isLoading: false,
          })
          throw error
        }
      },

      // Deletar departamento
      deleteDepartamento: async id => {
        set({ isLoading: true, error: null })
        try {
          await DepartmentService.delete(id)

          set(state => ({
            departamentos: state.departamentos.filter(dept => dept.id !== id),
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.message || 'Erro ao deletar departamento',
            isLoading: false,
          })
          throw error
        }
      },

      // Definir erro
      setError: error => set({ error }),

      // Limpar erro
      clearError: () => set({ error: null }),

      // Seletores
      getDepartamentoById: id => {
        const { departamentos } = get()
        return departamentos.find(dept => dept.id === id)
      },

      getDepartamentosAtivos: () => {
        const { departamentos } = get()
        return departamentos.filter(
          dept => dept.status === DepartamentoStatus.Active
        )
      },

      getDepartamentosByStatus: status => {
        const { departamentos } = get()
        return departamentos.filter(dept => dept.status === status)
      },
    }),
    {
      name: 'departamento-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        departamentos: state.departamentos,
        // Não persistir loading e error states
      }),
    }
  )
)
