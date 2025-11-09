'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Building2,
  ListChecks,
  User,
  Clock,
  TrendingUp,
  Volume2,
  VolumeX,
  Settings,
  X,
} from 'lucide-react'
import { TicketService } from '@/services/ticketService'
import { QueueService } from '@/services/queueService'
import { DepartmentService } from '@/services/departmentService'
import { CitizenService } from '@/services/citizenService'
import { Ticket } from '@/types/ticket'
import { Queue } from '@/types/queue'
import { Departamento } from '@/types/departmento'
import Usuario from '@/types/usuarios'
import SignalRService, { TicketCalledEvent } from '@/services/signalRService'
import TicketNotification from '@/components/terminal/TicketNotification'
import TTSSettings from '@/components/terminal/TTSSettings'
import ttsService from '@/services/textToSpeechService'

interface CalledTicket {
  ticket: Ticket
  queue: Queue | null
  department: Departamento | null
  citizen: Usuario | null
}

interface QueueTickets {
  queue: Queue
  department: Departamento | null
  tickets: CalledTicket[]
  latestTicket: CalledTicket | null
}

interface TicketCache {
  [ticketId: number]: CalledTicket
}

interface NotificationData {
  id: string
  ticketCode: string
  queueName: string
  departmentName: string
}

export default function TerminalPage() {
  const [queueTickets, setQueueTickets] = useState<QueueTickets[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isTTSEnabled, setIsTTSEnabled] = useState(true) // Inicia habilitado
  const [showTTSSettings, setShowTTSSettings] = useState(false)
  const [showAudioPrompt, setShowAudioPrompt] = useState(true) // Mostra prompt inicial
  const [audioPermissionRequested, setAudioPermissionRequested] =
    useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [signalRService] = useState(() => new SignalRService())
  const ticketCacheRef = useRef<TicketCache>({})
  const queueCacheRef = useRef<Map<number, Queue>>(new Map())
  const departmentCacheRef = useRef<Map<number, Departamento>>(new Map())

  const loadInitialCache = async () => {
    try {
      const queueResponse = await QueueService.getAll()
      if (queueResponse.success) {
        queueResponse.data.forEach((queue: Queue) => {
          queueCacheRef.current.set(queue.id, queue)
        })
      }

      const deptResponse = await DepartmentService.getAll()
      if (deptResponse.success) {
        deptResponse.data.forEach((dept: Departamento) => {
          departmentCacheRef.current.set(dept.id, dept)
        })
      }

    } catch (err) {
    }
  }

  const fetchTicketDetails = async (ticket: Ticket): Promise<CalledTicket> => {
    let queue: Queue | null = null
    let department: Departamento | null = null
    let citizen: Usuario | null = null

    try {
      if (queueCacheRef.current.has(ticket.queueId)) {
        queue = queueCacheRef.current.get(ticket.queueId) || null
      } else {
        const queueResponse = await QueueService.getById(ticket.queueId)
        if (queueResponse.success) {
          queue = queueResponse.data
          queueCacheRef.current.set(ticket.queueId, queue)
        }
      }

      if (queue && departmentCacheRef.current.has(queue.departmentId)) {
        department = departmentCacheRef.current.get(queue.departmentId) || null
      }

      const citizenResponse = await CitizenService.getById(ticket.citizenId)
      if (citizenResponse.success) {
        citizen = citizenResponse.data
      }
    } catch (err) {
    }

    return { ticket, queue, department, citizen }
  }

  const updateQueueDisplay = () => {
    const tickets = Object.values(ticketCacheRef.current)

    if (tickets.length === 0) {
      setQueueTickets([])
      return
    }

    const queueMap = new Map<number, QueueTickets>()

    for (const ticketDetail of tickets) {
      if (!ticketDetail.queue) continue

      const queueId = ticketDetail.queue.id

      if (!queueMap.has(queueId)) {
        queueMap.set(queueId, {
          queue: ticketDetail.queue,
          department: ticketDetail.department,
          tickets: [],
          latestTicket: null,
        })
      }

      const queueData = queueMap.get(queueId)!
      queueData.tickets.push(ticketDetail)

      if (
        !queueData.latestTicket ||
        (ticketDetail.ticket.calledAt &&
          queueData.latestTicket.ticket.calledAt &&
          new Date(ticketDetail.ticket.calledAt) >
            new Date(queueData.latestTicket.ticket.calledAt))
      ) {
        queueData.latestTicket = ticketDetail
      }
    }

    queueMap.forEach(queueData => {
      queueData.tickets.sort((a, b) => {
        const dateA = a.ticket.calledAt
          ? new Date(a.ticket.calledAt).getTime()
          : 0
        const dateB = b.ticket.calledAt
          ? new Date(b.ticket.calledAt).getTime()
          : 0
        return dateB - dateA
      })
    })

    const queuesArray = Array.from(queueMap.values())
    queuesArray.sort((a, b) => {
      const dateA = a.latestTicket?.ticket.calledAt
        ? new Date(a.latestTicket.ticket.calledAt).getTime()
        : 0
      const dateB = b.latestTicket?.ticket.calledAt
        ? new Date(b.latestTicket.ticket.calledAt).getTime()
        : 0
      return dateB - dateA
    })

    setQueueTickets(queuesArray.slice(0, 6))
  }

  const fetchCalledTickets = async () => {
    try {
      setLoading(true)
      const response = await TicketService.getAll()

      if (response.success && response.data) {
        const calledTickets = response.data.filter(
          (ticket: Ticket) => ticket.ticketStatus === 1
        )

        const ticketsWithDetails = await Promise.all(
          calledTickets.map(fetchTicketDetails)
        )

        ticketsWithDetails.forEach(ticketDetail => {
          ticketCacheRef.current[ticketDetail.ticket.id] = ticketDetail
        })

        updateQueueDisplay()
      }

      setError(null)
    } catch (err: any) {
      setError('Erro ao carregar tickets chamados')
    } finally {
      setLoading(false)
    }
  }

  const handleTicketCalled = async (event: TicketCalledEvent) => {

    const notification: NotificationData = {
      id: `${event.ticketId}-${Date.now()}`,
      ticketCode: event.ticketCode,
      queueName: event.queueName,
      departmentName: event.departmentName,
    }
    setNotifications(prev => [...prev, notification])

    try {
      const ticketResponse = await TicketService.getById(event.ticketId)

      if (ticketResponse.success) {
        const ticket = ticketResponse.data
        const ticketDetail = await fetchTicketDetails(ticket)

       if (isTTSEnabled && ttsService.isAvailable()) {
          try {
            await ttsService.announceTicket({
              ticketCode: event.ticketCode,
              departmentName: event.departmentName,
              queueName: event.queueName,
              citizenName: ticketDetail.citizen?.name,
            })
          } catch (ttsError: any) {

          }
        }

        ticketCacheRef.current[ticket.id] = ticketDetail

        const cacheKeys = Object.keys(ticketCacheRef.current).map(Number)
        if (cacheKeys.length > 100) {
          const sortedKeys = cacheKeys.sort((a, b) => {
            const dateA = ticketCacheRef.current[a].ticket.calledAt
              ? new Date(ticketCacheRef.current[a].ticket.calledAt).getTime()
              : 0
            const dateB = ticketCacheRef.current[b].ticket.calledAt
              ? new Date(ticketCacheRef.current[b].ticket.calledAt).getTime()
              : 0
            return dateA - dateB
          })

          sortedKeys.slice(0, 20).forEach(key => {
            delete ticketCacheRef.current[key]
          })
        }

        updateQueueDisplay()

      }
    } catch (err) {
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    let isSubscribed = true

    const initialize = async () => {
      try {

        await loadInitialCache()

        await signalRService.startConnection()
        setIsConnected(true)

        if (!isSubscribed) return

        if (ttsService.isAvailable()) {
          const voices = ttsService.getAvailableVoices()
        } else {
          setIsTTSEnabled(false)
        }

        signalRService.onTicketCalled((event: TicketCalledEvent) => {
          if (isSubscribed) {
            handleTicketCalled(event)
          }
        })


        await fetchCalledTickets()

      } catch (error) {
        setError('Erro ao conectar ao sistema em tempo real')
        setLoading(false)
      }
    }

    initialize()

    return () => {
      isSubscribed = false
      signalRService.off('TicketCalled')
      signalRService.stopConnection()
      ttsService.stop()
    }
  }, [])

  if (loading && queueTickets.length === 0) {
    return (
      <div className='h-screen bg-linear-to-br from-green-950 via-green-900 to-emerald-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-24 w-24 border-b-4 border-white mx-auto mb-4'></div>
          <p className='text-white text-2xl font-semibold'>
            Carregando terminal...
          </p>
        </div>
      </div>
    )
  }

  if (error && queueTickets.length === 0) {
    return (
      <div className='h-screen bg-linear-to-br from-red-950 via-red-900 to-red-950 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-white text-3xl font-bold mb-4'>⚠️ Erro</p>
          <p className='text-white text-xl'>{error}</p>
        </div>
      </div>
    )
  }

  if (queueTickets.length === 0) {
    return (
      <div className='h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center'>
        <div className='text-center'>
          <TrendingUp className='w-20 h-20 text-white mx-auto mb-4' />
          <p className='text-white text-4xl font-bold mb-2'>
            Terminal de Senhas
          </p>
          <p className='text-gray-300 text-xl'>Aguardando chamadas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <TTSSettings
        isOpen={showTTSSettings}
        onClose={() => setShowTTSSettings(false)}
      />

      {showAudioPrompt && !ttsService.hasUserInteraction() && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center'>
            <div className='bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
              <Volume2 className='w-10 h-10 text-green-600 animate-pulse' />
            </div>

            <h2 className='text-2xl font-bold text-gray-900 mb-3'>
              Sistema de Anúncio de Senhas
            </h2>

            <p className='text-gray-600 mb-6'>
              Para ouvir os anúncios de senhas chamadas, clique no botão abaixo
              para ativar o áudio.
            </p>

            <button
              onClick={async () => {
                try {
                  const granted = await ttsService.requestUserInteraction()
                  if (granted) {
                    setAudioPermissionRequested(true)
                    setShowAudioPrompt(false)

                  }
                } catch (error) {
                }
              }}
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto'
            >
              <Volume2 className='w-6 h-6' />
              Ativar Anúncios de Áudio
            </button>

            <button
              onClick={() => {
                setShowAudioPrompt(false)
                setIsTTSEnabled(false)
              }}
              className='mt-4 text-gray-500 hover:text-gray-700 text-sm underline'
            >
              Não quero ouvir os anúncios
            </button>
          </div>
        </div>
      )}

      {/* Notificações */}
      <div className='fixed top-0 right-0 z-50 space-y-2 p-4'>
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ top: `${index * 120}px` }}
            className='relative'
          >
            <TicketNotification
              ticketCode={notification.ticketCode}
              queueName={notification.queueName}
              departmentName={notification.departmentName}
              onClose={() => removeNotification(notification.id)}
              autoClose={true}
              duration={6000}
            />
          </div>
        ))}
      </div>

      <div className='h-screen bg-linear-to-br from-green-950 via-emerald-950 to-green-950 flex flex-col p-4 overflow-hidden'>
        {/* Header Compacto */}
        <div className='text-center mb-3 relative'>
          <h1 className='text-white text-3xl font-bold mb-1'>
            Sistema de Chamadas
          </h1>
          <div className='flex items-center justify-center gap-4'>
            <p className='text-gray-200 text-sm'>
              {new Date().toLocaleString('pt-BR', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
            {/* Indicador de Conexão em Tempo Real */}
            <div className='flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full'>
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span className='text-xs text-white font-semibold'>
                {isConnected ? 'AO VIVO' : 'OFFLINE'}
              </span>
            </div>
            {/* Botão de Controle de Áudio */}
            <div className='flex items-center gap-2'>
              <button
                onClick={async () => {
                  if (!isTTSEnabled) {
                    // Ativando áudio
                    setIsTTSEnabled(true)

                    // Se não tem permissão ainda, mostrar modal
                    if (!ttsService.hasUserInteraction()) {
                      setShowAudioPrompt(true)
                    } else {
                      await ttsService.speak('Áudio ativado')
                    }
                  } else {
                    // Desativando áudio
                    setIsTTSEnabled(false)
                    ttsService.stop()
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                  isTTSEnabled
                    ? 'bg-green-500/30 hover:bg-green-500/40'
                    : 'bg-gray-500/30 hover:bg-gray-500/40'
                }`}
                title={isTTSEnabled ? 'Desativar áudio' : 'Ativar áudio'}
              >
                {isTTSEnabled ? (
                  <Volume2 className='w-4 h-4 text-white' />
                ) : (
                  <VolumeX className='w-4 h-4 text-white' />
                )}
                <span className='text-xs text-white font-semibold'>
                  {isTTSEnabled ? 'ÁUDIO' : 'MUDO'}
                </span>
              </button>

              {/* Botão de Configurações de Áudio */}
              {isTTSEnabled && (
                <button
                  onClick={() => setShowTTSSettings(true)}
                  className='p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all'
                  title='Configurações de áudio'
                >
                  <Settings className='w-4 h-4 text-white' />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Senha Atual Destaque - Primeira fila com maior destaque */}
        {queueTickets[0]?.latestTicket && (
          <div className='bg-white rounded-2xl shadow-2xl p-4 mb-3 shrink-0'>
            <div className='flex items-center justify-between gap-6'>
              {/* Código da Senha - Destaque Principal */}
              <div className='shrink-0'>
                <p className='text-gray-600 text-sm font-semibold mb-1'>
                  SENHA CHAMADA
                </p>
                <div className='bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl py-3 px-6 shadow-lg'>
                  <p className='text-4xl font-bold tracking-wider'>
                    {queueTickets[0].latestTicket.ticket.ticketCode}
                  </p>
                </div>
                <div className='flex items-center justify-center gap-2 mt-1 text-gray-500 text-xs'>
                  <Clock className='w-3 h-3' />
                  <span>
                    {queueTickets[0].latestTicket.ticket.calledAt
                      ? new Date(
                          queueTickets[0].latestTicket.ticket.calledAt
                        ).toLocaleTimeString('pt-BR')
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Informações em Grid */}
              <div className='flex-1 grid grid-cols-3 gap-3'>
                {/* Departamento */}
                <div className='bg-green-50 rounded-xl p-3 border border-green-200'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Building2 className='w-4 h-4 text-green-700' />
                    <p className='text-gray-600 text-xs font-semibold'>
                      Departamento
                    </p>
                  </div>
                  <p className='text-gray-900 text-lg font-bold truncate'>
                    {queueTickets[0].department?.name || 'N/A'}
                  </p>
                  <p className='text-gray-500 text-xs'>
                    {queueTickets[0].department?.code || 'N/A'}
                  </p>
                </div>

                {/* Fila */}
                <div className='bg-emerald-50 rounded-xl p-3 border border-emerald-200'>
                  <div className='flex items-center gap-2 mb-1'>
                    <ListChecks className='w-4 h-4 text-emerald-700' />
                    <p className='text-gray-600 text-xs font-semibold'>Fila</p>
                  </div>
                  <p className='text-gray-900 text-lg font-bold truncate'>
                    {queueTickets[0].queue.name}
                  </p>
                  <p className='text-gray-500 text-xs'>
                    {queueTickets[0].queue.code}
                  </p>
                </div>

                {/* Cidadão */}
                <div className='bg-gray-50 rounded-xl p-3 border border-gray-200'>
                  <div className='flex items-center gap-2 mb-1'>
                    <User className='w-4 h-4 text-gray-700' />
                    <p className='text-gray-600 text-xs font-semibold'>
                      Cidadão
                    </p>
                  </div>
                  <p className='text-gray-900 text-lg font-bold truncate'>
                    {queueTickets[0].latestTicket.citizen?.name || 'N/A'}
                  </p>
                  <p className='text-gray-500 text-xs truncate'>
                    {queueTickets[0].latestTicket.citizen?.document || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grade de Filas - Cada coluna representa uma fila */}
        <div className='flex-1 bg-white/95 rounded-2xl shadow-xl p-3 min-h-0 overflow-hidden border border-gray-200'>
          <h2 className='text-gray-800 text-lg font-bold mb-2 text-center shrink-0'>
            Últimas Chamadas por Fila
          </h2>
          <div
            className={`grid gap-3 h-full overflow-hidden ${
              queueTickets.length === 1
                ? 'grid-cols-1'
                : queueTickets.length === 2
                ? 'grid-cols-2'
                : queueTickets.length === 3
                ? 'grid-cols-3'
                : queueTickets.length === 4
                ? 'grid-cols-4'
                : queueTickets.length === 5
                ? 'grid-cols-5'
                : 'grid-cols-6'
            }`}
          >
            {queueTickets.map((queueData, queueIndex) => (
              <div
                key={queueData.queue.id}
                className='flex flex-col bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-2 overflow-hidden border border-gray-200'
              >
                {/* Header da Fila */}
                <div
                  className={`rounded-lg p-2 mb-2 shrink-0 ${
                    queueIndex === 0
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-200 border border-gray-300'
                  }`}
                >
                  <div className='flex items-center gap-1 mb-1'>
                    <ListChecks
                      className={`w-3 h-3 ${
                        queueIndex === 0 ? 'text-green-700' : 'text-gray-700'
                      }`}
                    />
                    <p className='text-xs font-bold text-gray-800 truncate'>
                      {queueData.queue.name}
                    </p>
                  </div>
                  <p className='text-xs text-gray-600 truncate'>
                    {queueData.department?.name || 'N/A'}
                  </p>
                </div>

                {/* Lista de Tickets da Fila */}
                <div className='flex-1 overflow-y-auto space-y-2 pr-1'>
                  {queueData.tickets
                    .slice(0, 10)
                    .map((ticketDetail, ticketIndex) => (
                      <div
                        key={ticketDetail.ticket.id}
                        className={`rounded-lg p-2 shadow-sm transition-all ${
                          queueIndex === 0 && ticketIndex === 0
                            ? 'bg-linear-to-br from-green-100 to-emerald-100 border-2 border-green-500'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <span
                            className={`text-2xl font-bold ${
                              queueIndex === 0 && ticketIndex === 0
                                ? 'text-green-700'
                                : 'text-gray-900'
                            }`}
                          >
                            {ticketDetail.ticket.ticketCode}
                          </span>
                          {queueIndex === 0 && ticketIndex === 0 && (
                            <TrendingUp className='w-4 h-4 text-green-600' />
                          )}
                        </div>
                        <p className='text-xs font-medium text-gray-700 truncate'>
                          {ticketDetail.citizen?.name || 'N/A'}
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {ticketDetail.ticket.calledAt
                            ? new Date(
                                ticketDetail.ticket.calledAt
                              ).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
