import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Hello from Idealize PlanBee API!',
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: request.url
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'Hello from Idealize PlanBee API!',
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedData: body,
      url: request.url
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }
}
