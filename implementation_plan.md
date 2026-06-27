# Analytics Section — Implementation Plan

## Background

Building a 6-panel AI-powered analytics section for the TIA Agent task management app. The section answers: **"What should I change about how I work?"** — with behavioral insights, not just charts.

## Codebase Findings (from research)

### ✅ Tech Stack Confirmed
- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: `recharts@3.8.0` (already installed)
- **Animation**: `motion/react` (framer-motion variant already used in codebase)
- **Icons**: `lucide-react@1.18.0`
- **Dates**: `date-fns@4.4.0`

### ✅ Chart Component — EXISTS at `@/components/ui/chart`
No install needed. Exports: `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle` and the `ChartConfig` type.

### ✅ Task Schema (from `convex/schema.ts`)
```ts
type Task = {
  _id: string            // Convex ID
  _creationTime: number  // Convex auto timestamp
  userId: string
  title: string
  description?: string
  status: "not-started" | "in-progress" | "completed" | "on-hold" | "delayed"
  priority: "high" | "medium" | "low"  // ⚠️ No "critical" — only 3 levels
  estimation: {
    startDate: number    // Unix ms timestamp
    endDate: number      // Unix ms timestamp — this IS the dueDate
  }
  finalCompletedAt?: number  // Set when status → "completed"
  attachments?: Array<{ name: string; url: string; size?: number }>
  aiGenerated?: boolean
  createdAt: number
  updatedAt: number
}
```

