"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Plus,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  Zap,
} from "lucide-react";
import AIStudyPlanner from "./AIStudyPlanner";
import StudyRoadmapView from "./StudyRoadmapView";
import StudyDashboard from "./StudyDashboard";
import {
  LearningGoal,
  StudyRoadmap,
  AdaptiveSettings,
  Milestone,
} from "@/types";

export default function EnhancedStudyDashboard() {
  const [currentView, setCurrentView] = useState<
    "overview" | "planner" | "roadmap" | "daily"
  >("overview");
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<LearningGoal | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<StudyRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load learning goals on component mount
  useEffect(() => {
    loadLearningGoals();
  }, []);

  const loadLearningGoals = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your API
      const savedGoals = localStorage.getItem("learning-goals");
      const savedRoadmaps = localStorage.getItem("study-roadmaps");

      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        setLearningGoals(goals);

        if (goals.length > 0) {
          const activeGoalData =
            goals.find((g: LearningGoal) => g.status === "active") || goals[0];
          setActiveGoal(activeGoalData);

          if (savedRoadmaps) {
            const roadmaps = JSON.parse(savedRoadmaps);
            const roadmap = roadmaps.find(
              (r: StudyRoadmap) => r.goalId === activeGoalData.id
            );
            if (roadmap) {
              setActiveRoadmap(roadmap);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading learning goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanGenerated = async (
    goal: LearningGoal,
    settings: AdaptiveSettings
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call to generate roadmap
      const { AIStudyPlannerService } = await import("@/lib/aiStudyPlanner");
      const roadmap = await AIStudyPlannerService.generateStudyRoadmap(
        goal,
        settings
      );

      // Update goal with estimated duration
      const updatedGoal = {
        ...goal,
        estimatedDuration: roadmap.totalDuration,
        status: "active" as const,
      };

      // Save to localStorage (in a real app, this would save to your API/database)
      const updatedGoals = [...learningGoals, updatedGoal];
      setLearningGoals(updatedGoals);
      localStorage.setItem("learning-goals", JSON.stringify(updatedGoals));

      const roadmaps = JSON.parse(
        localStorage.getItem("study-roadmaps") || "[]"
      );
      const updatedRoadmaps = [...roadmaps, roadmap];
      localStorage.setItem("study-roadmaps", JSON.stringify(updatedRoadmaps));

      setActiveGoal(updatedGoal);
      setActiveRoadmap(roadmap);
      setCurrentView("roadmap");
    } catch (error) {
      console.error("Error generating study plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMilestone = (milestone: Milestone) => {
    if (activeRoadmap) {
      const updatedMilestones = activeRoadmap.milestones.map((m) =>
        m.id === milestone.id ? { ...m, status: "in-progress" as const } : m
      );

      const updatedRoadmap = {
        ...activeRoadmap,
        milestones: updatedMilestones,
        updatedAt: new Date().toISOString(),
      };

      setActiveRoadmap(updatedRoadmap);

      // Update localStorage
      const roadmaps = JSON.parse(
        localStorage.getItem("study-roadmaps") || "[]"
      );
      const updatedRoadmaps = roadmaps.map((r: StudyRoadmap) =>
        r.id === updatedRoadmap.id ? updatedRoadmap : r
      );
      localStorage.setItem("study-roadmaps", JSON.stringify(updatedRoadmaps));
    }
  };

  const handleMarkMilestoneComplete = (milestoneId: string) => {
    if (activeRoadmap) {
      const updatedMilestones = activeRoadmap.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "completed" as const } : m
      );

      const updatedRoadmap = {
        ...activeRoadmap,
        milestones: updatedMilestones,
        updatedAt: new Date().toISOString(),
      };

      setActiveRoadmap(updatedRoadmap);

      // Update localStorage
      const roadmaps = JSON.parse(
        localStorage.getItem("study-roadmaps") || "[]"
      );
      const updatedRoadmaps = roadmaps.map((r: StudyRoadmap) =>
        r.id === updatedRoadmap.id ? updatedRoadmap : r
      );
      localStorage.setItem("study-roadmaps", JSON.stringify(updatedRoadmaps));
    }
  };

  const getOverviewStats = () => {
    const totalGoals = learningGoals.length;
    const activeGoals = learningGoals.filter(
      (g) => g.status === "active"
    ).length;
    const completedGoals = learningGoals.filter(
      (g) => g.status === "completed"
    ).length;
    const totalEstimatedDays = learningGoals.reduce(
      (sum, g) => sum + (g.estimatedDuration || 0),
      0
    );

    return { totalGoals, activeGoals, completedGoals, totalEstimatedDays };
  };

  const stats = getOverviewStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Idealize PlanBee
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Study Planner
                </p>
              </div>
            </div>

            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView("overview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "overview"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setCurrentView("roadmap")}
                disabled={!activeRoadmap}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentView === "roadmap"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Roadmap
              </button>
              <button
                onClick={() => setCurrentView("daily")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "daily"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Daily Study
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currentView === "overview" && (
          <div>
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your AI Study Assistant
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Tell us what you want to learn, and we'll create a personalized
                roadmap with daily tasks and progress tracking.
              </p>

              {learningGoals.length === 0 ? (
                <button
                  onClick={() => setIsAIPlannerOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Create Your First Study Plan
                </button>
              ) : (
                <button
                  onClick={() => setIsAIPlannerOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Study Plan
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Goals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalGoals}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Active Goals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeGoals}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completedGoals}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Study Days</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalEstimatedDays}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals List */}
            {learningGoals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Your Learning Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                        activeGoal?.id === goal.id
                          ? "ring-2 ring-purple-500"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveGoal(goal);
                        setCurrentView("roadmap");
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            goal.status === "active"
                              ? "bg-green-100 text-green-800"
                              : goal.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {goal.status}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {goal.difficulty}
                        </span>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {goal.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{goal.category}</span>
                        <span>{goal.estimatedDuration || 0} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === "roadmap" && activeGoal && activeRoadmap && (
          <StudyRoadmapView
            roadmap={activeRoadmap}
            goal={activeGoal}
            onStartMilestone={handleStartMilestone}
            onMarkComplete={handleMarkMilestoneComplete}
          />
        )}

        {currentView === "daily" && <StudyDashboard />}

        {currentView === "roadmap" && (!activeGoal || !activeRoadmap) && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Study Plan Found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first AI-generated study plan to get started.
            </p>
            <button
              onClick={() => setIsAIPlannerOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Brain className="w-5 h-5 mr-2" />
              Create Study Plan
            </button>
          </div>
        )}
      </main>

      {/* AI Study Planner Modal */}
      <AIStudyPlanner
        isOpen={isAIPlannerOpen}
        onClose={() => setIsAIPlannerOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
