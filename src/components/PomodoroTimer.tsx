"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Square, RotateCcw, Settings } from "lucide-react";
import { PomodoroState, PomodoroSettings, PomodoroSession } from "@/types";

interface PomodoroTimerProps {
  onSessionComplete?: (session: PomodoroSession) => void;
  taskId?: string;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
};

export default function PomodoroTimer({
  onSessionComplete,
  taskId,
}: PomodoroTimerProps) {
  const [state, setState] = useState<PomodoroState>({
    isActive: false,
    isPaused: false,
    currentSession: null,
    timeRemaining: defaultSettings.workDuration * 60,
    currentCycle: 1,
    settings: defaultSettings,
  });

  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getSessionType = useCallback(() => {
    if (state.currentCycle % state.settings.sessionsUntilLongBreak === 0) {
      return "long-break";
    }
    return state.currentSession?.type === "work" ? "short-break" : "work";
  }, [
    state.currentCycle,
    state.settings.sessionsUntilLongBreak,
    state.currentSession,
  ]);

  const createNewSession = (
    type: "work" | "short-break" | "long-break"
  ): PomodoroSession => {
    const duration =
      type === "work"
        ? state.settings.workDuration
        : type === "short-break"
        ? state.settings.shortBreakDuration
        : state.settings.longBreakDuration;

    return {
      id: Date.now().toString(),
      taskId: taskId || "general",
      type,
      duration,
      startTime: new Date().toISOString(),
      completed: false,
      interrupted: false,
    };
  };

  const startTimer = () => {
    if (!state.currentSession) {
      const sessionType = state.currentCycle === 1 ? "work" : getSessionType();
      const newSession = createNewSession(sessionType);
      const duration = newSession.duration * 60;

      setState((prev) => ({
        ...prev,
        currentSession: newSession,
        timeRemaining: duration,
        isActive: true,
        isPaused: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isActive: true,
        isPaused: false,
      }));
    }
  };

  const pauseTimer = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: true,
    }));
  };

  const stopTimer = () => {
    if (state.currentSession) {
      const updatedSession: PomodoroSession = {
        ...state.currentSession,
        endTime: new Date().toISOString(),
        interrupted: true,
        completed: false,
      };
      onSessionComplete?.(updatedSession);
    }

    setState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: prev.settings.workDuration * 60,
    }));
  };

  const resetTimer = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: prev.settings.workDuration * 60,
      currentCycle: 1,
    }));
  };

  const completeSession = useCallback(() => {
    if (state.currentSession) {
      const completedSession: PomodoroSession = {
        ...state.currentSession,
        endTime: new Date().toISOString(),
        completed: true,
        interrupted: false,
      };
      onSessionComplete?.(completedSession);

      // Determine next session type
      const nextSessionType =
        state.currentSession.type === "work"
          ? state.currentCycle % state.settings.sessionsUntilLongBreak === 0
            ? "long-break"
            : "short-break"
          : "work";

      const nextDuration =
        nextSessionType === "work"
          ? state.settings.workDuration
          : nextSessionType === "short-break"
          ? state.settings.shortBreakDuration
          : state.settings.longBreakDuration;

      setState((prev) => ({
        ...prev,
        currentSession: null,
        timeRemaining: nextDuration * 60,
        isActive: false,
        isPaused: false,
        currentCycle:
          nextSessionType === "work"
            ? prev.currentCycle + 1
            : prev.currentCycle,
      }));

      // Play sound notification if enabled
      if (state.settings.soundEnabled) {
        // You can add audio notification here
        console.log("Session completed!");
      }
    }
  }, [
    state.currentSession,
    state.currentCycle,
    state.settings,
    onSessionComplete,
  ]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (state.isActive && state.timeRemaining === 0) {
      completeSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.timeRemaining, completeSession]);

  const getTimerColor = () => {
    if (!state.currentSession) return "text-blue-600";
    switch (state.currentSession.type) {
      case "work":
        return "text-red-600";
      case "short-break":
        return "text-green-600";
      case "long-break":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };

  const getSessionLabel = () => {
    if (!state.currentSession) return "Ready to Start";
    switch (state.currentSession.type) {
      case "work":
        return "Work Session";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Session";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pomodoro Timer</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className={`text-6xl font-mono font-bold mb-2 ${getTimerColor()}`}>
          {formatTime(state.timeRemaining)}
        </div>
        <div className="text-lg text-gray-600 mb-2">{getSessionLabel()}</div>
        <div className="text-sm text-gray-500">
          Session {state.currentCycle}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {!state.isActive ? (
          <button
            onClick={startTimer}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-5 h-5 mr-2" />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </button>
        )}

        <button
          onClick={stopTimer}
          className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Square className="w-5 h-5 mr-2" />
          Stop
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>

      {showSettings && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={state.settings.workDuration}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      workDuration: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={state.settings.shortBreakDuration}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      shortBreakDuration: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={state.settings.longBreakDuration}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      longBreakDuration: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
