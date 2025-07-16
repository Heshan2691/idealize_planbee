import { NextRequest, NextResponse } from 'next/server'
import { PomodoroSession } from '@/types'
import { dbService } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')
  const userId = searchParams.get('userId') || 'default'
  const fromDate = searchParams.get('fromDate')
  const toDate = searchParams.get('toDate')

  try {
    let dateRange
    if (fromDate && toDate) {
      dateRange = {
        from: new Date(fromDate),
        to: new Date(toDate)
      }
    }

    const dbSessions = await dbService.getPomodoroSessionsByUserId(userId, dateRange)
    
    let filteredSessions = dbSessions
    if (taskId) {
      filteredSessions = filteredSessions.filter(session => 
        session.taskId?.toString() === taskId
      )
    }

    const sessions = filteredSessions.map(session => ({
      id: session._id.toString(),
      userId: session.userId?.toString(),
      taskId: session.taskId?.toString(),
      duration: session.duration,
      type: session.type,
      status: session.status,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      notes: session.notes,
      subject: session.subject,
      createdAt: session.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: sessions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sessions',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()
    
    const newSessionData = {
      userId: sessionData.userId || 'default',
      taskId: sessionData.taskId,
      duration: sessionData.duration,
      type: sessionData.type,
      status: sessionData.completed ? 'completed' : 
              sessionData.interrupted ? 'interrupted' : 'completed',
      startTime: new Date(sessionData.startTime || Date.now()).toISOString(),
      endTime: new Date(sessionData.endTime || Date.now()).toISOString(),
      notes: sessionData.notes,
      subject: sessionData.subject,
      // Legacy fields for compatibility
      completed: sessionData.completed || false,
      interrupted: sessionData.interrupted || false
    }

    const createdSession = await dbService.createPomodoroSession(newSessionData)

    const responseSession = {
      id: createdSession._id.toString(),
      userId: createdSession.userId?.toString(),
      taskId: createdSession.taskId?.toString(),
      duration: createdSession.duration,
      type: createdSession.type,
      status: createdSession.status,
      startTime: createdSession.startTime.toISOString(),
      endTime: createdSession.endTime.toISOString(),
      notes: createdSession.notes,
      subject: createdSession.subject,
      createdAt: createdSession.createdAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseSession,
      message: 'Session created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating pomodoro session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create session',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionData = await request.json()
    const sessionId = sessionData.id
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = { ...sessionData }
    delete updateData.id
    
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime).toISOString()
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime).toISOString()
    }

    const updatedSession = await dbService.updatePomodoroSession(sessionId, updateData)
    
    if (!updatedSession) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    const responseSession = {
      id: updatedSession._id.toString(),
      userId: updatedSession.userId?.toString(),
      taskId: updatedSession.taskId?.toString(),
      duration: updatedSession.duration,
      type: updatedSession.type,
      status: updatedSession.status,
      startTime: updatedSession.startTime.toISOString(),
      endTime: updatedSession.endTime.toISOString(),
      notes: updatedSession.notes,
      subject: updatedSession.subject,
      createdAt: updatedSession.createdAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseSession,
      message: 'Session updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating pomodoro session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update session',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
