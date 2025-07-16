import connectToDatabase from './mongodb'
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
import { 
  LearningGoal as ILearningGoal,
  StudyRoadmap as IStudyRoadmap,
  StudyTask as IStudyTask,
  PomodoroSession as IPomodoroSession,
  Subject as ISubject,
  StudyAnalytics as IStudyAnalytics,
  StudyPreferences as IStudyPreferences
} from '../types'

export class DatabaseService {
  async connect() {
    return await connectToDatabase()
  }

  // User operations
  async createUser(userData: { email: string; name: string }) {
    await this.connect()
    const user = new User(userData)
    return await user.save()
  }

  async getUserById(id: string) {
    await this.connect()
    return await User.findById(id)
  }

  async getUserByEmail(email: string) {
    await this.connect()
    return await User.findOne({ email })
  }

  // Learning Goal operations
  async createLearningGoal(goalData: Omit<ILearningGoal, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.connect()
    const goal = new LearningGoal({
      ...goalData,
      updatedAt: new Date()
    })
    return await goal.save()
  }

  async getLearningGoalsByUserId(userId: string) {
    await this.connect()
    return await LearningGoal.find({ userId }).sort({ createdAt: -1 })
  }

  async updateLearningGoal(id: string, updates: Partial<ILearningGoal>) {
    await this.connect()
    return await LearningGoal.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() }, 
      { new: true }
    )
  }

  async deleteLearningGoal(id: string) {
    await this.connect()
    return await LearningGoal.findByIdAndDelete(id)
  }

  // Study Roadmap operations
  async createStudyRoadmap(roadmapData: Omit<IStudyRoadmap, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.connect()
    const roadmap = new StudyRoadmap({
      ...roadmapData,
      updatedAt: new Date()
    })
    return await roadmap.save()
  }

  async getStudyRoadmapByGoalId(goalId: string) {
    await this.connect()
    return await StudyRoadmap.findOne({ goalId }).populate('goalId')
  }

  async getStudyRoadmapsByUserId(userId: string) {
    await this.connect()
    return await StudyRoadmap.find({ userId }).populate('goalId').sort({ createdAt: -1 })
  }

  async updateStudyRoadmap(id: string, updates: Partial<IStudyRoadmap>) {
    await this.connect()
    return await StudyRoadmap.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() }, 
      { new: true }
    )
  }

  async updateRoadmapProgress(roadmapId: string, milestoneIndex: number, progressData: any) {
    await this.connect()
    const roadmap = await StudyRoadmap.findById(roadmapId)
    if (!roadmap) throw new Error('Roadmap not found')

    if (roadmap.milestones[milestoneIndex]) {
      roadmap.milestones[milestoneIndex] = { ...roadmap.milestones[milestoneIndex], ...progressData }
      roadmap.updatedAt = new Date()
      return await roadmap.save()
    }
    throw new Error('Milestone not found')
  }

  // Study Task operations
  async createStudyTask(taskData: Omit<IStudyTask, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.connect()
    const task = new StudyTask({
      ...taskData,
      updatedAt: new Date()
    })
    return await task.save()
  }

  async getStudyTasksByUserId(userId: string, filters?: { 
    status?: string; 
    subject?: string; 
    dueDate?: { from?: Date; to?: Date } 
  }) {
    await this.connect()
    let query: any = { userId }
    
    if (filters?.status) query.status = filters.status
    if (filters?.subject) query.subject = filters.subject
    if (filters?.dueDate) {
      query.dueDate = {}
      if (filters.dueDate.from) query.dueDate.$gte = filters.dueDate.from
      if (filters.dueDate.to) query.dueDate.$lte = filters.dueDate.to
    }

    return await StudyTask.find(query).sort({ dueDate: 1, priority: -1 })
  }

  async updateStudyTask(id: string, updates: Partial<IStudyTask>) {
    await this.connect()
    return await StudyTask.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() }, 
      { new: true }
    )
  }

  async deleteStudyTask(id: string) {
    await this.connect()
    return await StudyTask.findByIdAndDelete(id)
  }

  // Pomodoro Session operations
  async createPomodoroSession(sessionData: Omit<IPomodoroSession, 'id' | 'createdAt'>) {
    await this.connect()
    const session = new PomodoroSession(sessionData)
    return await session.save()
  }

  async getPomodoroSessionsByUserId(userId: string, dateRange?: { from: Date; to: Date }) {
    await this.connect()
    let query: any = { userId }
    
    if (dateRange) {
      query.startTime = {
        $gte: dateRange.from,
        $lte: dateRange.to
      }
    }

    return await PomodoroSession.find(query).populate('taskId').sort({ startTime: -1 })
  }

  async updatePomodoroSession(id: string, updates: Partial<IPomodoroSession>) {
    await this.connect()
    return await PomodoroSession.findByIdAndUpdate(id, updates, { new: true })
  }

  // Subject operations
  async createSubject(subjectData: Omit<ISubject, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.connect()
    const subject = new Subject({
      ...subjectData,
      updatedAt: new Date()
    })
    return await subject.save()
  }

  async getSubjectsByUserId(userId: string) {
    await this.connect()
    return await Subject.find({ userId, isActive: true }).sort({ name: 1 })
  }

  async updateSubject(id: string, updates: Partial<ISubject>) {
    await this.connect()
    return await Subject.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: new Date() }, 
      { new: true }
    )
  }

  async deleteSubject(id: string) {
    await this.connect()
    return await Subject.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date() })
  }

  // Study Analytics operations
  async createOrUpdateDailyAnalytics(userId: string, date: Date, analyticsData: Partial<IStudyAnalytics>) {
    await this.connect()
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await StudyAnalytics.findOneAndUpdate(
      { 
        userId, 
        date: { $gte: startOfDay, $lte: endOfDay } 
      },
      { 
        ...analyticsData, 
        date: startOfDay, 
        updatedAt: new Date() 
      },
      { 
        new: true, 
        upsert: true 
      }
    )
  }

  async getAnalyticsByUserId(userId: string, dateRange: { from: Date; to: Date }) {
    await this.connect()
    return await StudyAnalytics.find({
      userId,
      date: {
        $gte: dateRange.from,
        $lte: dateRange.to
      }
    }).sort({ date: 1 })
  }

  // Study Preferences operations
  async createOrUpdateStudyPreferences(userId: string, preferencesData: Partial<IStudyPreferences>) {
    await this.connect()
    return await StudyPreferences.findOneAndUpdate(
      { userId },
      { 
        ...preferencesData, 
        userId, 
        updatedAt: new Date() 
      },
      { 
        new: true, 
        upsert: true 
      }
    )
  }

  async getStudyPreferencesByUserId(userId: string) {
    await this.connect()
    return await StudyPreferences.findOne({ userId })
  }

  // Analytics and Reporting
  async getUserStudyStats(userId: string, timeframe: 'week' | 'month' | 'year' = 'week') {
    await this.connect()
    
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const [analytics, totalTasks, completedTasks, activeSessions] = await Promise.all([
      this.getAnalyticsByUserId(userId, { from: startDate, to: now }),
      StudyTask.countDocuments({ userId, createdAt: { $gte: startDate } }),
      StudyTask.countDocuments({ userId, status: 'completed', completedAt: { $gte: startDate } }),
      PomodoroSession.countDocuments({ userId, startTime: { $gte: startDate } })
    ])

    const totalStudyTime = analytics.reduce((sum, day) => sum + day.totalStudyTime, 0)
    const totalPomodoros = analytics.reduce((sum, day) => sum + day.pomodoroCount, 0)

    return {
      totalStudyTime,
      totalPomodoros,
      totalTasks,
      completedTasks,
      activeSessions,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      dailyAverage: analytics.length > 0 ? totalStudyTime / analytics.length : 0,
      analytics
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService()
