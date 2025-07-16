"use client";

import { useState } from "react";
import { Clock, CheckCircle, Circle, Play, Edit, Trash2 } from "lucide-react";
import { StudyTask } from "@/types";

interface StudyTaskCardProps {
  task: StudyTask;
  onStart?: (task: StudyTask) => void;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: StudyTask) => void;
  onDelete?: (taskId: string) => void;
}

export default function StudyTaskCard({
  task,
  onStart,
  onComplete,
  onEdit,
  onDelete,
}: StudyTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Circle className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => task.status !== "completed" && onComplete?.(task.id)}
            disabled={task.status === "completed"}
            className="mt-1"
          >
            {getStatusIcon()}
          </button>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3
                className={`font-semibold ${
                  task.status === "completed"
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(task.estimatedDuration)}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {task.subject}
              </span>
            </div>

            {task.description && (
              <div>
                <p
                  className={`text-sm text-gray-600 ${
                    !isExpanded && task.description.length > 100
                      ? "line-clamp-2"
                      : ""
                  }`}
                >
                  {isExpanded
                    ? task.description
                    : task.description.slice(0, 100)}
                  {!isExpanded && task.description.length > 100 && "..."}
                </p>
                {task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {task.status !== "completed" && (
            <button
              onClick={() => onStart?.(task)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
              title="Start Pomodoro"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onEdit?.(task)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete?.(task.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.pomodoroSessions && task.pomodoroSessions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Pomodoro Sessions:</span>
            <div className="flex space-x-1">
              {task.pomodoroSessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`w-3 h-3 rounded-full ${
                    session.completed
                      ? "bg-green-500"
                      : session.interrupted
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                  title={`Session ${index + 1}: ${
                    session.completed
                      ? "Completed"
                      : session.interrupted
                      ? "Interrupted"
                      : "Pending"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs">
              ({task.pomodoroSessions.filter((s) => s.completed).length}/
              {task.pomodoroSessions.length} completed)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
