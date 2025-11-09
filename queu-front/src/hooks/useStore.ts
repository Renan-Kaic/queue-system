import { useEffect } from 'react'
import {
  useDepartamentoStore,
  useUsuarioStore,
  useAppStore,
  useTicketStore,
} from '@/store'

// Hook para inicializar a aplicação
export const useAppInitialization = () => {
  const { initializeApp, isInitialized } = useAppStore()
  const { isLoading: loadingDepartamentos, error: errorDepartamentos } =
    useDepartamentoStore()
  const { isLoading: loadingUsuarios, error: errorUsuarios } = useUsuarioStore()

  useEffect(() => {
    if (!isInitialized) {
      initializeApp().catch()
    }
  }, [isInitialized, initializeApp])

  return {
    isInitialized,
    isLoading: loadingDepartamentos || loadingUsuarios,
    error: errorDepartamentos || errorUsuarios,
  }
}

// Hook para sincronização de dados
export const useDataSync = () => {
  const { syncAllData, lastSync } = useAppStore()
  const { clearError: clearDeptError } = useDepartamentoStore()
  const { clearError: clearUserError } = useUsuarioStore()

  const syncData = async () => {
    clearDeptError()
    clearUserError()
    await syncAllData()
  }

  return {
    syncData,
    lastSync: lastSync ? new Date(lastSync) : null,
  }
}

// Hook para operações com departamentos
export const useDepartamentos = () => {
  const {
    departamentos,
    isLoading,
    error,
    fetchDepartamentos,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    getDepartamentoById,
    getDepartamentosAtivos,
    getDepartamentosByStatus,
    clearError,
  } = useDepartamentoStore()

  return {
    departamentos,
    departamentosAtivos: getDepartamentosAtivos(),
    isLoading,
    error,
    fetchDepartamentos,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    getDepartamentoById,
    getDepartamentosByStatus,
    clearError,
  }
}

// Hook para operações com usuários
export const useUsuarios = () => {
  const {
    usuarios,
    isLoading,
    error,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    fetchUsuarioById,
    getUsuarioById,
    getUsuariosByType,
    getUsuariosByEmail,
    getUsuariosByDocument,
    searchUsuarios,
    clearError,
  } = useUsuarioStore()

  return {
    usuarios,
    isLoading,
    error,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    fetchUsuarioById,
    getUsuarioById,
    getUsuariosByType,
    getUsuariosByEmail,
    getUsuariosByDocument,
    searchUsuarios,
    clearError,
  }
}

// Hook para operações com tickets
export const useTickets = () => {
  const {
    tickets,
    isLoading,
    error,
    currentTicket,
    fetchTickets,
    fetchTicketsByQueue,
    fetchTicketsByCitizen,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchTicketById,
    callNextTicket,
    recallLastTicket,
    startService,
    completeService,
    cancelTicket,
    markNoShow,
    setCurrentTicket,
    getTicketById,
    getTicketsByQueue,
    getTicketsByCitizen,
    getTicketsByStatus,
    getTicketsByPriority,
    getWaitingTicketsInQueue,
    getNextTicketInQueue,
    clearError,
  } = useTicketStore()

  return {
    tickets,
    isLoading,
    error,
    currentTicket,
    fetchTickets,
    fetchTicketsByQueue,
    fetchTicketsByCitizen,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchTicketById,
    callNextTicket,
    recallLastTicket,
    startService,
    completeService,
    cancelTicket,
    markNoShow,
    setCurrentTicket,
    getTicketById,
    getTicketsByQueue,
    getTicketsByCitizen,
    getTicketsByStatus,
    getTicketsByPriority,
    getWaitingTicketsInQueue,
    getNextTicketInQueue,
    clearError,
  }
}
