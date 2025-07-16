import { NextResponse } from 'next/server'

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: 'connected', // Replace with actual database check
      cache: 'connected',     // Replace with actual cache check
      external_api: 'healthy' // Replace with actual external service checks
    }
  }

  return NextResponse.json(healthStatus)
}
