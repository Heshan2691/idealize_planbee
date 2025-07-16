import { NextRequest, NextResponse } from 'next/server'
import { StudyTask } from '@/types'
import { dbService } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const userId = searchParams.get('userId') || 'default'
  const status = searchParams.get('status')
  const subject = searchParams.get('subject')

  try {
    let filters: any = {}
    
    if (status) filters.status = status
    if (subject) filters.subject = subject
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      filters.dueDate = { from: startDate, to: endDate }
    }

    const dbTasks = await dbService.getStudyTasksByUserId(userId, filters)
    
    const tasks = dbTasks.map(task => ({
      id: task._id.toString(),
      userId: task.userId?.toString(),
      roadmapId: task.roadmapId?.toString(),
      milestoneId: task.milestoneId,
      title: task.title,
      description: task.description,
      subject: task.subject,
      type: task.type,
      difficulty: task.difficulty,
      estimatedTime: task.estimatedTime,
      actualTime: task.actualTime,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.toISOString(),
      completedAt: task.completedAt?.toISOString(),
      notes: task.notes,
      tags: task.tags,
      pomodoroSessions: task.pomodoroSessions,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: tasks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tasks',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json()
    
    const newTaskData = {
      userId: taskData.userId || 'default',
      roadmapId: taskData.roadmapId,
      milestoneId: taskData.milestoneId,
      title: taskData.title,
      description: taskData.description,
      subject: taskData.subject,
      type: taskData.type || 'reading',
      difficulty: taskData.difficulty || 'medium',
      estimatedTime: taskData.estimatedTime || taskData.estimatedDuration,
      priority: taskData.priority || 'medium',
      status: 'pending' as const,
      dueDate: new Date(taskData.scheduledDate || taskData.dueDate),
      tags: taskData.tags || [],
      notes: taskData.notes,
      // Additional fields for compatibility
      estimatedDuration: taskData.estimatedTime || taskData.estimatedDuration,
      scheduledDate: taskData.scheduledDate || new Date(taskData.dueDate).toISOString()
    }

    const createdTask = await dbService.createStudyTask(newTaskData)

    const responseTask = {
      id: createdTask._id.toString(),
      userId: createdTask.userId?.toString(),
      roadmapId: createdTask.roadmapId?.toString(),
      milestoneId: createdTask.milestoneId,
      title: createdTask.title,
      description: createdTask.description,
      subject: createdTask.subject,
      type: createdTask.type,
      difficulty: createdTask.difficulty,
      estimatedTime: createdTask.estimatedTime,
      actualTime: createdTask.actualTime,
      priority: createdTask.priority,
      status: createdTask.status,
      dueDate: createdTask.dueDate.toISOString(),
      completedAt: createdTask.completedAt?.toISOString(),
      notes: createdTask.notes,
      tags: createdTask.tags,
      pomodoroSessions: createdTask.pomodoroSessions,
      createdAt: createdTask.createdAt.toISOString(),
      updatedAt: createdTask.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseTask,
      message: 'Task created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create task',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const taskData = await request.json()
    const taskId = taskData.id
    
    if (!taskId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = { ...taskData }
    delete updateData.id
    
    if (updateData.scheduledDate) {
      updateData.dueDate = new Date(updateData.scheduledDate)
      delete updateData.scheduledDate
    }
    
    if (updateData.estimatedDuration) {
      updateData.estimatedTime = updateData.estimatedDuration
    }

    const updatedTask = await dbService.updateStudyTask(taskId, updateData)
    
    if (!updatedTask) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    const responseTask = {
      id: updatedTask._id.toString(),
      userId: updatedTask.userId?.toString(),
      roadmapId: updatedTask.roadmapId?.toString(),
      milestoneId: updatedTask.milestoneId,
      title: updatedTask.title,
      description: updatedTask.description,
      subject: updatedTask.subject,
      type: updatedTask.type,
      difficulty: updatedTask.difficulty,
      estimatedTime: updatedTask.estimatedTime,
      actualTime: updatedTask.actualTime,
      priority: updatedTask.priority,
      status: updatedTask.status,
      dueDate: updatedTask.dueDate.toISOString(),
      completedAt: updatedTask.completedAt?.toISOString(),
      notes: updatedTask.notes,
      tags: updatedTask.tags,
      pomodoroSessions: updatedTask.pomodoroSessions,
      createdAt: updatedTask.createdAt.toISOString(),
      updatedAt: updatedTask.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseTask,
      message: 'Task updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update task',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    
    if (!taskId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    const deletedTask = await dbService.deleteStudyTask(taskId)
    
    if (!deletedTask) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete task',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
