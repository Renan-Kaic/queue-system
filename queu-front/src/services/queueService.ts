import { api } from '@/lib/axios'
import {
  Queue,
  CreateQueueDto,
  UpdateQueueDto,
  ApiResponse,
} from '@/types/queue'

export class QueueService {
  private static readonly BASE_URL = '/queue'

  static async getAll(): Promise<ApiResponse<Queue[]>> {
    try {
      const response = await api.get(this.BASE_URL)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async getById(id: number): Promise<ApiResponse<Queue>> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async create(queue: CreateQueueDto): Promise<ApiResponse<Queue>> {
    try {
      const response = await api.post(this.BASE_URL, queue)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async update(queue: UpdateQueueDto): Promise<ApiResponse<Queue>> {
    try {
      const response = await api.put(this.BASE_URL, queue)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async delete(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.delete(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }
}
