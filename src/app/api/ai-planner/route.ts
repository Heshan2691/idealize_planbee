import { NextRequest, NextResponse } from 'next/server'
import { LearningGoal, StudyRoadmap } from '@/types'
import { AIStudyPlannerService } from '@/lib/aiStudyPlanner'
import { dbService } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'

  try {
    const userGoals = await dbService.getLearningGoalsByUserId(userId)
    
    const goalsWithRoadmaps = await Promise.all(
      userGoals.map(async (goal) => {
        const roadmap = await dbService.getStudyRoadmapByGoalId(goal._id.toString())
        return {
          goal: {
            id: goal._id.toString(),
            userId: goal.userId?.toString(),
            title: goal.title,
            description: goal.description,
            category: goal.category,
            difficulty: goal.difficulty,
            estimatedDuration: goal.estimatedDuration,
            targetDate: goal.targetDate?.toISOString(),
            status: goal.status,
            createdAt: goal.createdAt.toISOString(),
            updatedAt: goal.updatedAt.toISOString()
          },
          roadmap: roadmap ? {
            id: roadmap._id.toString(),
            goalId: roadmap.goalId.toString(),
            userId: roadmap.userId?.toString(),
            title: roadmap.title,
            description: roadmap.description,
            milestones: roadmap.milestones,
            totalEstimatedHours: roadmap.totalEstimatedHours,
            currentMilestone: roadmap.currentMilestone,
            progressPercentage: roadmap.progressPercentage,
            isCompleted: roadmap.isCompleted,
            completedAt: roadmap.completedAt?.toISOString(),
            createdAt: roadmap.createdAt.toISOString(),
            updatedAt: roadmap.updatedAt.toISOString()
          } : null,
          hasRoadmap: !!roadmap
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: goalsWithRoadmaps,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching learning goals:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch learning goals',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { goal, adaptiveSettings } = await request.json()
    
    // Create the learning goal in database
    const newGoalData = {
      userId: goal.userId || 'default',
      title: goal.title,
      description: goal.description,
      category: goal.category,
      difficulty: goal.difficulty,
      estimatedDuration: 0, // Will be calculated by AI
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString() : undefined,
      status: 'planning' as const
    }

    const createdGoal = await dbService.createLearningGoal(newGoalData)

    // Generate AI study roadmap
    const goalForAI: LearningGoal = {
      id: createdGoal._id.toString(),
      userId: createdGoal.userId?.toString(),
      title: createdGoal.title,
      description: createdGoal.description,
      category: createdGoal.category,
      difficulty: createdGoal.difficulty,
      estimatedDuration: createdGoal.estimatedDuration,
      targetDate: createdGoal.targetDate?.toISOString(),
      status: createdGoal.status,
      createdAt: createdGoal.createdAt.toISOString(),
      updatedAt: createdGoal.updatedAt.toISOString()
    }

    const roadmap = await AIStudyPlannerService.generateStudyRoadmap(goalForAI, adaptiveSettings)
    
    // Save roadmap to database
    const roadmapData = {
      goalId: createdGoal._id,
      userId: createdGoal.userId,
      title: roadmap.title,
      description: roadmap.description,
      milestones: roadmap.milestones,
      totalEstimatedHours: roadmap.totalDuration,
      totalDuration: roadmap.totalDuration,
      adaptiveSettings: adaptiveSettings,
      currentMilestone: 0,
      progressPercentage: 0,
      isCompleted: false
    }

    const createdRoadmap = await dbService.createStudyRoadmap(roadmapData)

    // Update goal with estimated duration and active status
    const updatedGoal = await dbService.updateLearningGoal(createdGoal._id.toString(), {
      estimatedDuration: roadmap.totalDuration,
      status: 'active'
    })

    return NextResponse.json({
      success: true,
      data: {
        goal: {
          id: updatedGoal._id.toString(),
          userId: updatedGoal.userId?.toString(),
          title: updatedGoal.title,
          description: updatedGoal.description,
          category: updatedGoal.category,
          difficulty: updatedGoal.difficulty,
          estimatedDuration: updatedGoal.estimatedDuration,
          targetDate: updatedGoal.targetDate?.toISOString(),
          status: updatedGoal.status,
          createdAt: updatedGoal.createdAt.toISOString(),
          updatedAt: updatedGoal.updatedAt.toISOString()
        },
        roadmap: {
          id: createdRoadmap._id.toString(),
          goalId: createdRoadmap.goalId.toString(),
          userId: createdRoadmap.userId?.toString(),
          title: createdRoadmap.title,
          description: createdRoadmap.description,
          milestones: createdRoadmap.milestones,
          totalEstimatedHours: createdRoadmap.totalEstimatedHours,
          currentMilestone: createdRoadmap.currentMilestone,
          progressPercentage: createdRoadmap.progressPercentage,
          isCompleted: createdRoadmap.isCompleted,
          completedAt: createdRoadmap.completedAt?.toISOString(),
          createdAt: createdRoadmap.createdAt.toISOString(),
          updatedAt: createdRoadmap.updatedAt.toISOString()
        }
      },
      message: 'Study plan generated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating study plan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate study plan',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { goalId, updates } = await request.json()
    
    // Update the learning goal in database
    const updatedGoal = await dbService.updateLearningGoal(goalId, updates)
    
    if (!updatedGoal) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Learning goal not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedGoal._id.toString(),
        userId: updatedGoal.userId?.toString(),
        title: updatedGoal.title,
        description: updatedGoal.description,
        category: updatedGoal.category,
        difficulty: updatedGoal.difficulty,
        estimatedDuration: updatedGoal.estimatedDuration,
        targetDate: updatedGoal.targetDate?.toISOString(),
        status: updatedGoal.status,
        createdAt: updatedGoal.createdAt.toISOString(),
        updatedAt: updatedGoal.updatedAt.toISOString()
      },
      message: 'Learning goal updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating learning goal:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update learning goal',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
