"use client";

import { useState } from "react";
import {
  Brain,
  Target,
  Clock,
  Calendar,
  Zap,
  BookOpen,
  X,
  ChevronRight,
} from "lucide-react";
import { LearningGoal, AdaptiveSettings } from "@/types";

interface AIStudyPlannerProps {
  onPlanGenerated: (goal: LearningGoal, settings: AdaptiveSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIStudyPlanner({
  onPlanGenerated,
  isOpen,
  onClose,
}: AIStudyPlannerProps) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const [goalData, setGoalData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    targetDate: "",
  });

  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>({
    dailyStudyTime: 60,
    studyDaysPerWeek: 5,
    difficultyPreference: "balanced" as "gradual" | "balanced" | "intensive",
    learningStyle: "mixed" as "visual" | "auditory" | "kinesthetic" | "mixed",
    rescheduleOnMissedDays: true,
    adaptBasedOnProgress: true,
  });

  const categories = [
    "Programming & Development",
    "Data Science & AI",
    "Mathematics",
    "Languages",
    "Science",
    "Business & Finance",
    "Design & Creativity",
    "Personal Development",
    "Health & Fitness",
    "Music & Arts",
  ];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newGoal: LearningGoal = {
      id: Date.now().toString(),
      title: goalData.title,
      description: goalData.description,
      category: goalData.category,
      difficulty: goalData.difficulty,
      estimatedDuration: calculateEstimatedDuration(),
      targetDate: goalData.targetDate,
      status: "planning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onPlanGenerated(newGoal, adaptiveSettings);
    setIsGenerating(false);
    handleClose();
  };

  const calculateEstimatedDuration = () => {
    const baseHours =
      goalData.difficulty === "beginner"
        ? 40
        : goalData.difficulty === "intermediate"
        ? 80
        : 120;
    const dailyHours = adaptiveSettings.dailyStudyTime / 60;
    const daysPerWeek = adaptiveSettings.studyDaysPerWeek;
    const weeklyHours = dailyHours * daysPerWeek;
    return Math.ceil((baseHours / weeklyHours) * 7); // Convert to days
  };

  const handleClose = () => {
    setStep(1);
    setGoalData({
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      targetDate: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              AI Study Planner
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center ${
                step >= 1 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Learning Goal</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div
              className={`flex items-center ${
                step >= 2 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div
              className={`flex items-center ${
                step >= 3 ? "text-purple-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="ml-2 text-sm font-medium">Generate Plan</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  What do you want to learn?
                </h3>
                <p className="text-gray-600">
                  Tell us about your learning goal and we'll create a
                  personalized study plan
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Goal Title *
                </label>
                <input
                  type="text"
                  value={goalData.title}
                  onChange={(e) =>
                    setGoalData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Learn React and Next.js for Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={goalData.description}
                  onChange={(e) =>
                    setGoalData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what you want to achieve, your current knowledge level, and specific areas you want to focus on..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={goalData.category}
                    onChange={(e) =>
                      setGoalData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Current Level
                  </label>
                  <select
                    value={goalData.difficulty}
                    onChange={(e) =>
                      setGoalData((prev) => ({
                        ...prev,
                        difficulty: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">
                      Beginner - New to this topic
                    </option>
                    <option value="intermediate">
                      Intermediate - Some experience
                    </option>
                    <option value="advanced">
                      Advanced - Significant experience
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Completion Date (Optional)
                </label>
                <input
                  type="date"
                  value={goalData.targetDate}
                  onChange={(e) =>
                    setGoalData((prev) => ({
                      ...prev,
                      targetDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Study Preferences
                </h3>
                <p className="text-gray-600">
                  Help us personalize your learning schedule
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Study Time
                  </label>
                  <select
                    value={adaptiveSettings.dailyStudyTime}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        dailyStudyTime: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Days per Week
                  </label>
                  <select
                    value={adaptiveSettings.studyDaysPerWeek}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        studyDaysPerWeek: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                    <option value={6}>6 days</option>
                    <option value={7}>7 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Progression
                  </label>
                  <select
                    value={adaptiveSettings.difficultyPreference}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        difficultyPreference: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="gradual">Gradual - Slow and steady</option>
                    <option value="balanced">Balanced - Moderate pace</option>
                    <option value="intensive">Intensive - Fast-paced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Style
                  </label>
                  <select
                    value={adaptiveSettings.learningStyle}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        learningStyle: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="visual">
                      Visual - Images, diagrams, videos
                    </option>
                    <option value="auditory">
                      Auditory - Podcasts, lectures
                    </option>
                    <option value="kinesthetic">
                      Kinesthetic - Hands-on practice
                    </option>
                    <option value="mixed">Mixed - All of the above</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.rescheduleOnMissedDays}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        rescheduleOnMissedDays: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Automatically reschedule missed study sessions
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.adaptBasedOnProgress}
                    onChange={(e) =>
                      setAdaptiveSettings((prev) => ({
                        ...prev,
                        adaptBasedOnProgress: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Adapt difficulty based on my progress and performance
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                {isGenerating ? (
                  <>
                    <Zap className="w-12 h-12 text-purple-600 mx-auto mb-3 animate-pulse" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Generating Your Study Plan
                    </h3>
                    <p className="text-gray-600">
                      Our AI is creating a personalized roadmap for you...
                    </p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full animate-pulse"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Review Your Plan
                    </h3>
                    <p className="text-gray-600">
                      Here's a summary of your personalized study plan
                    </p>
                  </>
                )}
              </div>

              {!isGenerating && (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Goal:</h4>
                    <p className="text-gray-700">{goalData.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Category:</h4>
                    <p className="text-gray-700">{goalData.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Estimated Duration:
                    </h4>
                    <p className="text-gray-700">
                      {calculateEstimatedDuration()} days
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Daily Commitment:
                    </h4>
                    <p className="text-gray-700">
                      {adaptiveSettings.dailyStudyTime} minutes,{" "}
                      {adaptiveSettings.studyDaysPerWeek} days per week
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Learning Style:
                    </h4>
                    <p className="text-gray-700 capitalize">
                      {adaptiveSettings.learningStyle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isGenerating}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}

          <div className="ml-auto">
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!goalData.title || !goalData.category)}
                className="px-6 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-6 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate Study Plan"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
