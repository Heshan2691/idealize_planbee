"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Target, TrendingUp } from "lucide-react";
import PomodoroTimer from "./PomodoroTimer";
import StudyTaskCard from "./StudyTaskCard";
import TaskForm from "./TaskForm";
import { StudyTask, Subject, PomodoroSession } from "@/types";

// Mock data - in a real app, this would come from your API
const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    color: "#3B82F6",
    totalStudyTime: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Science",
    color: "#10B981",
    totalStudyTime: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "History",
    color: "#F59E0B",
    totalStudyTime: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "English",
    color: "#EF4444",
    totalStudyTime: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Programming",
    color: "#8B5CF6",
    totalStudyTime: 0,
    createdAt: new Date().toISOString(),
  },
];

export default function StudyDashboard() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [activeTask, setActiveTask] = useState<StudyTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("study-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("study-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (taskData: Partial<StudyTask>) => {
    if (editingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setEditingTask(null);
    } else {
      // Add new task
      const newTask: StudyTask = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description,
        subject: taskData.subject!,
        priority: taskData.priority!,
        estimatedDuration: taskData.estimatedDuration!,
        status: "pending",
        scheduledDate: taskData.scheduledDate!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pomodoroSessions: [],
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setIsTaskFormOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (activeTask?.id === taskId) {
        setActiveTask(null);
      }
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed" as const,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const handleStartTask = (task: StudyTask) => {
    setActiveTask(task);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: "in-progress" as const,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleSessionComplete = (session: PomodoroSession) => {
    if (activeTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeTask.id
            ? {
                ...task,
                pomodoroSessions: [...(task.pomodoroSessions || []), session],
                actualDuration:
                  (task.actualDuration || 0) +
                  (session.completed ? session.duration : 0),
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );
    }
  };

  // Filter tasks by selected date
  const filteredTasks = tasks.filter((task) =>
    task.scheduledDate.startsWith(selectedDate)
  );

  // Calculate daily statistics
  const todayStats = {
    totalTasks: filteredTasks.length,
    completedTasks: filteredTasks.filter((t) => t.status === "completed")
      .length,
    totalEstimatedTime: filteredTasks.reduce(
      (sum, task) => sum + task.estimatedDuration,
      0
    ),
    totalActualTime: filteredTasks.reduce(
      (sum, task) => sum + (task.actualDuration || 0),
      0
    ),
    completionRate:
      filteredTasks.length > 0
        ? Math.round(
            (filteredTasks.filter((t) => t.status === "completed").length /
              filteredTasks.length) *
              100
          )
        : 0,
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Study Dashboard
        </h1>
        <p className="text-gray-600">
          Plan your studies and track your progress with the Pomodoro technique
        </p>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Daily Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(todayStats.totalEstimatedTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Actual Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(todayStats.totalActualTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Study Tasks</h2>
            <button
              onClick={() => setIsTaskFormOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 mb-4">
                No tasks scheduled for this date
              </p>
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks
                .sort((a, b) => {
                  // Sort by status (pending/in-progress first, then completed)
                  if (a.status === "completed" && b.status !== "completed")
                    return 1;
                  if (a.status !== "completed" && b.status === "completed")
                    return -1;
                  // Then by priority
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((task) => (
                  <StudyTaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                    onEdit={(task) => {
                      setEditingTask(task);
                      setIsTaskFormOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Pomodoro Timer Section */}
        <div className="lg:col-span-1">
          <PomodoroTimer
            taskId={activeTask?.id}
            onSessionComplete={handleSessionComplete}
          />

          {activeTask && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Active Task</h3>
              <p className="text-blue-800">{activeTask.title}</p>
              <p className="text-sm text-blue-600 mt-1">{activeTask.subject}</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask || undefined}
        subjects={mockSubjects}
        onSave={handleSaveTask}
        onCancel={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        isOpen={isTaskFormOpen}
      />
    </div>
  );
}
