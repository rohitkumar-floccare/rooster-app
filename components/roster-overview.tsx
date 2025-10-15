// "use client"

// import type React from "react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   AlertTriangle,
//   ArrowLeftRight,
//   Download,
//   Users,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   Clock,
// } from "lucide-react"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { useState } from "react"

// /* ---------------------------------- Stat ---------------------------------- */

// function Stat({
//   title,
//   value,
//   icon,
//   tone = "default",
// }: {
//   title: string
//   value: string
//   icon: React.ReactNode
//   tone?: "default" | "success" | "warning" | "danger"
// }) {
//   const numberClass =
//     tone === "success"
//       ? "text-emerald-600 dark:text-emerald-400"
//       : tone === "warning"
//         ? "text-amber-600 dark:text-amber-400"
//         : tone === "danger"
//           ? "text-red-600 dark:text-red-400"
//           : "text-foreground"

//   const iconWrapClass =
//     tone === "success"
//       ? " dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
//       : tone === "warning"
//         ? " dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
//         : tone === "danger"
//           ? " dark:bg-red-500/10 text-red-600 dark:text-red-400"
//           : " text-muted-foreground"

//   return (
//     <Card className="rounded-xl border">
//       <CardContent className="px-5 py-5">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-xs sm:text-sm text-muted-foreground">{title}</div>
//             <div className={`mt-2 text-3xl sm:text-4xl font-extrabold leading-none ${numberClass}`}>{value}</div>
//           </div>
//           <div
//             className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconWrapClass}
//                         [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-8 sm:[&>svg]:w-8`}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// /* ---------------------------------- Data ---------------------------------- */

// type Day = {
//   date: string
//   isToday?: boolean
//   items: {
//     label: "DAY" | "NIGHT" | "WEEKEND"
//     status?: "Approved" | "Pending" | "Conflict"
//     value?: string
//     alert?: number
//   }[]
// }

// const sampleWeek: Day[] = [
//   {
//     date: "Sun 28", items: [
//       { label: "DAY", value: "6/5" },
//       { label: "NIGHT", value: "5/8" },
//       { label: "WEEKEND", value: "5/7" },
//     ]
//   },
//   {
//     date: "Mon 29", isToday: true, items: [
//       { label: "DAY", status: "Conflict", value: "6/9", alert: 1 },
//       { label: "NIGHT", value: "10/11" },
//       { label: "WEEKEND", value: "3/5" },
//     ]
//   },
//   {
//     date: "Tue 30", items: [
//       { label: "DAY", status: "Pending", value: "12/11" },
//       { label: "NIGHT", status: "Conflict", value: "13/10", alert: 1 },
//       { label: "WEEKEND", value: "4/5", alert: 1 },
//     ]
//   },
//   {
//     date: "Wed 1", items: [
//       { label: "DAY", value: "9/6" },
//       { label: "NIGHT", status: "Approved", value: "8/8" },
//       { label: "WEEKEND", value: "7/6" },
//     ]
//   },
//   {
//     date: "Thu 2", items: [
//       { label: "DAY", status: "Approved", value: "4/6" },
//       { label: "NIGHT", value: "5/5" },
//       { label: "WEEKEND", value: "6/6" },
//     ]
//   },
//   {
//     date: "Fri 3", items: [
//       { label: "DAY", value: "12/8" },
//       { label: "NIGHT", value: "5/5" },
//       { label: "WEEKEND", value: "5/8", alert: 1 },
//     ]
//   },
//   {
//     date: "Sat 4", items: [
//       { label: "DAY", value: "9/7" },
//       { label: "NIGHT", status: "Conflict", value: "5/5" },
//       { label: "WEEKEND", status: "Pending", value: "7/5" },
//     ]
//   },
// ]

// /* ----------------------------- helpers (UI) ----------------------------- */

