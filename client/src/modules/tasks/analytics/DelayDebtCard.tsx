"use client";

import {
  AlertCircle,
  CircleMinus,
  Hourglass,
  LucideAlertTriangle,
} from "lucide-react";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Task } from "../taskTypes";

interface DelayDebtCardProps {
  tasks: Task[];
}

export const DelayDebtCard = ({ tasks }: DelayDebtCardProps) => {
  const now = Date.now();
  const msInDay = 1000 * 60 * 60 * 24;

  const data = useMemo(() => {
    const tasksWithDueDate = tasks?.filter((t) => t.estimation?.endDate) || [];
    const overdueTasks = tasksWithDueDate
      .filter((t) => t.estimation.endDate < now && t.status !== "completed")
      .map((t) => ({
        id: t._id,
        title: t.title,
        daysOverdue: Math.max(0, (now - t.estimation.endDate) / msInDay),
      }))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    return {
      tasksWithDueDate,
      overdueTasks,
    };
  }, [tasks, now]);

  const { tasksWithDueDate, overdueTasks } = data;

  // Threshold: >= 5 tasks with due dates
  const isReady = tasksWithDueDate.length >= 3;

  if (!isReady) {
    return (
      <div className="h-full w-full border border-neutral-200 dark:border-neutral-800 rounded-xl bg-card dark:bg-neutral-900/80 shadow-xs p-4 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("p-1.5 rounded-md border bg-muted")}>
            <Hourglass className={cn("w-3 h-3! text-primary")} />
          </div>
          <h3 className="text-sm font-medium tracking-tight text-black dark:text-white">
            Delay Debt
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 mt-6">
          <LucideAlertTriangle
            className={cn("w-8 h-8 text-primary opacity-50")}
          />
          <p className="text-xs text-muted-foreground leading-relaxed text-center px-7">
            Your workspace must have at least{" "}
            <span className="text-primary font-semibold">3 tasks</span> to establish delay debt tracking.
          </p>
        </div>
      </div>
    );
  }

  const currentOverdueCount = overdueTasks.length;
  const totalDaysOverdue = overdueTasks.reduce(
    (sum, item) => sum + item.daysOverdue,
    0
  );

  const worstOffenders = overdueTasks.slice(0, 5);

  let badgeColor =
    "text-muted-foreground border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/70";
  if (currentOverdueCount > 0) {
    badgeColor = "text-red-500 border-red-500/20 bg-red-500/5";
  }

  return (
    <div className="h-full w-full border border-neutral-200 dark:border-neutral-800 rounded-xl bg-card dark:bg-neutral-900/80 shadow-xs p-4 flex flex-col justify-start relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md border bg-card")}>
            <Hourglass className={cn("w-3.5 h-3.5 text-primary")} />
          </div>
          <h3 className="text-sm font-medium tracking-tight text-black dark:text-white">
            Delay Debt
          </h3>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted rounded-lg p-2.5 border border-accent">
          <div className="text-xl font-bold font-mono tracking-tight leading-none mb-1 text-primary">
            {Math.ceil(totalDaysOverdue)}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold">
            Days Overdue <CircleMinus className="h-3 w-3 inline ml-1 text-neutral-400" />
          </div>
        </div>
        <div className="bg-muted rounded-lg p-2.5 border border-accent relative">
          <div className="text-xl font-bold font-mono tracking-tight leading-none mb-1 text-primary">
            {currentOverdueCount}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold">
            Overdue Tasks <AlertCircle className="h-3 w-3 inline ml-1 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* WORST OFFENDERS */}
      <div className="flex-1 overflow-hidden flex flex-col pt-1">
        <div className="mb-2.5 text-[10px] font-bold text-primary flex items-center justify-between uppercase tracking-wider">
          <span>Worst offenders</span>
          <div className={cn("px-2 py-0.5 rounded text-[9px] border font-bold", badgeColor)}>
            {currentOverdueCount} OVERDUE
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {worstOffenders.length === 0 ? (
            <div className="text-[11px] text-muted-foreground italic pt-4 flex flex-col items-center justify-center">
              No overdue tasks detected.
            </div>
          ) : (
            worstOffenders.map((item) => {
              const days = Math.ceil(item.daysOverdue);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between group py-0.5"
                >
                  <span className="text-[12px] text-neutral-700 dark:text-neutral-300 truncate max-w-[150px] group-hover:text-neutral-900 dark:group-hover:text-white font-medium transition-colors capitalize">
                    {item.title.split("#")[0]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] w-4 bg-neutral-300 dark:bg-neutral-800" />
                    <span className="text-[10px] font-bold min-w-[30px] text-right text-red-500">
                      -{days}d
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
