# Idealize PlanBee - AI-Powered Study Planner

An intelligent study planning application that uses AI to create personalized learning roadmaps and adapts based on your progress. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB, featuring a sophisticated Pomodoro timer and adaptive scheduling system.

## 🚀 New: MongoDB Integration

### 📊 Complete Data Persistence

All your study data is now securely stored in MongoDB:

- ✅ AI-generated learning goals and roadmaps
- ✅ Study tasks with progress tracking
- ✅ Pomodoro sessions and time analytics
- ✅ Subject organization and statistics
- ✅ User preferences and adaptive settings
- ✅ Daily study analytics and insights

### 🗄️ Database Features

- **Optimized Performance**: Efficient indexes for fast queries
- **Scalable Architecture**: MongoDB collections designed for growth
- **Data Integrity**: Comprehensive validation and error handling
- **Real-time Sync**: Instant updates across all components
- **Analytics Ready**: Built-in aggregation for study insights

## 🤖 AI-Powered Features

### 🧠 Intelligent Study Planning

- **AI Roadmap Generation** - Tell the AI what you want to learn, and it creates a comprehensive study plan
- **Personalized Learning Paths** - Customized based on your experience level, available time, and learning style
- **Adaptive Scheduling** - AI adjusts your schedule based on progress and performance
- **Smart Recommendations** - Get suggestions for optimal study times and difficulty adjustments

### 📈 Progress-Based Adaptation

- **Performance Tracking** - Monitor comprehension and difficulty ratings for each session
- **Dynamic Rescheduling** - Automatically reschedule missed sessions and adapt to your pace
- **Intelligent Milestones** - AI breaks down complex topics into manageable learning milestones
- **Resource Optimization** - Curated learning resources based on your learning style preferences

## 📚 Core Study Features

### 🎯 Goal-Oriented Learning

- **Learning Goal Creation** - Set clear, measurable learning objectives
- **Category-Based Planning** - Choose from Programming, Data Science, Mathematics, Languages, and more
- **Difficulty Assessment** - AI adapts content based on your current skill level
- **Timeline Management** - Flexible scheduling with target completion dates

### 🗺️ Interactive Study Roadmaps

- **Visual Progress Tracking** - See your learning journey with interactive milestone maps
- **Structured Learning Path** - Step-by-step progression through carefully sequenced topics
- **Resource Integration** - Videos, articles, exercises, and projects integrated into each milestone
- **Skill Development** - Track specific skills you're building throughout your journey

### 🍅 Advanced Pomodoro System

- **Task-Linked Sessions** - Pomodoro sessions automatically linked to specific study tasks
- **Customizable Timers** - Adjust work/break durations based on your preferences
- **Session Analytics** - Track completion rates and study patterns
- **Smart Break Suggestions** - AI-recommended break activities based on study intensity

### 📊 Comprehensive Analytics

- **Learning Analytics** - Detailed insights into your study patterns and progress
- **Time Management** - Compare estimated vs actual study time for better planning
- **Performance Metrics** - Track comprehension rates and learning velocity
- **Goal Achievement** - Monitor progress towards your learning objectives

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API Routes
│   │   ├── ai-planner/      # AI study plan generation
│   │   ├── roadmap/         # Study roadmap management
│   │   ├── tasks/           # Study task CRUD operations
│   │   ├── pomodoro/        # Pomodoro session tracking
│   │   ├── subjects/        # Subject management
│   │   └── health/          # System health checks
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root application layout
│   └── page.tsx             # Main application entry point
├── components/              # React Components
│   ├── AIStudyPlanner.tsx      # AI-powered plan creation wizard
│   ├── StudyRoadmapView.tsx    # Interactive roadmap visualization
│   ├── EnhancedStudyDashboard.tsx # Main dashboard with AI features
│   ├── PomodoroTimer.tsx       # Advanced Pomodoro timer
│   ├── StudyTaskCard.tsx       # Individual task management
│   ├── TaskForm.tsx            # Task creation/editing forms
│   ├── StudyDashboard.tsx      # Traditional study dashboard
│   └── UI Components/          # Reusable UI elements
├── lib/                     # Core Logic & Services
│   ├── aiStudyPlanner.ts       # AI study planning service
│   ├── api.ts                  # API client and utilities
│   └── utils.ts                # Common utility functions
└── types/                   # TypeScript Definitions
    └── index.ts                # All type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- MongoDB Atlas account (for cloud database) or local MongoDB installation

### Database Setup

#### Option 1: MongoDB Atlas (Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster and database
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

#### Option 2: Local MongoDB