// function statusColor(status?: Day["items"][number]["status"]) {
//   if (status === "Approved") return "text-sky-700 dark:text-sky-400"
//   if (status === "Pending") return "text-amber-600 dark:text-amber-400"
//   if (status === "Conflict") return "text-amber-600 dark:text-amber-400"
//   return "text-muted-foreground"
// }

// function StatusIcon({ status }: { status?: Day["items"][number]["status"] }) {
//   if (status === "Approved") return <CheckCircle className="h-3.5 w-3.5" />
//   if (status === "Pending") return <Clock className="h-3.5 w-3.5" />
//   if (status === "Conflict") return <AlertTriangle className="h-3.5 w-3.5" />
//   return null
// }

// /* ----------------------------- Roster Overview ----------------------------- */

// export function RosterOverview() {
//   const [dept, setDept] = useState("All Departments")

//   return (
//     <div className="w-full bg-transparent py-8 sm:py-10">
//       <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
//         <div className="space-y-6">
//           {/* Title */}
//           <div className="space-y-1">
//             <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">Roster Overview</h1>
//             <p className="text-sm text-muted-foreground">2-week roster cycle • Week 1 of 2</p>
//           </div>

//           {/* Controls */}
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//             <Select value={dept} onValueChange={setDept}>
//               <SelectTrigger className="w-full sm:w-[220px]">
//                 <SelectValue placeholder="All Departments" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="All Departments">All Departments</SelectItem>
//                 <SelectItem value="Emergency">Emergency</SelectItem>
//                 <SelectItem value="ICU">ICU</SelectItem>
//                 <SelectItem value="Ward A">Ward A</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button variant="outline" className="bg-transparent w-full sm:w-auto justify-center">
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             <Stat title="Coverage Rate" value="109.0%" icon={<Users />} tone="success" />
//             <Stat title="Staff Shortage" value="-29" icon={<AlertTriangle />} tone="danger" />
//             <Stat title="Pending Swaps" value="6" icon={<ArrowLeftRight />} tone="warning" />
//             <Stat title="Active Conflicts" value="6" icon={<AlertCircle />} tone="danger" />
//           </div>

//           {/* Alert banner */}
//           <div className="rounded-lg border bg-destructive/5 px-4 py-3 text-destructive">
//             <div className="flex items-center gap-3">
//               <AlertTriangle className="h-4 w-4" />
//               <p className="text-sm">
//                 <span className="font-medium">6 scheduling conflicts</span> require immediate attention.
//               </p>
//             </div>
//             <Button variant="link" className="h-auto pl-7 text-destructive">
//               Review conflicts →
//             </Button>
//           </div>

//           {/* Weekly roster */}
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base">Weekly Roster View</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-end gap-2">
//                 <Button aria-label="Previous week" variant="outline" size="sm" className="gap-1 bg-transparent">
//                   <ChevronLeft className="h-4 w-4" /> Previous
//                 </Button>
//                 <Button aria-label="Next week" variant="outline" size="sm" className="gap-1 bg-transparent">
//                   Next <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>

//               {/* Days grid */}
//               <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
//                 {sampleWeek.map((day) => (
//                   <Card key={day.date} className="overflow-hidden">
//                     {/* header */}
//                     <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
//                       <div className="text-xs text-muted-foreground">{day.date}</div>
//                       {day.isToday && (
//                         <Badge variant="secondary" className="text-[10px]">
//                           Today
//                         </Badge>
//                       )}
//                     </div>

//                     {/* rows */}
//                     <div className="p-3 space-y-2">
//                       {day.items.map((it, idx) => {
//                         // background tints per shift – matches screenshot
//                         const bg =
//                           it.label === "DAY"
//                             ? "color-mix(in oklch, oklch(0.954 0.065 109.77) 80%, transparent)"
//                             : it.label === "NIGHT"
//                               ? "color-mix(in oklch, oklch(0.444 0.178 264.05) 10%, transparent)"
//                               : "color-mix(in oklch, oklch(0.959 0.045 342.55) 90%, transparent)"

