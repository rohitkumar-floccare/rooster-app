"use client"

import { useState, Suspense } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  EyeOff,
  Clock,
  Repeat,
  AlertCircle,
  Eye,
  ChevronDown,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import QuickAssignDialog from "@/components/QuickAssignDialog"

// --- Data ---
const departmentsList = ["Show all", "Emergency", "ICU", "Surgery", "Neurology"]
const skillsList = ["All Skill Levels", "Trainee", "Junior", "Senior", "Lead", "Specialist"]
const filterOptions = ["Show all", "Swap Only", "Conflict Only", "Vacant Seat"]


type ShiftType = "Day" | "Night" | "Morning" | "Evening" | "Weekend" | "OFF"

const days = [
  { key: "mon", label: "Mon", date: "Nov 11" },
  { key: "tue", label: "Tue", date: "Nov 12" },
  { key: "wed", label: "Wed", date: "Nov 13" },
  { key: "thu", label: "Thu", date: "Nov 14" },
  { key: "fri", label: "Fri", date: "Nov 15" },
  { key: "sat", label: "Sat", date: "Nov 16" },
  { key: "sun", label: "Sun", date: "Nov 17" },
]

type Staff = {
  initials: string
  name: string
  dept: string
  skill: string
  shifts: Record<string, ShiftType>
  indicators?: {
    critical?: boolean
    swap?: "pending" | "confirmed" | "completed"
  }
}

const sampleStaff: Staff[] = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    dept: "Emergency",
    skill: "Senior",
    shifts: { mon: "OFF", tue: "OFF", wed: "Night", thu: "Night", fri: "OFF", sat: "OFF", sun: "Day" },
    indicators: { swap: "pending" },
  },
  {
    initials: "MC",
    name: "Michael Chen",
    dept: "ICU",
    skill: "Lead",
    shifts: { mon: "OFF", tue: "OFF", wed: "Day", thu: "Night", fri: "Weekend", sat: "Weekend", sun: "Night" },
    indicators: { critical: true },
  },
  {
    initials: "ED",
    name: "Emily Davis",
    dept: "Surgery",
    skill: "Senior",
    shifts: { mon: "OFF", tue: "Morning", wed: "OFF", thu: "Morning", fri: "OFF", sat: "Morning", sun: "OFF" },
  },
  {
    initials: "DW",
    name: "David Wilson",
    dept: "Neurology",
    skill: "Junior",
    shifts: { mon: "Night", tue: "Night", wed: "Night", thu: "Night", fri: "Weekend", sat: "Night", sun: "OFF" },
    indicators: { swap: "confirmed" },
  },
  {
    initials: "LA",
    name: "Lisa Anderson",
    dept: "ICU",
    skill: "Senior",
    shifts: { mon: "Day", tue: "Day", wed: "Morning", thu: "OFF", fri: "Day", sat: "Day", sun: "Morning" },
    indicators: { critical: true },
  },
]

// --- Helpers ---
function shiftClasses(shift: ShiftType) {
  switch (shift) {
    case "Day":
      return "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200"
    case "Night":
      return "bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-200"
    case "Morning":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200"
    case "Evening":
      return "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-400/15 dark:text-fuchsia-200"
    case "Weekend":
      return "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-200"
    case "OFF":
    default:
      return "bg-muted text-muted-foreground"
  }
}

