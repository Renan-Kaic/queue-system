import { toast } from 'sonner'

// Tipos TypeScript correspondentes ao padrão C#
export interface Result<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

// Hook personalizado para tratamento de Result com Sonner
export const useResultHandler = () => {
  const handleResult = <T = any,>(
    result: Result<T>,
    options?: {
      successCallback?: (data?: T) => void
      errorCallback?: () => void
    }
  ) => {
    if (result.success) {
      toast.success(result.message, {
        duration: 4000,
      })
      options?.successCallback?.(result.data)
    } else {
      const errorMessages = result.errors?.length
        ? result.errors.map(err => `• ${err}`).join('\n')
        : ''

      toast.error(result.message, {
        description: errorMessages || undefined,
        duration: 6000,
      })
      options?.errorCallback?.()
    }
  }

  const handleApiCall = async <T = any,>(
    apiCall: () => Promise<Result<T>>,
    options?: {
      successCallback?: (data?: T) => void
      errorCallback?: () => void
      loadingMessage?: string
    }
  ) => {
    const loadingToast = toast.loading(
      options?.loadingMessage || 'Processando...'
    )

    try {
      const result = await apiCall()
      toast.dismiss(loadingToast)
      handleResult(result, options)
      return result
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Erro ao processar solicitação', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      })
      options?.errorCallback?.()
      return null
    }
  }

  return { handleResult, handleApiCall }
}

// Função standalone para usar fora de componentes
export const handleResult = <T = any,>(
  result: Result<T>,
  successCallback?: (data?: T) => void,
  errorCallback?: () => void
) => {
  if (result.success) {
    toast.success(result.message, {
      duration: 4000,
    })
    successCallback?.(result.data)
  } else {
    const errorMessages = result.errors?.length
      ? result.errors.map(err => `• ${err}`).join('\n')
      : ''

    toast.error(result.message, {
      description: errorMessages || undefined,
      duration: 6000,
    })
    errorCallback?.()
  }
}
