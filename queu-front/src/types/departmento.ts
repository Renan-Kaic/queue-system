export interface Departamento {
  id: number
  code: string
  name: string
  description?: string
  capacity: number
  status: DepartamentoStatus
  createdAt: string
  updatedAt?: string
}

export enum DepartamentoStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Deleted = 3
}
