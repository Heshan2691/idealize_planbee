import { NextRequest, NextResponse } from 'next/server'
import { Subject } from '@/types'
import { dbService } from '@/lib/database'

// Default subjects to create for new users
const defaultSubjects = [
  { 
    name: 'Mathematics', 
    color: '#3B82F6', 
    description: 'Mathematical concepts and problem-solving',
    totalStudyTime: 0
  },
  { 
    name: 'Science', 
    color: '#10B981', 
    description: 'Scientific principles and research',
    totalStudyTime: 0
  },
  { 
    name: 'History', 
    color: '#F59E0B', 
    description: 'Historical events and analysis',
    totalStudyTime: 0
  },
  { 
    name: 'English', 
    color: '#EF4444', 
    description: 'Language arts and literature',
    totalStudyTime: 0
  },
  { 
    name: 'Programming', 
    color: '#8B5CF6', 
    description: 'Software development and coding',
    totalStudyTime: 0
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  try {
    const dbSubjects = await dbService.getSubjectsByUserId(userId)
    
    // If no subjects exist for user, create default subjects
    if (dbSubjects.length === 0) {
      const createdSubjects = await Promise.all(
        defaultSubjects.map(subject => 
          dbService.createSubject({ ...subject, userId })
        )
      )
      
      const subjects = createdSubjects.map(subject => ({
        id: subject._id.toString(),
        userId: subject.userId?.toString(),
        name: subject.name,
        description: subject.description,
        color: subject.color,
        totalStudyTime: subject.totalStudyTime,
        tasksCount: subject.tasksCount,
        completedTasksCount: subject.completedTasksCount,
        isActive: subject.isActive,
        createdAt: subject.createdAt.toISOString(),
        updatedAt: subject.updatedAt.toISOString()
      }))
      
      return NextResponse.json({
        success: true,
        data: subjects,
        timestamp: new Date().toISOString()
      })
    }

    const subjects = dbSubjects.map(subject => ({
      id: subject._id.toString(),
      userId: subject.userId?.toString(),
      name: subject.name,
      description: subject.description,
      color: subject.color,
      totalStudyTime: subject.totalStudyTime,
      tasksCount: subject.tasksCount,
      completedTasksCount: subject.completedTasksCount,
      isActive: subject.isActive,
      createdAt: subject.createdAt.toISOString(),
      updatedAt: subject.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: subjects,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subjects',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const subjectData = await request.json()
    
    const newSubjectData = {
      userId: subjectData.userId || 'default',
      name: subjectData.name,
      description: subjectData.description,
      color: subjectData.color || '#6B7280',
      totalStudyTime: 0,
      tasksCount: 0,
      completedTasksCount: 0,
      isActive: true
    }

    const createdSubject = await dbService.createSubject(newSubjectData)

    const responseSubject = {
      id: createdSubject._id.toString(),
      userId: createdSubject.userId?.toString(),
      name: createdSubject.name,
      description: createdSubject.description,
      color: createdSubject.color,
      totalStudyTime: createdSubject.totalStudyTime,
      tasksCount: createdSubject.tasksCount,
      completedTasksCount: createdSubject.completedTasksCount,
      isActive: createdSubject.isActive,
      createdAt: createdSubject.createdAt.toISOString(),
      updatedAt: createdSubject.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseSubject,
      message: 'Subject created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create subject',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const subjectData = await request.json()
    const subjectId = subjectData.id
    
    if (!subjectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Subject ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = { ...subjectData }
    delete updateData.id

    const updatedSubject = await dbService.updateSubject(subjectId, updateData)
    
    if (!updatedSubject) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Subject not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    const responseSubject = {
      id: updatedSubject._id.toString(),
      userId: updatedSubject.userId?.toString(),
      name: updatedSubject.name,
      description: updatedSubject.description,
      color: updatedSubject.color,
      totalStudyTime: updatedSubject.totalStudyTime,
      tasksCount: updatedSubject.tasksCount,
      completedTasksCount: updatedSubject.completedTasksCount,
      isActive: updatedSubject.isActive,
      createdAt: updatedSubject.createdAt.toISOString(),
      updatedAt: updatedSubject.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseSubject,
      message: 'Subject updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update subject',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('id')
    
    if (!subjectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Subject ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    const deletedSubject = await dbService.deleteSubject(subjectId)
    
    if (!deletedSubject) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Subject not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subject deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete subject',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
}
