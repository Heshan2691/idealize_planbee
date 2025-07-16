// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  environment: string
  version: string
  services: {
    database: string
    cache: string
    external_api: string
  }
}

// Common utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
