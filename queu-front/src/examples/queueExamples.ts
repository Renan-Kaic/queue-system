/**
 * Exemplos de Uso do Sistema de Filas
 *
 * Este arquivo contém exemplos de como utilizar os serviços,
 * stores e componentes do sistema de filas.
 */

import { QueueService } from '@/services/queueService'
import { useQueueStore } from '@/store/queueStore'
import { QueueStatus, CreateQueueDto, UpdateQueueDto } from '@/types/queue'

// ============================================
// 1. USANDO O SERVIÇO DIRETAMENTE
// ============================================

// Listar todas as filas
async function exemploListarFilas() {
  try {
    const response = await QueueService.getAll()
    if (response.success) {
    }
  } catch (error) {
  }
}

// Obter fila por ID
async function exemploObterFila(id: number) {
  try {
    const response = await QueueService.getById(id)
    if (response.success) {
    }
  } catch (error) {
  }
}

// Criar nova fila
async function exemploCriarFila() {
  const novaFila: CreateQueueDto = {
    name: 'Atendimento Geral',
    code: 'ATEND_GERAL',
    description: 'Fila para atendimentos gerais',
    maxQueueSize: 100,
    departmentId: 1,
    status: QueueStatus.Active,
  }

  try {
    const response = await QueueService.create(novaFila)
    if (response.success) {
    }
  } catch (error) {
  }
}

// Atualizar fila
async function exemploAtualizarFila(id: number) {
  const filaAtualizada: UpdateQueueDto = {
    id,
    name: 'Atendimento Prioritário',
    code: 'ATEND_PRIOR',
    description: 'Fila para atendimentos prioritários',
    maxQueueSize: 50,
    departmentId: 1,
    status: QueueStatus.Active,
  }

  try {
    const response = await QueueService.update(filaAtualizada)
    if (response.success) {
    }
  } catch (error) {
  }
}

// Excluir fila
async function exemploExcluirFila(id: number) {
  try {
    const response = await QueueService.delete(id)
    if (response.success) {
    }
  } catch (error) {
  }
}

// ============================================
// 2. USANDO O STORE ZUSTAND
// ============================================

