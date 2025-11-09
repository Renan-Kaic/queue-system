import { api } from '@/lib/axios'
import Usuario from '@/types/usuarios'

export class CitizenService {
  private static readonly BASE_URL = '/citizen'

  static async delete(id: number): Promise<any> {
    try {
      const response = await api.delete(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async getAll(): Promise<any> {
    try {
      const response = await api.get(this.BASE_URL)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async create(
    citizen: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<any> {
    try {
      const response = await api.post(this.BASE_URL, citizen)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async update(id: number, citizen: Partial<Usuario>): Promise<any> {
    try {
      const response = await api.put(`${this.BASE_URL}`, {
        id: id,
        ...citizen,
      })
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async getById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  }
}