// --- Filters Header ---
function FiltersHeader({
  filterName,
  setFilterName,
  filterDepartment,
  setFilterDepartment,
  filterSkill,
  setFilterSkill,
  tab,
  setTab,
}: {
  filterName: string
  setFilterName: (v: string) => void
  filterDepartment: string
  setFilterDepartment: (v: string) => void
  filterSkill: string
  setFilterSkill: (v: string) => void
  tab: "calendar" | "day"
  setTab: (v: "calendar" | "day") => void
}) {
  return (
    <div className="[&:last-child]:pb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center p-0">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <input
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
          placeholder="Search team members..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
        />
      </div>

      <div className="relative w-full sm:w-48">
        <button type="button" className="border-input flex items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm w-full sm:w-48">
          <span style={{ pointerEvents: "none" }}>{filterName || "Show All"}</span>
          <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
        </button>
        <select
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-auto"
        >
          {filterOptions.map(opt => (
            <option key={opt} value={opt === "Show all" ? "" : opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Department Dropdown */}
      <div className="relative w-full sm:w-48">
        <button type="button" className="border-input flex items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm w-full sm:w-48">
          <span style={{ pointerEvents: "none" }}>{filterDepartment || "All Departments"}</span>
          <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
        </button>
        <select
          value={filterDepartment}
          onChange={e => setFilterDepartment(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-auto"
        >
          {departmentsList.map(opt => (
            <option key={opt} value={opt === "Show all" ? "" : opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Skill Level Dropdown */}
      <div className="relative w-full sm:w-48">
        <button type="button" className="border-input flex items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm w-full sm:w-48">
          <span style={{ pointerEvents: "none" }}>{filterSkill || "All Skill Levels"}</span>
          <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
        </button>
        <select
          value={filterSkill}
          onChange={e => setFilterSkill(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-auto"
        >
          {skillsList.map(opt => (
            <option key={opt} value={opt === "All Skill Levels" ? "" : opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Tabs */}
      <div dir="ltr" data-orientation="horizontal" className="flex flex-col gap-2">
        <div role="tablist" aria-orientation="horizontal" className="bg-muted text-muted-foreground h-9 w-fit items-center justify-center rounded-xl p-[3px] grid grid-cols-2" tabIndex={0}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "calendar"}
            data-state={tab === "calendar" ? "active" : "inactive"}
            className={`h-[calc(100%-1px)] flex-1 justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] flex items-center gap-1 ${tab === "calendar" ? "bg-card text-foreground" : ""}`}
            tabIndex={-1}
            onClick={() => setTab("calendar")}
          >
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "day"}
            data-state={tab === "day" ? "active" : "inactive"}
            className={`h-[calc(100%-1px)] flex-1 justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] flex items-center gap-1 ${tab === "day" ? "bg-card text-foreground" : ""}`}
            tabIndex={-1}
            onClick={() => setTab("day")}
          >
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Day</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// --- WeekHeader ---
function WeekHeader({ weekIndex, setWeekIndex, totalWeeks }: { weekIndex: number, setWeekIndex: (i: number) => void, totalWeeks: number }) {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">Schedule Calendar</div>
          <div className="text-muted-foreground">6-Month Schedule • 25 staff members</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Week</span>
        <Badge variant="secondary" className="rounded-full">
          {weekIndex + 1} / {totalWeeks}
        </Badge>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-transparent"
          onClick={() => setWeekIndex(i => Math.max(0, i - 1))}
          disabled={weekIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-transparent"
          onClick={() => setWeekIndex(i => Math.min(totalWeeks - 1, i + 1))}
          disabled={weekIndex === totalWeeks - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// --- GridHeader ---
function GridHeader() {
  return (
    <div className="grid grid-cols-[280px_repeat(7,minmax(140px,1fr))] text-sm">
      <div className="rounded-tl-xl bg-gradient-to-r from-primary/5 to-transparent px-4 py-3 font-medium">
        Nurses (25)
      </div>
      {days.map((d, i) => (
        <div key={d.key} className={cn("px-4 py-3 font-medium", i === days.length - 1 && "rounded-tr-xl")}>
          <div className="flex items-baseline gap-2">
            <span>{d.label}</span>
            <span className="text-muted-foreground">{d.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// --- NameCell ---
function NameCell({ s }: { s: Staff }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-full bg-muted text-center leading-8 text-sm font-medium">
          {s.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{s.name}</div>
          <div className="truncate text-xs text-muted-foreground">{s.dept}</div>
        </div>
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2">
        {s.indicators?.critical && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-red-600 ">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Critical Issue</span>
          </span>
        )}
        {s.indicators?.swap && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-blue-600 ">
            <Repeat className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Swap {s.indicators.swap}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// --- ShiftCell ---
function ShiftCell({ shift }: { shift: ShiftType }) {
  return (
    <div className="px-4 py-3">
      <div
        className={cn(
          "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ring-1 ring-border",
          shiftClasses(shift),
        )}
      >
        {shift}
      </div>
    </div>
  )
}

// --- ScheduleGrid ---
function ScheduleGrid({
  staff,
  weekIndex,
  setWeekIndex,
  totalWeeks,
  tab,
}: {
  staff: Staff[]
  weekIndex: number
  setWeekIndex: React.Dispatch<React.SetStateAction<number>>
  totalWeeks: number
  tab: "calendar" | "day"
}) {
  // For simplicity: page 1 shows staff shifts; page 2+ shows all "OFF"
  const displayStaff =
    weekIndex === 0
      ? staff
      : staff.map(s => ({
          ...s,
          shifts: Object.fromEntries(days.map(d => [d.key, "OFF"] as [string, ShiftType])),
        }))

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="border-b px-2 sm:px-4 pt-4">
        <WeekHeader
          weekIndex={weekIndex}
          setWeekIndex={setWeekIndex}
          totalWeeks={totalWeeks}
        />
      </div>
      <div className="relative">
        <div className="overflow-auto">
          <GridHeader />
          <div className="divide-y">
            {displayStaff.map((s, rowIdx) => (
              <div
                key={s.name}
                className={cn(
                  "grid grid-cols-[280px_repeat(7,minmax(140px,1fr))] text-sm",
                  rowIdx % 2 === 1 ? "bg-muted/30" : "",
                )}
              >
                <div className="sticky left-0 z-[1] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <NameCell s={s} />
                </div>
                {days.map((d) => (
                  <ShiftCell key={d.key} shift={s.shifts[d.key]} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Legend ---
function Legend() {
  const Item = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-sm", color)} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="h-5 w-5 rounded-full bg-muted grid place-items-center">
          <span className="h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-medium">Legend & Status Indicators</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-sm font-medium">Shift Types</div>
          <div className="grid grid-cols-2 gap-3">
            <Item color="bg-amber-400/60" label="Day (6AM–6PM)" />
            <Item color="bg-violet-400/60" label="Night (6PM–6AM)" />
            <Item color="bg-emerald-400/60" label="Morning (6AM–2PM)" />
            <Item color="bg-fuchsia-400/60" label="Evening (2PM–10PM)" />
            <Item color="bg-rose-400/60" label="Weekend" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium">Card Status Colors</div>
          <div className="grid grid-cols-2 gap-3">
            <Item color="bg-red-500/80" label="Critical Conflict" />
            <Item color="bg-orange-500/80" label="High Conflict" />
            <Item color="bg-yellow-500/80" label="Swap Pending" />
            <Item color="bg-emerald-500/80" label="Swap Confirmed" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium">Status Indicators</div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="rounded-full">
              Critical Issue
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Pending Swap
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Confirmed Swap
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Completed Swap
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---
export default function RosterBuilderPage() {
  // Filtering states
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterSkill, setFilterSkill] = useState("")
  const [filterName, setFilterName] = useState("")
  const [tab, setTab] = useState<"calendar" | "day">("calendar")
  const [showKpis, setShowKpis] = useState(false)
  const [showQuickAssign, setShowQuickAssign] = useState(false)
  const [weekIndex, setWeekIndex] = useState<number>(0) // <-- make sure this exists
  const totalWeeks = 26
  // Filter staff
  const filteredStaff = sampleStaff.filter(s => {
    const matchesDept = !filterDepartment || filterDepartment === "Show all" || s.dept === filterDepartment
    const matchesSkill = !filterSkill || filterSkill === "All Skill Levels" || s.skill === filterSkill
    const matchesName = !filterName || s.name.toLowerCase().includes(filterName.toLowerCase())
    return matchesDept && matchesSkill && matchesName
  })

  return (
    <main className="mx-auto w-full max-w-[1200px] p-4 sm:p-6">
      <header className="space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl py-1 font-semibold tracking-tight text-balance">Roster Builder</h1>
            <p className="text-sm text-muted-foreground pb-4">
              Build and manage team schedules with calendar and timeline views
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="gap-2 bg-transparent hidden sm:inline-flex"
              onClick={() => setShowKpis(prev => !prev)}
            >
              {showKpis ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              KPIs
            </Button>
            <Button
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hidden sm:inline-flex"
              onClick={() => setShowQuickAssign(prev => !prev)}
            >
              <Plus className="h-4 w-4" />
              Quick Assign
            </Button>
          </div>
        </div>
      </header>

      <FiltersHeader
        filterName={filterName}
        setFilterName={setFilterName}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterSkill={filterSkill}
        setFilterSkill={setFilterSkill}
        tab={tab}
        setTab={setTab}
      />

      <Suspense>
        {showKpis && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-4">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold text-foreground">25</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-8 h-8 text-blue-600" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Full-Time</p>
                  <p className="text-2xl font-bold text-green-600">20</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-8 h-8 text-green-600" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Part-Time</p>
                  <p className="text-2xl font-bold text-amber-600">5</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Hours/Week</p>
                  <p className="text-2xl font-bold text-purple-600">39</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column w-8 h-8 text-purple-600" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
              </div>
            </div>
          </div>
        )}
      </Suspense>

      <section aria-labelledby="schedule-calendar" className="space-y-4 mt-2">
        <h2 id="schedule-calendar" className="sr-only">Schedule Calendar</h2>
        <ScheduleGrid staff={filteredStaff} weekIndex={weekIndex} setWeekIndex={setWeekIndex} totalWeeks={totalWeeks} tab={tab} />
      </section>

      <Legend />
      {showQuickAssign && <QuickAssignDialog onClose={() => setShowQuickAssign(false)} />}
    </main>
  )
}