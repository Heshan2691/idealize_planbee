// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  environment: string
  version: string
  services: {
    database: string
    cache: string
    external_api: string
  }
}

// AI Study Planning Types
export interface LearningGoal {
  id: string
  userId?: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number // in days
  targetDate?: string
  status: 'planning' | 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
}

export interface StudyRoadmap {
  id: string
  goalId: string
  title: string
  description: string
  totalDuration: number // in days
  milestones: Milestone[]
  adaptiveSettings: AdaptiveSettings
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  order: number
  estimatedDays: number
  prerequisites?: string[]
  skills: string[]
  resources: Resource[]
  tasks: StudyTask[]
  status: 'pending' | 'in-progress' | 'completed'
}

export interface Resource {
  id: string
  title: string
  type: 'video' | 'article' | 'book' | 'exercise' | 'quiz' | 'project'
  url?: string
  duration?: number // in minutes
  difficulty: 'easy' | 'medium' | 'hard'
  priority: 'required' | 'recommended' | 'optional'
}

export interface AdaptiveSettings {
  dailyStudyTime: number // in minutes
  studyDaysPerWeek: number
  difficultyPreference: 'gradual' | 'balanced' | 'intensive'
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  rescheduleOnMissedDays: boolean
  adaptBasedOnProgress: boolean
}

export interface DailyProgress {
  id: string
  userId?: string
  date: string
  goalId: string
  milestoneId?: string
  tasksCompleted: number
  totalTasks: number
  studyTimeMinutes: number
  targetStudyTime: number
  difficultyRating?: number // 1-5 scale
  comprehensionRating?: number // 1-5 scale
  notes?: string
  createdAt: string
}

export interface AIRecommendation {
  id: string
  type: 'schedule_adjustment' | 'difficulty_change' | 'resource_suggestion' | 'break_recommendation'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionRequired: boolean
  goalId?: string
  milestoneId?: string
  createdAt: string
}

// Study Planning Types (Updated)
export interface StudyTask {
  id: string
  userId?: string
  goalId?: string
  milestoneId?: string
  title: string
  description?: string
  subject: string
  priority: 'low' | 'medium' | 'high'
  estimatedDuration: number // in minutes
  actualDuration?: number // in minutes
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  scheduledDate: string
  createdAt: string
  updatedAt: string
  pomodoroSessions?: PomodoroSession[]
  resourceIds?: string[]
  skillsToLearn?: string[]
  difficultyRating?: number // 1-5 scale
}

export interface StudyPlan {
  id: string
  userId: string
  date: string
  tasks: StudyTask[]
  totalEstimatedTime: number
  totalActualTime: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

// Pomodoro Timer Types
export interface PomodoroSession {
  id: string
  taskId: string
  type: 'work' | 'short-break' | 'long-break'
  duration: number // in minutes
  startTime: string
  endTime?: string
  completed: boolean
  interrupted: boolean
}

export interface PomodoroSettings {
  workDuration: number // default 25 minutes
  shortBreakDuration: number // default 5 minutes
  longBreakDuration: number // default 15 minutes
  sessionsUntilLongBreak: number // default 4
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
}

export interface PomodoroState {
  isActive: boolean
  isPaused: boolean
  currentSession: PomodoroSession | null
  timeRemaining: number // in seconds
  currentCycle: number
  settings: PomodoroSettings
}

// Subject Types
export interface Subject {
  id: string
  name: string
  color: string
  icon?: string
  totalStudyTime: number
  createdAt: string
}

// Study Analytics Types
export interface StudyAnalytics {
  id: string
  userId?: string
  date: string
  totalStudyTime: number // in minutes
  pomodoroCount: number
  tasksCompleted: number
  streakDays: number
  subjects: {
    name: string
    studyTime: number
  }[]
  createdAt: string
  updatedAt: string
}

// Study Preferences Types
export interface StudyPreferences {
  id: string
  userId?: string
  studyTimePerDay: number // in minutes
  pomodoroWorkDuration: number // in minutes
  pomodoroShortBreak: number // in minutes
  pomodoroLongBreak: number // in minutes
  sessionsBeforeLongBreak: number
  preferredStudyTimes: string[] // e.g., ['morning', 'afternoon', 'evening']
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard'
  weeklyGoalHours: number
  notifications: {
    studyReminders: boolean
    breakReminders: boolean
    goalDeadlines: boolean
    weeklyProgress: boolean
  }
  createdAt: string
  updatedAt: string
}

// Common utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
