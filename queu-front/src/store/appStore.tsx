import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useDepartamentoStore } from './departamentoStore'
import { useUsuarioStore } from './usuarioStore'

interface AppState {
  // Estado global
  isInitialized: boolean
  lastSync: string | null

  // Actions
  initializeApp: () => Promise<void>
  syncAllData: () => Promise<void>
  clearAllData: () => void
  exportData: () => { departamentos: any[]; usuarios: any[] }
  importData: (data: { departamentos: any[]; usuarios: any[] }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isInitialized: false,
      lastSync: null,

      // Inicializar aplicação
      initializeApp: async () => {
        try {
          const { fetchDepartamentos } = useDepartamentoStore.getState()
          const { fetchUsuarios } = useUsuarioStore.getState()

          // Buscar dados iniciais
          await Promise.all([fetchDepartamentos(), fetchUsuarios()])

          set({
            isInitialized: true,
            lastSync: new Date().toISOString(),
          })
        } catch (error) {
          throw error
        }
      },

      // Sincronizar todos os dados
      syncAllData: async () => {
        try {
          const { fetchDepartamentos } = useDepartamentoStore.getState()
          const { fetchUsuarios } = useUsuarioStore.getState()

          await Promise.all([fetchDepartamentos(), fetchUsuarios()])

          set({ lastSync: new Date().toISOString() })
        } catch (error) {
          throw error
        }
      },

      // Limpar todos os dados
      clearAllData: () => {
        // Limpar stores individuais
        useDepartamentoStore.setState({
          departamentos: [],
          error: null,
        })

        useUsuarioStore.setState({
          usuarios: [],
          error: null,
        })

        // Limpar localStorage
        localStorage.removeItem('departamento-storage')
        localStorage.removeItem('usuario-storage')
        localStorage.removeItem('app-storage')

        set({
          isInitialized: false,
          lastSync: null,
        })
      },

      // Exportar dados
      exportData: () => {
        const { departamentos } = useDepartamentoStore.getState()
        const { usuarios } = useUsuarioStore.getState()

        return {
          departamentos,
          usuarios,
        }
      },

      // Importar dados
      importData: data => {
        if (data.departamentos) {
          useDepartamentoStore.setState({
            departamentos: data.departamentos,
          })
        }

        if (data.usuarios) {
          useUsuarioStore.setState({
            usuarios: data.usuarios,
          })
        }

        set({
          lastSync: new Date().toISOString(),
        })
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Hook personalizado para estatísticas
export const useAppStats = () => {
  const { departamentos } = useDepartamentoStore()
  const { usuarios } = useUsuarioStore()

  return {
    totalDepartamentos: departamentos.length,
    totalUsuarios: usuarios.length,
    departamentosAtivos: departamentos.filter(d => d.status === 0).length,
    usuariosPrioritarios: usuarios.filter(u => u.type !== 0).length,
  }
}