//                         return (
//                           <div key={idx} className="relative rounded-md border p-2 text-xs" style={{ background: bg }}>
//                             {/* red corner alert number */}
//                             {typeof it.alert === "number" && (
//                               <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
//                                 {it.alert}
//                               </span>
//                             )}

//                             {/* top row: label + ratio */}
//                             <div className="flex items-center justify-between">
//                               <span className="font-medium">{it.label}</span>
//                               {it.value && <span className="text-muted-foreground">{it.value}</span>}
//                             </div>

//                             {/* status row (only when provided) */}
//                             {it.status && (
//                               <div className={`mt-1 flex items-center gap-1.5 ${statusColor(it.status)}`}>
//                                 <StatusIcon status={it.status} />
//                                 <span>{it.status}</span>
//                               </div>
//                             )}
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </Card>
//                 ))}
//               </div>

//               {/* Legend */}
//               <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground flex flex-wrap items-center gap-4">
//                 {/* swatches for shifts */}
//                 <LegendSwatch color="oklch(0.954 0.065 109.77)" label="Day Shift" />
//                 <LegendSwatch color="oklch(0.444 0.178 264.05)" label="Night Shift" />
//                 <LegendSwatch color="oklch(0.959 0.045 342.55)" label="Weekend Shift" />
//                 {/* icons for swap/approval/conflict exactly like screenshot */}
//                 <LegendIcon icon={<ArrowLeftRight className="h-3.5 w-3.5 text-amber-600" />} label="Pending Swap" />
//                 <LegendIcon icon={<CheckCircle className="h-3.5 w-3.5 text-emerald-600" />} label="Approved Swap" />
//                 <LegendIcon icon={<AlertTriangle className="h-3.5 w-3.5 text-red-600" />} label="Conflict" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ------------------------------ Legend items ------------------------------ */

// function LegendSwatch({ color, label }: { color: string; label: string }) {
//   return (
//     <span className="inline-flex items-center gap-2">
//       <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
//       {label}
//     </span>
//   )
// }

// function LegendIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return <span className="inline-flex items-center gap-2">{icon}{label}</span>
// }


"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  ArrowLeftRight,
  Download,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"

/* ---------------------------------- Stat ---------------------------------- */

