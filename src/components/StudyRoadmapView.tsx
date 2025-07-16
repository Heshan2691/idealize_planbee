"use client";

import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ArrowRight,
  Calendar,
  Target,
  Trophy,
} from "lucide-react";
import { StudyRoadmap, Milestone, LearningGoal, DailyProgress } from "@/types";

interface StudyRoadmapViewProps {
  roadmap: StudyRoadmap;
  goal: LearningGoal;
  progress?: DailyProgress[];
  onStartMilestone?: (milestone: Milestone) => void;
  onMarkComplete?: (milestoneId: string) => void;
}

export default function StudyRoadmapView({
  roadmap,
  goal,
  progress = [],
  onStartMilestone,
  onMarkComplete,
}: StudyRoadmapViewProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    null
  );

  const getProgressPercentage = () => {
    const completedMilestones = roadmap.milestones.filter(
      (m) => m.status === "completed"
    ).length;
    return Math.round((completedMilestones / roadmap.milestones.length) * 100);
  };

  const getTotalStudyTime = () => {
    return progress.reduce((total, p) => total + p.studyTimeMinutes, 0);
  };

  const getEstimatedCompletion = () => {
    const remainingMilestones = roadmap.milestones.filter(
      (m) => m.status !== "completed"
    );
    const remainingDays = remainingMilestones.reduce(
      (total, m) => total + m.estimatedDays,
      0
    );
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + remainingDays);
    return completionDate.toLocaleDateString();
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "in-progress":
        return <Circle className="w-6 h-6 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥";
      case "article":
        return "📄";
      case "book":
        return "📚";
      case "exercise":
        return "💪";
      case "quiz":
        return "❓";
      case "project":
        return "🚀";
      default:
        return "📖";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>
            <p className="text-purple-100 mb-4">{goal.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {goal.category}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {roadmap.totalDuration} days
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Est. completion: {getEstimatedCompletion()}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{getProgressPercentage()}%</div>
            <div className="text-sm text-purple-100">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-purple-500 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Milestones Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  roadmap.milestones.filter((m) => m.status === "completed")
                    .length
                }
                /{roadmap.milestones.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(getTotalStudyTime() / 60)}h{" "}
                {getTotalStudyTime() % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {goal.difficulty}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Learning Roadmap
        </h2>

        {roadmap.milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {getMilestoneIcon(milestone.status)}

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {milestone.title}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {milestone.estimatedDays} days
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {milestone.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {milestone.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {milestone.status === "pending" && (
                    <button
                      onClick={() => onStartMilestone?.(milestone)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Start
                    </button>
                  )}

                  {milestone.status === "in-progress" && (
                    <button
                      onClick={() => onMarkComplete?.(milestone.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setExpandedMilestone(
                        expandedMilestone === milestone.id ? null : milestone.id
                      )
                    }
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    {expandedMilestone === milestone.id
                      ? "Collapse"
                      : "Details"}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedMilestone === milestone.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Learning Resources
                      </h4>
                      <div className="space-y-3">
                        {milestone.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
                          >
                            <span className="text-lg">
                              {getResourceIcon(resource.type)}
                            </span>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {resource.title}
                              </h5>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="capitalize">
                                  {resource.type}
                                </span>
                                {resource.duration && (
                                  <>
                                    <span>•</span>
                                    <span>{resource.duration} min</span>
                                  </>
                                )}
                                <span>•</span>
                                <span
                                  className={`capitalize ${
                                    resource.priority === "required"
                                      ? "text-red-600"
                                      : resource.priority === "recommended"
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {resource.priority}
                                </span>
                              </div>
                            </div>
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Practice Tasks
                      </h4>
                      <div className="space-y-2">
                        {milestone.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
                          >
                            <Circle
                              className={`w-4 h-4 ${
                                task.status === "completed"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <div className="flex-1">
                              <span
                                className={`text-sm ${
                                  task.status === "completed"
                                    ? "line-through text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </span>
                              <div className="text-xs text-gray-500">
                                {task.estimatedDuration} min
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
