import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, seedDefaultData, checkDatabaseHealth } from '@/lib/initDatabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'health':
        const healthResult = await checkDatabaseHealth()
        return NextResponse.json(healthResult)
      
      case 'init':
        const initResult = await initializeDatabase()
        return NextResponse.json(initResult)
      
      case 'seed':
        const seedResult = await seedDefaultData()
        return NextResponse.json(seedResult)
      
      case 'setup':
        // Run full setup: initialize + seed
        const setupInit = await initializeDatabase()
        if (!setupInit.success) {
          return NextResponse.json(setupInit, { status: 500 })
        }
        
        const setupSeed = await seedDefaultData()
        return NextResponse.json({
          success: true,
          message: 'Database setup completed successfully',
          init: setupInit,
          seed: setupSeed,
          timestamp: new Date().toISOString()
        })
      
      default:
        // Default to health check
        const defaultResult = await checkDatabaseHealth()
        return NextResponse.json(defaultResult)
    }
  } catch (error) {
    console.error('Database operation failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'initialize':
        const initResult = await initializeDatabase()
        return NextResponse.json(initResult)
      
      case 'seed':
        const seedResult = await seedDefaultData()
        return NextResponse.json(seedResult)
      
      case 'reset':
        // This is a destructive operation, use with caution
        const resetResult = await initializeDatabase()
        if (resetResult.success) {
          const seedResult = await seedDefaultData()
          return NextResponse.json({
            success: true,
            message: 'Database reset and reseeded successfully',
            timestamp: new Date().toISOString()
          })
        }
        return NextResponse.json(resetResult, { status: 500 })
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Use: initialize, seed, or reset',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Database operation failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
