import { NextRequest, NextResponse } from 'next/server'
import { StudyRoadmap } from '@/types'

// In a real application, this would be stored in a database
let roadmaps: StudyRoadmap[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const goalId = searchParams.get('goalId')

  try {
    if (goalId) {
      const roadmap = roadmaps.find(r => r.goalId === goalId)
      if (!roadmap) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Roadmap not found',
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: roadmap,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      data: roadmaps,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch roadmap',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    const { searchParams } = new URL(request.url)
    const roadmapId = searchParams.get('id')

    if (!roadmapId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Roadmap ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    const roadmapIndex = roadmaps.findIndex(roadmap => roadmap.id === roadmapId)
    
    if (roadmapIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Roadmap not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    roadmaps[roadmapIndex] = {
      ...roadmaps[roadmapIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: roadmaps[roadmapIndex],
      message: 'Roadmap updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update roadmap',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
