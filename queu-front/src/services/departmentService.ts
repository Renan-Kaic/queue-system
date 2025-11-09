import { api } from '@/lib/axios'
import { Departamento } from '@/types/departmento'

export class DepartmentService {
  private static readonly BASE_URL = '/department'

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
    department: Omit<Departamento, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<any> {
    try {
      const response = await api.post(this.BASE_URL, department)
      return response.data
    } catch (error: any) {
      throw error
    }
  }

  static async update(
    id: number,
    department: Partial<Departamento>
  ): Promise<any> {
    try {
      const response = await api.put(`${this.BASE_URL}`, {
        id: id,
        ...department,
      })
      return response.data
    } catch (error: any) {
      throw error
    }
  }
}
