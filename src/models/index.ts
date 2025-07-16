import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Learning Goal Schema
const learningGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  },
  estimatedDuration: { type: Number, required: true }, // in days
  targetDate: { type: Date },
  status: { 
    type: String, 
    enum: ['planning', 'active', 'completed', 'paused'], 
    default: 'planning' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Study Roadmap Schema
const studyRoadmapSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningGoal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  milestones: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedDuration: { type: Number, required: true }, // in hours
    prerequisites: [{ type: String }],
    resources: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      type: { 
        type: String, 
        enum: ['video', 'article', 'book', 'course', 'practice', 'project'], 
        required: true 
      },
      url: { type: String },
      description: { type: String },
      estimatedTime: { type: Number }, // in minutes
      difficulty: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'], 
        required: true 
      },
      isCompleted: { type: Boolean, default: false },
      completedAt: { type: Date }
    }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyTask' }],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    order: { type: Number, required: true }
  }],
  totalEstimatedHours: { type: Number, required: true },
  currentMilestone: { type: Number, default: 0 },
  progressPercentage: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Study Task Schema
const studyTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyRoadmap' },
  milestoneId: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['reading', 'practice', 'project', 'review', 'exercise'], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  estimatedTime: { type: Number, required: true }, // in minutes
  actualTime: { type: Number, default: 0 }, // in minutes
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'skipped'], 
    default: 'pending' 
  },
  dueDate: { type: Date, required: true },
  completedAt: { type: Date },
  notes: { type: String },
  tags: [{ type: String }],
  pomodoroSessions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Pomodoro Session Schema
const pomodoroSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyTask' },
  duration: { type: Number, required: true }, // in minutes
  type: { 
    type: String, 
    enum: ['work', 'short-break', 'long-break'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['completed', 'interrupted', 'skipped'], 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  notes: { type: String },
  subject: { type: String },
  createdAt: { type: Date, default: Date.now }
})

// Subject Schema
const subjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, default: '#6366f1' },
  totalStudyTime: { type: Number, default: 0 }, // in minutes
  tasksCount: { type: Number, default: 0 },
  completedTasksCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Study Analytics Schema
const studyAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  totalStudyTime: { type: Number, default: 0 }, // in minutes
  pomodoroCount: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  subjects: [{
    name: { type: String, required: true },
    studyTime: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Study Preferences Schema
const studyPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studyTimePerDay: { type: Number, default: 120 }, // in minutes
  pomodoroWorkDuration: { type: Number, default: 25 }, // in minutes
  pomodoroShortBreak: { type: Number, default: 5 }, // in minutes
  pomodoroLongBreak: { type: Number, default: 15 }, // in minutes
  sessionsBeforeLongBreak: { type: Number, default: 4 },
  preferredStudyTimes: [{ type: String }], // e.g., ['morning', 'afternoon', 'evening']
  difficultyPreference: { 
    type: String, 
    enum: ['adaptive', 'easy', 'medium', 'hard'], 
    default: 'adaptive' 
  },
  weeklyGoalHours: { type: Number, default: 10 },
  notifications: {
    studyReminders: { type: Boolean, default: true },
    breakReminders: { type: Boolean, default: true },
    goalDeadlines: { type: Boolean, default: true },
    weeklyProgress: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Create models
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const LearningGoal = mongoose.models.LearningGoal || mongoose.model('LearningGoal', learningGoalSchema)
export const StudyRoadmap = mongoose.models.StudyRoadmap || mongoose.model('StudyRoadmap', studyRoadmapSchema)
export const StudyTask = mongoose.models.StudyTask || mongoose.model('StudyTask', studyTaskSchema)
export const PomodoroSession = mongoose.models.PomodoroSession || mongoose.model('PomodoroSession', pomodoroSessionSchema)
export const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema)
export const StudyAnalytics = mongoose.models.StudyAnalytics || mongoose.model('StudyAnalytics', studyAnalyticsSchema)
export const StudyPreferences = mongoose.models.StudyPreferences || mongoose.model('StudyPreferences', studyPreferencesSchema)
