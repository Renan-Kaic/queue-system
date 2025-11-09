export interface Queue {
  id: number
  name: string
  code: string
  description?: string
  currentQueueSize: number
  maxQueueSize: number
  departmentId: number
  status: QueueStatus
  createdAt: string
  updatedAt?: string
}

export enum QueueStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Deleted = 3,
}

export interface CreateQueueDto {
  name: string
  code: string
  description?: string
  maxQueueSize: number
  departmentId: number
  status: QueueStatus
}

export interface UpdateQueueDto {
  id: number
  name: string
  code: string
  description?: string
  maxQueueSize: number
  departmentId: number
  status: QueueStatus
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: string[]
  statusCode: number
  timestamp: string
}