> [!IMPORTANT]
> **No `estimatedMinutes` or `actualMinutes` fields exist.** Panel 4 (Time Estimation Accuracy) **cannot** be built as specified. It will be replaced with a **Task Category Distribution** panel (inferred from task title keywords — since there's also no explicit `category` field). This is the only schema-driven deviation from the spec.

> [!IMPORTANT]
> **Priority has only 3 values: `high`, `medium`, `low`** — no `critical`. All specs mentioning "critical" priority will use `high` instead. The mock data will use these 3 levels only.

> [!NOTE]
> `estimation.endDate` = due date. `finalCompletedAt` = actual completion date. Overdue detection: `endDate < Date.now() && status !== "completed"`. Late detection: `finalCompletedAt > endDate`.

### ✅ Design System Tokens (from `globals.css`)
- Light: `--background: oklch(1 0 0)`, `--card: oklch(1 0 0)`, `--border: oklch(0.922 0 0)`
- Dark: `--background: oklch(0.145 0 0)`, `--card: oklch(0.205 0 0)`, `--border: oklch(1 0 0 / 10%)`
- Chart vars: `--chart-1` through `--chart-5` (all grayscale oklch values — not colored!)
- `--primary` = near-black in light, near-white in dark (zinc scale)
- `--muted` = light gray surface
- `--muted-foreground` = mid-gray text
- `--radius`: 0.625rem light / 0.5rem dark

### ✅ Card Component Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle>   // text-base font-medium
    <CardDescription>  // text-sm text-muted-foreground
    <CardAction>  // top-right slot
  </CardHeader>
  <CardContent>  // px-(--card-spacing)
  <CardFooter>   // flex items-center
</Card>
```
Card uses `rounded-[min(var(--radius-4xl),24px)]` and `ring-1 ring-foreground/5`.

### ✅ Component Conventions
- `"use client"` at top of all interactive components
- Imports from `@/components/ui/*`, `@/lib/utils` (for `cn`)
- Motion animations via `motion/react` (not `framer-motion`)
- Tailwind v4 with `@apply` and CSS variable tokens

### ✅ File Placement
- Components follow the `src/modules/<feature>/` pattern for domain modules
- Shared UI components go in `src/components/ui/`
- **Output path**: `src/components/analytics/AnalyticsSection.tsx` (matches the `@/components/*` import pattern used everywhere)

---

## Open Questions

> [!IMPORTANT]
> **Panel 4 Replacement**: Since no `estimatedMinutes`/`actualMinutes` fields exist, Panel 4 becomes **"Task Status Distribution"** — a donut/radial chart of task counts broken down by status (`not-started`, `in-progress`, `on-hold`, `delayed`, `completed`). AI insight will surface the most alarming status bucket. Do you want a different replacement, or is this fine?

> [!IMPORTANT]
> **Mock Data Categories**: There's no `category` field in the schema. For the replacement Panel 4, categories will be **inferred from title keywords** (e.g., title contains "design" → Design, "meeting" → Meetings, "review" → Reviews, "report" → Reports, "dev"/"build"/"code" → Development). Alternatively, do you want the mock data titles to be crafted to include obvious category keywords?

> [!NOTE]
> **`"use client"` placement**: The component will be client-only (uses hooks and recharts). It will live at `src/components/analytics/AnalyticsSection.tsx`. Should there be a separate page at `app/(main)/home/analytics/page.tsx` that wraps it, or will you place it in the existing tasks page?

---

## Proposed Changes

### Analytics Component

#### [NEW] [AnalyticsSection.tsx](file:///e:/New%20folder/client/src/components/analytics/AnalyticsSection.tsx)

**Single file**, fully self-contained. Structure:

```
AnalyticsSection.tsx
├── generateMockTasks()         — mock data factory (exported)
├── computeAnalytics(tasks)     — pure computation layer
│   ├── computeFocusScore()
│   ├── computeVelocityData()   — 14 days daily completion
│   ├── computePriorityData()   — 8 weeks priority accuracy
│   ├── computeStatusData()     — Panel 4 replacement
│   ├── computeOverdueDebt()    — 8 weeks stacked
│   └── computePressureMap()    — 30 days due counts
├── InsightPill                 — reusable AI insight footer
├── FocusScoreCard              — Panel 1 hero
├── CompletionVelocityCard      — Panel 2
├── PriorityAccuracyCard        — Panel 3
├── StatusDistributionCard      — Panel 4 (replacement)
├── OverdueDebtCard             — Panel 5
├── DeadlinePressureCard        — Panel 6
└── AnalyticsSection (default export)
```

---

## Panel Specification (Schema-Adjusted)

### Panel 1 — Focus Score (Hero, col-span-2)
**Formula**: `(completionRate × 0.4) + (onTimeRate × 0.4) + (priorityAccuracy × 0.2) × 100`
- `completionRate` = completed / total tasks
- `onTimeRate` = completed where `finalCompletedAt ≤ estimation.endDate` / total completed
- `priorityAccuracy` = high-priority tasks completed on time / total high-priority tasks
- **Chart**: `RadialBarChart` as gauge background, large score centered
- **Trend**: delta vs prior 7-day window (tasks from days 8–14 ago vs days 0–7)
- **AI Diagnosis**: derives message from which sub-metric is lowest

### Panel 2 — Completion Velocity (AreaChart)
- X axis: last 14 days, daily
- Y axis: count of tasks where `finalCompletedAt` falls in that day
- Second area: 7-day rolling average
- Delta badge: % change vs prior 7 days
- AI Insight: most productive day of the week

### Panel 3 — Priority Accuracy (ComposedChart)
- Weekly buckets, last 6 weeks, **high + medium priority only** (no "critical")
- Bars: on-time completions (dark) vs late completions (light)
- Line: on-time % trend
- Tooltip: shows week range using `labelFormatter`
- AI Insight: names the priority level with worst on-time rate

### Panel 4 — Task Status Distribution (Replacement)
**Replaces Time Estimation Accuracy (field doesn't exist)**
- `RadialBarChart` showing percentage breakdown of tasks by status
- Each arc = one status, colored with CSS vars
- Center: largest status bucket highlighted
- AI Insight: calls out the most dangerous status (e.g., "8 delayed tasks are dragging your score")

### Panel 5 — Overdue Debt Tracker (Stacked AreaChart)
- 8 weekly buckets
- Area 1: new tasks created that week (`createdAt` in range)
- Area 2: overdue tasks carried from prior weeks (tasks past `estimation.endDate` and not completed)
- `ReferenceLine` when carried-over > new tasks: labeled "Debt Zone"
- AI Insight: count of tasks overdue 3+ weeks

### Panel 6 — Deadline Pressure Map (BarChart)
- 30 daily buckets
- Y: count of tasks with `estimation.endDate` falling on that day
- `Cell` highlights the max-pressure day
- XAxis: tickFormatter shows only Mon/Wed/Fri
- AI Insight: identifies the highest-load day by name

---

## Mock Data Design (Schema-Compliant)

```ts
generateMockTasks(): Task[]
// Returns 65 tasks over last 45 days
// Priority: 30% high, 45% medium, 25% low (no "critical" in schema)
// Status distribution:
//   35% completed (finalCompletedAt set)
//   25% in-progress
//   15% not-started
//   15% delayed (endDate in past, status = "delayed")
//   10% on-hold
// Completion timing:
//   ~70% of completed tasks: finalCompletedAt ≤ endDate (on time)
//   ~30% of completed tasks: finalCompletedAt > endDate by 1–4 days (late)
// Titles crafted to imply categories:
//   "Design homepage mockup" → Design (12 tasks)
//   "Code auth module" → Development (18 tasks)
//   "Weekly team meeting" → Meetings (10 tasks)
//   "Q2 performance report" → Reports (14 tasks)
//   "Review PR feedback" → Reviews (11 tasks)
```

---

## Layout Grid

```tsx
// CSS Grid — bento layout
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
  <FocusScoreCard />          {/* col-span-1 md:col-span-2 xl:col-span-2 */}
  <StatusDistributionCard />  {/* col-span-1 */}
  <CompletionVelocityCard />  {/* col-span-1 md:col-span-2 xl:col-span-2 */}
  <PriorityAccuracyCard />    {/* col-span-1 */}
  <OverdueDebtCard />         {/* col-span-1 md:col-span-2 */}
  <DeadlinePressureCard />    {/* col-span-1 md:col-span-2 */}
