/**
 * Database initialization script for IdealizePlanBee
 * Run this script to set up initial database collections and indexes
 */

import connectToDatabase from './mongodb'
import mongoose from 'mongoose'
import { 
  User, 
  LearningGoal, 
  StudyRoadmap, 
  StudyTask, 
  PomodoroSession, 
  Subject, 
  StudyAnalytics, 
  StudyPreferences 
} from '../models'

export async function initializeDatabase() {
  try {
    console.log('Connecting to database...')
    await connectToDatabase()
    
    console.log('Creating database indexes...')
    
    // User indexes
    await User.createIndexes()
    
    // Learning Goal indexes
    await LearningGoal.collection.createIndex({ userId: 1, status: 1 })
    await LearningGoal.collection.createIndex({ createdAt: -1 })
    
    // Study Roadmap indexes
    await StudyRoadmap.collection.createIndex({ goalId: 1 })
    await StudyRoadmap.collection.createIndex({ userId: 1 })
    await StudyRoadmap.collection.createIndex({ 'milestones.isCompleted': 1 })
    
    // Study Task indexes
    await StudyTask.collection.createIndex({ userId: 1, status: 1 })
    await StudyTask.collection.createIndex({ userId: 1, dueDate: 1 })
    await StudyTask.collection.createIndex({ roadmapId: 1 })
    await StudyTask.collection.createIndex({ subject: 1 })
    await StudyTask.collection.createIndex({ priority: 1, dueDate: 1 })
    
    // Pomodoro Session indexes
    await PomodoroSession.collection.createIndex({ userId: 1, startTime: -1 })
    await PomodoroSession.collection.createIndex({ taskId: 1 })
    await PomodoroSession.collection.createIndex({ userId: 1, type: 1 })
    
    // Subject indexes
    await Subject.collection.createIndex({ userId: 1, isActive: 1 })
    await Subject.collection.createIndex({ name: 1 })
    
    // Study Analytics indexes
    await StudyAnalytics.collection.createIndex({ userId: 1, date: -1 })
    await StudyAnalytics.collection.createIndex({ date: 1 })
    
    // Study Preferences indexes
    await StudyPreferences.collection.createIndex({ userId: 1 }, { unique: true })
    
    console.log('Database initialization completed successfully!')
    
    return {
      success: true,
      message: 'Database initialized with all collections and indexes'
    }
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function seedDefaultData() {
  try {
    console.log('Seeding default data...')
    
    // Create a default user for development
    const defaultUser = await User.findOne({ email: 'demo@idealizeplanbee.com' })
    
    if (!defaultUser) {
      const newUser = new User({
        email: 'demo@idealizeplanbee.com',
        name: 'Demo User'
      })
      await newUser.save()
      console.log('Created default demo user')
      
      // Create default subjects for the demo user
      const defaultSubjects = [
        { name: 'Mathematics', color: '#3B82F6', description: 'Mathematical concepts and problem-solving' },
        { name: 'Science', color: '#10B981', description: 'Scientific principles and research' },
        { name: 'History', color: '#F59E0B', description: 'Historical events and analysis' },
        { name: 'English', color: '#EF4444', description: 'Language arts and literature' },
        { name: 'Programming', color: '#8B5CF6', description: 'Software development and coding' }
      ]
      
      for (const subjectData of defaultSubjects) {
        const subject = new Subject({
          userId: newUser._id,
          ...subjectData,
          totalStudyTime: 0,
          tasksCount: 0,
          completedTasksCount: 0,
          isActive: true
        })
        await subject.save()
      }
      
      console.log('Created default subjects for demo user')
      
      // Create default study preferences
      const preferences = new StudyPreferences({
        userId: newUser._id,
        studyTimePerDay: 120,
        pomodoroWorkDuration: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15,
        sessionsBeforeLongBreak: 4,
        preferredStudyTimes: ['morning', 'evening'],
        difficultyPreference: 'adaptive',
        weeklyGoalHours: 10,
        notifications: {
          studyReminders: true,
          breakReminders: true,
          goalDeadlines: true,
          weeklyProgress: true
        }
      })
      await preferences.save()
      
      console.log('Created default study preferences for demo user')
    }
    
    console.log('Default data seeding completed!')
    
    return {
      success: true,
      message: 'Default data seeded successfully'
    }
    
  } catch (error) {
    console.error('Data seeding failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await connectToDatabase()
    
    const collections = await mongoose.connection.db.listCollections().toArray()
    const stats = await mongoose.connection.db.stats()
    
    return {
      success: true,
      status: 'healthy',
      collections: collections.map(c => c.name),
      stats: {
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        collections: stats.collections
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(result => {
      console.log('Initialization result:', result)
      return seedDefaultData()
    })
    .then(result => {
      console.log('Seeding result:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}
