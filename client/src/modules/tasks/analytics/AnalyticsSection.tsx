"use client";

import React, { useMemo } from "react";
import { Activity } from "lucide-react";
import { subDays } from "date-fns";
import type { Task } from "../taskTypes";

import { TaskDistributionCard } from "./TaskDistributionCard";
import { DelayDebtCard } from "./DelayDebtCard";
import { TaskTrackerCard } from "./TaskTrackerCard";
import { TaskTimelineCard } from "./TaskTimelineCard";

// ==========================================
// 1. MOCK DATA GENERATOR
// ==========================================

export function generateMockTasks(): Task[] {
  const tasks: Task[] = [];
  const now = Date.now();
  const categories = [
    { title: "Design mockup homepage", keyword: "Design" },
    { title: "Code auth login flow", keyword: "Development" },
    { title: "Weekly sync meeting", keyword: "Meetings" },
    { title: "Monthly analytics report", keyword: "Reports" },
    { title: "Review PR comments", keyword: "Reviews" },
  ];

  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Generate 12 tasks spanning the last 15 days to keep it clean and minimal
  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 15);
    const createdAt = subDays(now, daysAgo).getTime();
    
    const randStatus = Math.random();
    let status: Task["status"] = "not-started";
    if (randStatus < 0.40) {
      status = "completed";
    } else if (randStatus < 0.70) {
      status = "in-progress";
    } else if (randStatus < 0.85) {
      status = "delayed";
    } else {
      status = "not-started";
    }

    const randPriority = Math.random();
    const priority: Task["priority"] =
      randPriority < 0.25 ? "high" : randPriority < 0.75 ? "medium" : "low";

    const durationDays = Math.floor(Math.random() * 5) + 3; // 3 to 7 days
    const startDate = createdAt;
    const endDate = createdAt + durationDays * 24 * 60 * 60 * 1000;

    let finalCompletedAt: number | undefined;
    if (status === "completed") {
      const onTime = Math.random() < 0.80;
      if (onTime) {
        finalCompletedAt = startDate + Math.random() * (endDate - startDate);
      } else {
        const lateMs = (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000;
        finalCompletedAt = endDate + lateMs;
      }
    }

    const catTemplate = getRandom(categories);
    const title = `${catTemplate.title} #${i + 1}`;

    tasks.push({
      _id: `task_${i}` as any,
      _creationTime: createdAt,
      userId: "mock_user",
      title,
      description: `Auto-generated mock task for ${catTemplate.keyword} tracking.`,
      status,
      priority,
      estimation: {
        startDate,
        endDate,
      },
      finalCompletedAt,
      createdAt,
      updatedAt: finalCompletedAt || now,
    });
  }

  // Explicitly add 1 at-risk task (ends in 1.5 days from now)
  const atRiskStartDate = now - 1 * 24 * 60 * 60 * 1000; // yesterday
  const atRiskEndDate = now + 1.5 * 24 * 60 * 60 * 1000; // tomorrow (within 2 days)
  tasks.push({
    _id: "task_at_risk_explicit" as any,
    _creationTime: atRiskStartDate,
    userId: "mock_user",
    title: "Code Auth Login Flow (At Risk)",
    description: "Crucial authentication logic review, ending soon.",
    status: "in-progress",
    priority: "high",
    estimation: {
      startDate: atRiskStartDate,
      endDate: atRiskEndDate,
    },
    createdAt: atRiskStartDate,
    updatedAt: now,
  });

  return tasks;
}

// ==========================================
// 2. MAIN ANALYTICS SECTION
// ==========================================

interface AnalyticsSectionProps {
  tasks: Task[];
}

export default function AnalyticsSection({ tasks }: AnalyticsSectionProps) {
  const activeTasks = useMemo(() => {
    if (!tasks || tasks.length < 3) {
      return [...(tasks || []), ...generateMockTasks()];
    }
    return tasks;
  }, [tasks]);

  // Compute timeline boundaries dynamically from the tasks
  const { projectCreatedAt, projectDeadline } = useMemo(() => {
    if (activeTasks.length === 0) {
      const today = Date.now();
      return {
        projectCreatedAt: today - 10 * 24 * 60 * 60 * 1000,
        projectDeadline: today + 10 * 24 * 60 * 60 * 1000,
      };
    }

    const starts = activeTasks.map((t) => t.estimation.startDate);
    const ends = activeTasks.map((t) => t.estimation.endDate);

    const minStart = Math.min(...starts);
    const maxEnd = Math.max(...ends);

    return {
      projectCreatedAt: minStart,
      projectDeadline: maxEnd,
    };
  }, [activeTasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Productivity Diagnostics
        </h2>
        <p className="text-sm text-muted-foreground">
          Actionable diagnostics explaining behavior patterns and potential timeline risk.
        </p>
      </div>

      {/* Grid Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Row 1: The Three Cards */}
        <TaskDistributionCard tasks={activeTasks} />
        
        <DelayDebtCard tasks={activeTasks} />

        <TaskTrackerCard
          tasks={activeTasks}
          createdAt={projectCreatedAt}
          deadline={projectDeadline}
        />

        {/* Row 2: The Timeline logs box (spans all 3 cols) */}
        <div className="col-span-1 md:col-span-3">
          <TaskTimelineCard
            tasks={activeTasks}
            projectCreatedAt={projectCreatedAt}
            projectDeadline={projectDeadline}
          />
        </div>
      </div>
    </div>
  );
}
