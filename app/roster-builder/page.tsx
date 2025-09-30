import { Suspense } from "react"
import { Calendar, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Plus, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
  shifts: Record<string, ShiftType>
}

const sampleStaff: Staff[] = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    dept: "Emergency",
    shifts: { mon: "OFF", tue: "OFF", wed: "Night", thu: "Night", fri: "OFF", sat: "OFF", sun: "Day" },
  },
  {
    initials: "MC",
    name: "Michael Chen",
    dept: "ICU",
    shifts: { mon: "OFF", tue: "OFF", wed: "Day", thu: "Night", fri: "Weekend", sat: "Weekend", sun: "Night" },
  },
  {
    initials: "ED",
    name: "Emily Davis",
    dept: "Surgery",
    shifts: { mon: "OFF", tue: "Morning", wed: "OFF", thu: "Morning", fri: "OFF", sat: "Morning", sun: "OFF" },
  },
  {
    initials: "DW",
    name: "David Wilson",
    dept: "Neurology",
    shifts: { mon: "Night", tue: "Night", wed: "Night", thu: "Night", fri: "Weekend", sat: "Night", sun: "OFF" },
  },
  {
    initials: "LA",
    name: "Lisa Anderson",
    dept: "ICU",
    shifts: { mon: "Day", tue: "Day", wed: "Morning", thu: "OFF", fri: "Day", sat: "Day", sun: "Morning" },
  },
]

// Simple color mapping for shift pills (auto-adapts in dark via paired classes)
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

function Filters() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-xl items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search team members..." className="pl-9" />
        </div>
        <Button variant="outline" className="hidden md:inline-flex gap-2 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          Show all
        </Button>
        <Button variant="outline" className="hidden lg:inline-flex bg-transparent">
          All Departments
        </Button>
        <Button variant="outline" className="hidden xl:inline-flex bg-transparent">
          All Skill Levels
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 bg-transparent">
          <Activity className="h-4 w-4" />
          KPIs
        </Button>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Assign
        </Button>
      </div>
    </div>
  )
}

function WeekHeader() {
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
          1 / 26
        </Badge>
        <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

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

function NameCell({ s }: { s: Staff }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted text-center leading-8 text-sm font-medium">
        {s.initials}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{s.name}</div>
        <div className="truncate text-xs text-muted-foreground">{s.dept}</div>
      </div>
    </div>
  )
}

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

function ScheduleGrid() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="border-b px-2 sm:px-4 pt-4">
        <WeekHeader />
      </div>

      <div className="relative">
        <div className="overflow-auto">
          <GridHeader />
          <div className="divide-y">
            {sampleStaff.map((s, rowIdx) => (
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

export default function RosterBuilderPage() {
  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Roster Builder</h1>
        <p className="text-sm text-muted-foreground">
          Build and manage team schedules with calendar and timeline views
        </p>
      </header>

      <Suspense>
        <Filters />
      </Suspense>

      <section aria-labelledby="schedule-calendar" className="space-y-4">
        <h2 id="schedule-calendar" className="sr-only">
          Schedule Calendar
        </h2>
        <ScheduleGrid />
      </section>

      <Legend />
    </main>
  )
}