</div>
```

---

## InsightPill Pattern

```tsx
// Reusable AI insight pill
function InsightPill({ icon: Icon, children }) {
  return (
    <div className="bg-muted border border-border text-muted-foreground text-xs 
                    px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {children}
    </div>
  )
}
```

---

## Verification Plan

### Automated Checks
- `pnpm build` — confirm no TypeScript errors
- Check no `any` types leaked (all explicitly cast)

### Manual Verification
1. Render `<AnalyticsSection tasks={generateMockTasks()} />` in the tasks page or a test route
2. Confirm all 6 panels render without error in both light and dark mode
3. Confirm Focus Score is a plausible number (typically 40–75 range with mock data)
4. Confirm tooltips show in every chart
5. Confirm "Debt Zone" ReferenceLine appears in Panel 5 (mock data is calibrated to ensure this)
6. Confirm responsive layout collapses to 1-column on narrow viewport

### Suggested Test Route
Add `src/app/(main)/home/analytics/page.tsx`:
```tsx
import { generateMockTasks } from "@/components/analytics/AnalyticsSection"
import AnalyticsSection from "@/components/analytics/AnalyticsSection"
export default function AnalyticsPage() {
  return <AnalyticsSection tasks={generateMockTasks()} />
}
```

---

## Key Decisions Summary

| Decision | Rationale |
|---|---|
| Single file, no sub-folder | Follows `TasksPage.tsx` single-file pattern for domain modules |
| Panel 4 → Status Distribution | `estimatedMinutes`/`actualMinutes` don't exist in schema |
| 3-level priority only | Schema only has `high`/`medium`/`low` |
| `estimation.endDate` as due date | Confirmed from `OverdueIcon` in `TaskListView.tsx` |
| `finalCompletedAt` for on-time calc | Set by Convex when `status → "completed"` |
| No new npm dependencies | recharts 3.8.0 + lucide-react + date-fns already installed |
| CSS var colors only | `var(--chart-1)` through `var(--chart-5)` for all series |
