"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  LucideAlertTriangle,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import type { Task } from "../taskTypes";

interface TaskTrackerCardProps {
  tasks: Task[];
  createdAt: number;
  deadline: number;
}

export const TaskTrackerCard = ({
  tasks,
  createdAt,
  deadline,
}: TaskTrackerCardProps) => {
  const now = Date.now();
  const msInDay = 1000 * 60 * 60 * 24;

  const totalDays = Math.max(1, (deadline - createdAt) / msInDay);
  const daysConsumed = Math.max(0, (now - createdAt) / msInDay);
  const daysRemaining = Math.max(0, (deadline - now) / msInDay);

  const totalTasks = tasks?.length || 0;
  const completedTasks =
    tasks?.filter((t) => t.status === "completed").length || 0;
  const incompleteTasks = tasks?.filter((t) => t.status !== "completed") || [];
  
  const overdueTasks =
    incompleteTasks.filter((t) => t.estimation.endDate < now).length || 0;
  const atRiskTasks =
    incompleteTasks.filter(
      (t) =>
        t.estimation.endDate >= now &&
        t.estimation.endDate <= now + 2 * 24 * 60 * 60 * 1000
    ).length || 0;
  const pendingTasks = Math.max(0, totalTasks - completedTasks - overdueTasks - atRiskTasks);

  const completedPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pendingPct = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;
  const atRiskPct = totalTasks > 0 ? (atRiskTasks / totalTasks) * 100 : 0;
  const overduePct = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;

  const isReady = totalTasks >= 3 && daysConsumed >= 2;

  if (!isReady) {
    return (
      <div className="h-full w-full border border-neutral-200 dark:border-neutral-800 rounded-xl bg-card dark:bg-neutral-900/80 shadow-xs p-4 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("p-1.5 rounded-md border bg-muted")}>
            <Activity className={cn("w-3.5 h-3.5 text-primary")} />
          </div>
          <h3 className="text-sm font-medium tracking-tight text-black dark:text-white">
            Task Tracker
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 mt-6">
          <LucideAlertTriangle
            className={cn("w-8 h-8 text-primary opacity-50")}
          />
          <p className="text-xs text-muted-foreground leading-relaxed text-center px-7">
            Your workspace must have at least{" "}
            <span className="text-primary font-semibold">3 tasks and 2 days of history</span>{" "}
            to establish velocity.
          </p>
        </div>
      </div>
    );
  }

  // READY STATE
  // Gap analysis: completed pct vs time consumed pct
  const timeConsumedPct = Math.min(100, (daysConsumed / totalDays) * 100);
  const gap = timeConsumedPct - completedPct;
  const isBehind = gap > 0;

  const needPerDay =
    daysRemaining > 0 ? (incompleteTasks.length / daysRemaining).toFixed(1) : "0";
  const currentPace =
    daysConsumed > 0 ? (completedTasks / daysConsumed).toFixed(1) : "0";

  // Total blocks for the bar
  const totalBlocks = 35;
  const completedBlocks = Math.round((completedPct / 100) * totalBlocks);
  const pendingBlocks = Math.round((pendingPct / 100) * totalBlocks);
  const atRiskBlocks = Math.round((atRiskPct / 100) * totalBlocks);
  const overdueBlocks = Math.round((overduePct / 100) * totalBlocks);

  return (
    <div className="h-full w-full border border-neutral-200 dark:border-neutral-800 rounded-xl bg-card dark:bg-neutral-900/80 shadow-xs p-4 flex flex-col justify-between relative overflow-hidden">
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md border bg-card")}>
              <Activity className={cn("w-3.5 h-3.5 text-primary")} />
            </div>
            <h3 className="text-sm font-medium tracking-tight text-black dark:text-white">
              Task Tracker
            </h3>
          </div>
          {isBehind ? (
            <div
              className={cn(
                "px-3 py-1.5 rounded-sm text-[10px] flex items-center gap-1 border border-accent bg-accent/60 text-rose-400 font-bold"
              )}
            >
              <AlertCircle className="w-3 h-3" />
              {gap.toFixed(0)}% Behind
            </div>
          ) : (
            <div
              className={cn(
                "px-3 py-1.5 rounded-sm text-[10px] flex items-center gap-1 border border-accent bg-accent/60 text-green-400 font-bold"
              )}
            >
              <ArrowUpRight className="w-3 h-3" />
              Ahead
            </div>
          )}
        </div>

        {/* PROGRESS BARS */}
        <div className="space-y-3">
          {/* TASK COMPLETED */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
              <span>Tasks Completed</span>
              <span className="text-emerald-400">{completedTasks} / {totalTasks}</span>
            </div>
            <div className="flex gap-[2px] h-6 w-full">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={`completed-${i}`}
                  className={cn(
                    "flex-1 rounded-[1.5px] transition-colors",
                    i < completedBlocks
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                />
              ))}
            </div>
          </div>

          {/* TASK PENDING */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
              <span>Tasks Pending</span>
              <span className="text-blue-400">{pendingTasks} / {totalTasks}</span>
            </div>
            <div className="flex gap-[2px] h-6 w-full">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={`pending-${i}`}
                  className={cn(
                    "flex-1 rounded-[1.5px] transition-colors",
                    i < pendingBlocks
                      ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                />
              ))}
            </div>
          </div>

          {/* TASK AT RISK */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
              <span>Tasks At Risk</span>
              <span className="text-orange-500">{atRiskTasks} / {totalTasks}</span>
            </div>
            <div className="flex gap-[2px] h-6 w-full">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={`atrisk-${i}`}
                  className={cn(
                    "flex-1 rounded-[1.5px] transition-colors",
                    i < atRiskBlocks
                      ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                />
              ))}
            </div>
          </div>

          {/* TASK OVERDUE */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
              <span>Tasks Overdue</span>
              <span className="text-rose-400">{overdueTasks} / {totalTasks}</span>
            </div>
            <div className="flex gap-[2px] h-6 w-full">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={`overdue-${i}`}
                  className={cn(
                    "flex-1 rounded-[1.5px] transition-colors",
                    i < overdueBlocks
                      ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.3)]"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
