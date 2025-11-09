import * as signalR from '@microsoft/signalr'

// Tipos para eventos SignalR
export interface TicketCalledEvent {
  type: string
  ticketId: number
  ticketCode: string
  ticketNumber: number
  queueId: number
  queueName: string
  departmentName: string
  citizenId: number
  calledAt: string
  message: string
}

export default class SignalRService {
  connection: signalR.HubConnection | null

  constructor() {
    this.connection = null
  }

  async startConnection() {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return
    }

    const hubUrl = process.env.NEXT_PUBLIC_API_URL

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubUrl}/ticket-hub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    try {
      await this.connection.start()


      await this.connection.invoke('JoinUserGroup')
    } catch (err) {
      throw err
    }
  }


  on(eventName: string, callback: (...args: any[]) => void) {
    if (!this.connection) {
      return
    }

    this.connection.on(eventName, callback)
  }

  onReceiveMessage(callback: (user: string, message: string) => void) {
    this.on('ReceiveMessage', callback)
  }

  // Métodos para eventos de tickets (adicione conforme necessário)
  onTicketCalled(callback: (data: TicketCalledEvent) => void) {
    this.on('TicketCalled', callback)
  }

  onTicketUpdate(callback: (data: any) => void) {
    this.on('TicketUpdate', callback)
  }

  onReceiveTicketUpdate(callback: (data: any) => void) {
    this.on('ReceiveTicketUpdate', callback)
  }

  off(eventName: string) {
    if (this.connection) {
      this.connection.off(eventName)
    }
  }

  async sendMessage(user: string, message: string) {
    try {
      await this.connection?.invoke('SendMessage', user, message)
    } catch (err) {
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop()
      } catch (err) {
      }
    }
  }

  // Verificar estado da conexão
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected'
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }
}