function ComponenteExemplo() {
  // Obter estado e ações do store
  const {
    queues,
    selectedQueue,
    isLoading,
    error,
    setQueues,
    setSelectedQueue,
    addQueue,
    updateQueue,
    removeQueue,
    setLoading,
    setError,
  } = useQueueStore()

  // Carregar filas
  async function carregarFilas() {
    setLoading(true)
    try {
      const response = await QueueService.getAll()
      if (response.success) {
        setQueues(response.data)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar fila
  async function adicionarFila(novaFila: CreateQueueDto) {
    try {
      const response = await QueueService.create(novaFila)
      if (response.success) {
        addQueue(response.data) // Adiciona ao estado local
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Atualizar fila
  async function atualizarFila(fila: UpdateQueueDto) {
    try {
      const response = await QueueService.update(fila)
      if (response.success) {
        updateQueue(response.data) // Atualiza no estado local
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Remover fila
  async function removerFila(id: number) {
    try {
      const response = await QueueService.delete(id)
      if (response.success) {
        removeQueue(id) // Remove do estado local
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return null // Exemplo, não renderiza nada
}

// ============================================
// 3. FILTRANDO FILAS POR DEPARTAMENTO
// ============================================

function exemploFiltrarPorDepartamento() {
  const { queues } = useQueueStore()
  const departmentId = 1

  // Filtrar filas do departamento
  const filasDoDepartamento = queues.filter(
    queue => queue.departmentId === departmentId
  )

}

// ============================================
// 4. FILTRANDO POR STATUS
// ============================================

function exemploFiltrarPorStatus() {
  const { queues } = useQueueStore()

  // Apenas filas ativas
  const filasAtivas = queues.filter(
    queue => queue.status === QueueStatus.Active
  )

  // Filas suspensas
  const filasSuspensas = queues.filter(
    queue => queue.status === QueueStatus.Suspended
  )

}

// ============================================
// 5. CALCULANDO ESTATÍSTICAS
// ============================================

function exemploEstatisticas() {
  const { queues } = useQueueStore()

  // Total de pessoas na fila
  const totalPessoasNaFila = queues.reduce(
    (total, queue) => total + queue.currentQueueSize,
    0
  )

  // Capacidade total
  const capacidadeTotal = queues.reduce(
    (total, queue) => total + queue.maxQueueSize,
    0
  )

  // Percentual de ocupação
  const percentualOcupacao = (totalPessoasNaFila / capacidadeTotal) * 100

  // Fila mais cheia
  const filaMaisCheia = queues.reduce((prev, current) => {
    const prevPercentual = (prev.currentQueueSize / prev.maxQueueSize) * 100
    const currentPercentual =
      (current.currentQueueSize / current.maxQueueSize) * 100
    return currentPercentual > prevPercentual ? current : prev
  })

}

// ============================================
// 6. VALIDAÇÃO DE DADOS
// ============================================

function exemploValidacao(dados: Partial<CreateQueueDto>): string[] {
  const erros: string[] = []

  // Nome
  if (!dados.name || dados.name.length === 0) {
    erros.push('Nome é obrigatório')
  } else if (dados.name.length > 255) {
    erros.push('Nome deve ter no máximo 255 caracteres')
  }

  // Código
  if (!dados.code || dados.code.length === 0) {
    erros.push('Código é obrigatório')
  } else if (dados.code.length > 50) {
    erros.push('Código deve ter no máximo 50 caracteres')
  } else if (!/^[A-Z0-9_-]+$/.test(dados.code)) {
    erros.push(
      'Código deve conter apenas letras maiúsculas, números, hífen e underscore'
    )
  }

  // Descrição
  if (dados.description && dados.description.length > 500) {
    erros.push('Descrição deve ter no máximo 500 caracteres')
  }

  // Capacidade
  if (!dados.maxQueueSize) {
    erros.push('Capacidade máxima é obrigatória')
  } else if (dados.maxQueueSize < 1 || dados.maxQueueSize > 1000) {
    erros.push('Capacidade deve ser entre 1 e 1000')
  }

  // Departamento
  if (!dados.departmentId || dados.departmentId <= 0) {
    erros.push('Departamento é obrigatório')
  }

  return erros
}

// ============================================
// 7. FORMATAÇÃO DE DADOS
// ============================================

function exemploFormatacao() {
  const { queues } = useQueueStore()

  // Formatar para exibição em tabela
  const dadosTabela = queues.map(queue => ({
    id: queue.id,
    nome: queue.name,
    codigo: queue.code,
    fila: `${queue.currentQueueSize}/${queue.maxQueueSize}`,
    percentual: `${(
      (queue.currentQueueSize / queue.maxQueueSize) *
      100
    ).toFixed(1)}%`,
    status: queue.status === QueueStatus.Active ? 'Ativo' : 'Inativo',
    criacao: new Date(queue.createdAt).toLocaleDateString('pt-BR'),
  }))

}

// ============================================
// 8. ORDENAÇÃO
// ============================================

function exemploOrdenacao() {
  const { queues } = useQueueStore()

  // Ordenar por nome (A-Z)
  const porNome = [...queues].sort((a, b) => a.name.localeCompare(b.name))

  // Ordenar por ocupação (maior primeiro)
  const porOcupacao = [...queues].sort((a, b) => {
    const ocupacaoA = (a.currentQueueSize / a.maxQueueSize) * 100
    const ocupacaoB = (b.currentQueueSize / b.maxQueueSize) * 100
    return ocupacaoB - ocupacaoA
  })

  // Ordenar por data de criação (mais recente primeiro)
  const porData = [...queues].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )


}

// ============================================
// 9. BUSCA E FILTRO
// ============================================

function exemploBuscaEFiltro(termoBusca: string) {
  const { queues } = useQueueStore()

  // Buscar por nome ou código
  const resultados = queues.filter(
    queue =>
      queue.name.toLowerCase().includes(termoBusca.toLowerCase()) ||
      queue.code.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return resultados
}

export {
  exemploListarFilas,
  exemploObterFila,
  exemploCriarFila,
  exemploAtualizarFila,
  exemploExcluirFila,
  exemploFiltrarPorDepartamento,
  exemploFiltrarPorStatus,
  exemploEstatisticas,
  exemploValidacao,
  exemploFormatacao,
  exemploOrdenacao,
  exemploBuscaEFiltro,
}