1. Install MongoDB locally following [official instructions](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service: `mongod`
3. Your connection string will be: `mongodb://localhost:27017/idealize_planbee`

### Environment Configuration

Copy `.env.example` to `.env.local` and configure your database:

```bash
# MongoDB Database
DATABASE_URL="mongodb://localhost:27017/idealize_planbee"
# OR for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/idealize_planbee?retryWrites=true&w=majority"

# Optional: AI API Keys for enhanced features
OPENAI_API_KEY="your_openai_api_key_here"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# Application Settings
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
AI_STUDY_PLANNER_ENABLED="true"
```

### Quick Start

1. **Clone the repository:**

```bash
git clone <repository-url>
cd idealize_planbee
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

4. **Initialize the database:**

```bash
# Automatic setup (creates collections, indexes, and sample data)
npm run db:init
npm run db:seed

# Or visit http://localhost:3000/api/database?action=setup after starting the server
```

5. **Start the development server:**

```bash
npm run dev
```

6. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

### Database Management Commands

```bash
# Initialize database collections and indexes
npm run db:init

# Seed database with default subjects and demo user
npm run db:seed

# Check database health via API
curl http://localhost:3000/api/database?action=health
```

### First Time Setup

1. **Create Your First Study Plan:**

   - Click "Create Your First Study Plan"
   - Tell the AI what you want to learn
   - Set your preferences (study time, schedule, learning style)
   - Let the AI generate your personalized roadmap

2. **Start Learning:**
   - Follow your generated roadmap
   - Use the Pomodoro timer for focused study sessions
   - Track your progress and let the AI adapt your plan

## 🎯 How to Use

### Creating an AI Study Plan

1. **Define Your Goal:**

   - Enter what you want to learn (e.g., "Learn React and Next.js for Web Development")
   - Provide context about your current knowledge level
   - Select the appropriate category and difficulty

2. **Set Your Preferences:**

   - Choose daily study time (30 min - 4+ hours)
   - Select study days per week (3-7 days)
   - Pick your learning style (Visual, Auditory, Kinesthetic, Mixed)
   - Configure adaptive settings

3. **Generate Your Roadmap:**
   - AI analyzes your input and creates a structured learning path
   - Roadmap includes milestones, resources, and practice tasks
   - Estimated timeline based on your availability

### Following Your Study Plan

1. **Navigate Your Roadmap:**

   - View all milestones in your learning journey
   - See prerequisites and skill progression
   - Access curated resources for each topic

2. **Daily Study Sessions:**

   - Switch to "Daily Study" tab for task management
   - Use Pomodoro timer for focused study sessions
   - Complete tasks and track your progress

3. **Adaptive Learning:**
   - Rate difficulty and comprehension after each session
   - AI automatically adjusts future schedules based on performance
   - Get recommendations for optimal study patterns

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## 🔌 API Endpoints

### AI Study Planning

- `POST /api/ai-planner` - Generate AI study plan
- `GET /api/ai-planner` - Get user's learning goals
- `PUT /api/ai-planner` - Update learning goal

### Roadmap Management

- `GET /api/roadmap?goalId={id}` - Get study roadmap
- `PUT /api/roadmap?id={id}` - Update roadmap progress

### Study Tasks & Progress

- `GET /api/tasks?date={date}` - Get daily tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks` - Update task progress
- `DELETE /api/tasks?id={id}` - Delete task

### Pomodoro Sessions

- `GET /api/pomodoro?taskId={id}` - Get session history
- `POST /api/pomodoro` - Record study session
- `PUT /api/pomodoro` - Update session data

## 🎨 Customization

### Learning Categories

The AI currently supports these learning categories:

- Programming & Development
- Data Science & AI
- Mathematics
- Languages
- Science
- Business & Finance
- Design & Creativity
- Personal Development
- Health & Fitness
- Music & Arts

### AI Model Configuration

```env
AI_STUDY_PLANNER_ENABLED="true"
AI_MODEL_PROVIDER="openai" # or "anthropic"
AI_MODEL_NAME="gpt-3.5-turbo"
```

## 🔮 Future Enhancements

### Planned AI Features

- **Integration with real AI services** (OpenAI, Claude, etc.)
- **Advanced learning analytics** with ML insights
- **Collaborative study groups** with AI moderation
- **Personalized learning paths** based on learning patterns
- **Smart content recommendations** from external sources

### Advanced Features

- **Calendar integration** for automatic scheduling
- **Mobile companion app** for on-the-go learning
- **Gamification elements** with achievements and leaderboards
- **Study buddy matching** based on learning goals
- **Progress sharing** and community features

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes:** `git commit -m 'Add amazing feature'`
5. **Push to the branch:** `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure responsive design for all components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Inspired by the Pomodoro Technique and evidence-based learning strategies

---

**Ready to revolutionize your learning journey? Start creating your first AI-powered study plan today!** 🚀