function Stat({
  title,
  value,
  icon,
  tone = "default",
}: {
  title: string
  value: string
  icon: React.ReactNode
  tone?: "default" | "success" | "warning" | "danger"
}) {
  const numberClass =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-foreground"

  const iconWrapClass =
    tone === "success"
      ? " dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? " dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : tone === "danger"
          ? " dark:bg-red-500/10 text-red-600 dark:text-red-400"
          : " text-muted-foreground"

  return (
    <Card className="rounded-xl border">
      <CardContent className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm text-muted-foreground">{title}</div>
            <div className={`mt-2 text-3xl sm:text-4xl font-extrabold leading-none ${numberClass}`}>{value}</div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconWrapClass}
                        [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-8 sm:[&>svg]:w-8`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------------------------- Data ---------------------------------- */

type Day = {
  date: string
  isToday?: boolean
  items: {
    label: "DAY" | "NIGHT" | "WEEKEND"
    status?: "Approved" | "Pending" | "Conflict"
    value?: string
    alert?: number
  }[]
}

const weeks: Day[][] = [
  [ // Week 1
    {
      date: "Sun 28", items: [
        { label: "DAY", value: "6/5" },
        { label: "NIGHT", value: "5/8" },
        { label: "WEEKEND", value: "5/7" },
      ]
    },
    {
      date: "Mon 29", isToday: true, items: [
        { label: "DAY", status: "Conflict", value: "6/9", alert: 1 },
        { label: "NIGHT", value: "10/11" },
        { label: "WEEKEND", value: "3/5" },
      ]
    },
    {
      date: "Tue 30", items: [
        { label: "DAY", status: "Pending", value: "12/11" },
        { label: "NIGHT", status: "Conflict", value: "13/10", alert: 1 },
        { label: "WEEKEND", value: "4/5", alert: 1 },
      ]
    },
    {
      date: "Wed 1", items: [
        { label: "DAY", value: "9/6" },
        { label: "NIGHT", status: "Approved", value: "8/8" },
        { label: "WEEKEND", value: "7/6" },
      ]
    },
    {
      date: "Thu 2", items: [
        { label: "DAY", status: "Approved", value: "4/6" },
        { label: "NIGHT", value: "5/5" },
        { label: "WEEKEND", value: "6/6" },
      ]
    },
    {
      date: "Fri 3", items: [
        { label: "DAY", value: "12/8" },
        { label: "NIGHT", value: "5/5" },
        { label: "WEEKEND", value: "5/8", alert: 1 },
      ]
    },
    {
      date: "Sat 4", items: [
        { label: "DAY", value: "9/7" },
        { label: "NIGHT", status: "Conflict", value: "5/5" },
        { label: "WEEKEND", status: "Pending", value: "7/5" },
      ]
    },
  ],
  [ // Week 2
    {
      date: "Sun 5", items: [
        { label: "DAY", value: "7/5" },
        { label: "NIGHT", value: "6/7" },
        { label: "WEEKEND", value: "6/7" },
      ]
    },
    {
      date: "Mon 6", items: [
        { label: "DAY", status: "Pending", value: "7/9", alert: 1 },
        { label: "NIGHT", status: "Conflict", value: "7/11", alert: 1 },
        { label: "WEEKEND", value: "5/5" },
      ]
    },
    {
      date: "Tue 7", items: [
        { label: "DAY", value: "10/11" },
        { label: "NIGHT", value: "11/13" },
        { label: "WEEKEND", value: "4/5", alert: 1 },
      ]
    },
    {
      date: "Wed 8", items: [
        { label: "DAY", value: "6/6" },
        { label: "NIGHT", status: "Approved", value: "8/8" },
        { label: "WEEKEND", value: "7/6" },
      ]
    },
    {
      date: "Thu 9", items: [
        { label: "DAY", status: "Approved", value: "6/6" },
        { label: "NIGHT", value: "5/5" },
        { label: "WEEKEND", value: "6/6" },
      ]
    },
    {
      date: "Fri 10", items: [
        { label: "DAY", value: "8/8" },
        { label: "NIGHT", value: "7/5" },
        { label: "WEEKEND", value: "6/8", alert: 1 },
      ]
    },
    {
      date: "Sat 11", items: [
        { label: "DAY", value: "10/7" },
        { label: "NIGHT", status: "Conflict", value: "5/5" },
        { label: "WEEKEND", status: "Pending", value: "9/5" },
      ]
    },
  ]
]

/* ----------------------------- helpers (UI) ----------------------------- */

function statusColor(status?: Day["items"][number]["status"]) {
  if (status === "Approved") return "text-sky-700 dark:text-sky-400"
  if (status === "Pending") return "text-amber-600 dark:text-amber-400"
  if (status === "Conflict") return "text-amber-600 dark:text-amber-400"
  return "text-muted-foreground"
}

function StatusIcon({ status }: { status?: Day["items"][number]["status"] }) {
  if (status === "Approved") return <CheckCircle className="h-3.5 w-3.5" />
  if (status === "Pending") return <Clock className="h-3.5 w-3.5" />
  if (status === "Conflict") return <AlertTriangle className="h-3.5 w-3.5" />
  return null
}

/* ----------------------------- Roster Overview ----------------------------- */

export function RosterOverview() {
  const [dept, setDept] = useState("All Departments")
  const [weekIndex, setWeekIndex] = useState(0)

  const totalWeeks = weeks.length

  function handlePrevWeek() {
    setWeekIndex((prev) => Math.max(0, prev - 1))
  }

  function handleNextWeek() {
    setWeekIndex((prev) => Math.min(totalWeeks - 1, prev + 1))
  }

  return (
    <div className="w-full bg-transparent py-8 sm:py-10">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">Roster Overview</h1>
            <p className="text-sm text-muted-foreground">
              2-week roster cycle • Week {weekIndex + 1} of {totalWeeks}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="Ward A">Ward A</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-transparent w-full sm:w-auto justify-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat title="Coverage Rate" value="109.0%" icon={<Users />} tone="success" />
            <Stat title="Staff Shortage" value="-29" icon={<AlertTriangle />} tone="danger" />
            <Stat title="Pending Swaps" value="6" icon={<ArrowLeftRight />} tone="warning" />
            <Stat title="Active Conflicts" value="6" icon={<AlertCircle />} tone="danger" />
          </div>

          {/* Alert banner */}
          <div className="rounded-lg border bg-destructive/5 px-4 py-3 text-destructive">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">
                <span className="font-medium">6 scheduling conflicts</span> require immediate attention.
              </p>
            </div>
            <Button variant="link" className="h-auto pl-7 text-destructive">
              Review conflicts →
            </Button>
          </div>

          {/* Weekly roster */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Roster View</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-end gap-2">
                <Button
                  aria-label="Previous week"
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent"
                  onClick={handlePrevWeek}
                  disabled={weekIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  aria-label="Next week"
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent"
                  onClick={handleNextWeek}
                  disabled={weekIndex === totalWeeks - 1}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Days grid */}
              <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                {weeks[weekIndex].map((day) => (
                  <Card key={day.date} className="overflow-hidden">
                    {/* header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                      {day.isToday && (
                        <Badge variant="secondary" className="text-[10px]">
                          Today
                        </Badge>
                      )}
                    </div>

                    {/* rows */}
                    <div className="p-3 space-y-2">
                      {day.items.map((it, idx) => {
                        // background tints per shift – matches screenshot
                        const bg =
                          it.label === "DAY"
                            ? "color-mix(in oklch, oklch(0.954 0.065 109.77) 80%, transparent)"
                            : it.label === "NIGHT"
                              ? "color-mix(in oklch, oklch(0.444 0.178 264.05) 10%, transparent)"
                              : "color-mix(in oklch, oklch(0.959 0.045 342.55) 90%, transparent)"

                        return (
                          <div key={idx} className="relative rounded-md border p-2 text-xs" style={{ background: bg }}>
                            {/* red corner alert number */}
                            {typeof it.alert === "number" && (
                              <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                                <span className="p-0.5">!</span>
                              </span>
                            )}

                            {/* top row: label + ratio */}
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{it.label}</span>
                              {it.value && <span className="text-muted-foreground">{it.value}</span>}
                            </div>

                            {/* status row (only when provided) */}
                            {it.status && (
                              <div className={`mt-1 flex items-center gap-1.5 ${statusColor(it.status)}`}>
                                <StatusIcon status={it.status} />
                                <span>{it.status}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Legend */}
              <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground flex flex-wrap items-center gap-4">
                {/* swatches for shifts */}
                <LegendSwatch color="oklch(0.954 0.065 109.77)" label="Day Shift" />
                <LegendSwatch color="oklch(0.444 0.178 264.05)" label="Night Shift" />
                <LegendSwatch color="oklch(0.959 0.045 342.55)" label="Weekend Shift" />
                {/* icons for swap/approval/conflict exactly like screenshot */}
                <LegendIcon icon={<ArrowLeftRight className="h-3.5 w-3.5 text-amber-600" />} label="Pending Swap" />
                <LegendIcon icon={<CheckCircle className="h-3.5 w-3.5 text-emerald-600" />} label="Approved Swap" />
                <LegendIcon icon={<AlertTriangle className="h-3.5 w-3.5 text-red-600" />} label="Conflict" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Legend items ------------------------------ */

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}

function LegendIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2">{icon}{label}</span>
}