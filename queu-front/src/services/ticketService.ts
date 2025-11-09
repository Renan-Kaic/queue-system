import { api } from '@/lib/axios'
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  NextTicketDto,
  ApiResponse,
} from '@/types/ticket'

export class TicketService {
  private static readonly BASE_URL = '/ticket'

  /**
   * Criar um novo ticket
   */
  static async create(
    ticketData: CreateTicketDto
  ): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.post(this.BASE_URL, ticketData)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Listar todos os tickets
   */
  static async getAll(): Promise<ApiResponse<Ticket[]>> {
    try {
      const response = await api.get(this.BASE_URL)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Buscar ticket por ID
   */
  static async getById(id: number): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Atualizar ticket
   */
  static async update(
    ticketData: UpdateTicketDto
  ): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.put(this.BASE_URL, ticketData)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Excluir ticket
   */
  static async delete(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.delete(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Obter próximo ticket da fila
   * Nota: Apesar da documentação dizer GET, usamos POST pois o endpoint espera body
   */
  static async getNextTicket(
    queueData: NextTicketDto
  ): Promise<ApiResponse<Ticket | null>> {
    try {
      const response = await api.post(`${this.BASE_URL}/next-ticket`, queueData)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Listar tickets por fila
   */
  static async getByQueue(queueId: number): Promise<ApiResponse<Ticket[]>> {
    try {
      const response = await api.get(`${this.BASE_URL}/queue/${queueId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Listar tickets por cidadão
   */
  static async getByCitizen(citizenId: number): Promise<ApiResponse<Ticket[]>> {
    try {
      const response = await api.get(`${this.BASE_URL}/citizen/${citizenId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }


  /**
   * Iniciar atendimento de um ticket
   */
  static async startService(ticketId: number): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.put(`${this.BASE_URL}/start/${ticketId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Concluir atendimento de um ticket
   */
  static async completeService(ticketId: number): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.put(`${this.BASE_URL}/complete/${ticketId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Cancelar ticket
   */
  static async cancelTicket(ticketId: number): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.put(`${this.BASE_URL}/cancel/${ticketId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Marcar como não compareceu
   */
  static async markNoShow(ticketId: number): Promise<ApiResponse<Ticket>> {
    try {
      const response = await api.put(`${this.BASE_URL}/no-show/${ticketId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Rechamar o último ticket chamado de uma fila
   */
  static async recallLastTicket(queueId: number): Promise<ApiResponse<Ticket | null>> {
    try {
      const response = await api.post(`${this.BASE_URL}/recall-last-ticket`, { queueId })
      return response.data
    } catch (error: any) {
      throw error
    }
  }
}
