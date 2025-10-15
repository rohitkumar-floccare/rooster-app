"use client"

import { useMemo, useState } from "react"
import {
  Award,
  BadgeCheck,
  Circle,
  Clock3,
  UsersRound,
  UserRound,
  MoreVertical,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddStaffMemberModal } from "./StaffModal"

type Member = {
  id: string
  empId: string
  name: string
  initials: string
  department: string
  skill: "Trainee" | "Junior" | "Senior" | "Lead" | "Specialist"
  contract: "Full-Time" | "Part-Time"
  hours: string // e.g., "40h/Wk"
  status: "Active" | "On-Leave"
  experienceYears: number
  availability: Array<"Day" | "Night" | "Morning" | "Evening">
}

const SEED: Member[] = [
  { id: "1", empId: "EMP001", name: "Sarah Johnson", initials: "SJ", department: "Emergency", skill: "Senior", contract: "Full-Time", hours: "48h/Wk", status: "Active", experienceYears: 8, availability: ["Day", "Night"] },
  { id: "2", empId: "EMP002", name: "Michael Chen", initials: "MC", department: "ICU", skill: "Lead", contract: "Full-Time", hours: "40h/Wk", status: "Active", experienceYears: 12, availability: ["Day", "Night"] },
  { id: "3", empId: "EMP003", name: "Emily Rodriguez", initials: "ER", department: "Surgery", skill: "Senior", contract: "Full-Time", hours: "40h/Wk", status: "Active", experienceYears: 6, availability: ["Day", "Morning"] },
  { id: "4", empId: "EMP004", name: "David Wilson", initials: "DW", department: "Pediatrics", skill: "Junior", contract: "Full-Time", hours: "36h/Wk", status: "Active", experienceYears: 3, availability: ["Day", "Evening"] },
  { id: "5", empId: "EMP005", name: "Jennifer Brown", initials: "JB", department: "Maternity", skill: "Senior", contract: "Full-Time", hours: "40h/Wk", status: "Active", experienceYears: 9, availability: ["Day", "Night"] },
  { id: "6", empId: "EMP006", name: "Robert Martinez", initials: "RM", department: "Oncology", skill: "Specialist", contract: "Full-Time", hours: "40h/Wk", status: "On-Leave", experienceYears: 15, availability: ["Day", "Evening"] },
  { id: "7", empId: "EMP007", name: "Jessica Davis", initials: "JD", department: "Cardiology", skill: "Junior", contract: "Part-Time", hours: "32h/Wk", status: "Active", experienceYears: 2, availability: ["Morning", "Evening"] },
  { id: "8", empId: "EMP008", name: "William Taylor", initials: "WT", department: "Emergency", skill: "Trainee", contract: "Part-Time", hours: "24h/Wk", status: "Active", experienceYears: 0, availability: ["Day"] },
  { id: "9", empId: "EMP009", name: "Amanda Clark", initials: "AC", department: "Neurology", skill: "Lead", contract: "Full-Time", hours: "40h/Wk", status: "Active", experienceYears: 14, availability: ["Day", "Night"] },
  { id: "10", empId: "EMP010", name: "Lisa Wang", initials: "LW", department: "General Medicine", skill: "Senior", contract: "Full-Time", hours: "40h/Wk", status: "Active", experienceYears: 7, availability: ["Morning", "Day"] },
]

type Filters = {
  department: string | "All"
  skill: Member["skill"] | "All"
  status: Member["status"] | "All"
}

function skillBadgeStyle(skill: Member["skill"]) {
  switch (skill) {
    case "Senior":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
    case "Junior":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300"
    case "Lead":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300"
    case "Specialist":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300"
    case "Trainee":
    default:
      return "bg-muted text-foreground/70"
  }
}

function StatusPill({ status }: { status: Member["status"] }) {
  const dotClass = status === "Active" ? "bg-emerald-500" : "bg-amber-500"
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
      {status}
    </span>
  )
}

export default function TeamManager() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({ department: "All", skill: "All", status: "All" })
  const [rows] = useState<Member[]>(SEED)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)


  const departments = useMemo(() => Array.from(new Set(rows.map((r) => r.department))).sort(), [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      const matchesQuery =
        !q || r.name.toLowerCase().includes(q) || r.empId.toLowerCase().includes(q) || r.department.toLowerCase().includes(q)
      const matchesDept = filters.department === "All" || r.department === filters.department
      const matchesSkill = filters.skill === "All" || r.skill === filters.skill
      const matchesStatus = filters.status === "All" || r.status === filters.status
      return matchesQuery && matchesDept && matchesSkill && matchesStatus
    })
  }, [rows, query, filters])

  const metrics = useMemo(() => {
    const total = rows.length
    const active = rows.filter((r) => r.status === "Active").length
    const onLeave = rows.filter((r) => r.status === "On-Leave").length
    const fullTime = rows.filter((r) => r.contract === "Full-Time").length
    const partTime = rows.filter((r) => r.contract === "Part-Time").length
    const avgExp = Math.round((rows.reduce((s, r) => s + r.experienceYears, 0) / Math.max(1, total)) * 10) / 10
    return { total, active, onLeave, fullTime, partTime, avgExp }
  }, [rows])

  const allVisibleSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))
  const toggleSelectAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) filtered.forEach((r) => next.add(r.id))
      else filtered.forEach((r) => next.delete(r.id))
      return next
    })
  }
  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Team Manager</h1>
          <p className="text-sm text-muted-foreground">Manage nursing staff, roles, and team assignments</p>
        </div>
        <Button className="gap-2 self-start md:self-auto"
          onClick={() => setShowModal(true)}
        >
          <UserRound className="h-4 w-4" aria-hidden="true" />
          Add Staff Member
        </Button>
      </section>

      {/* KPI row (cards like screenshot) */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold">1</div>
            <UsersRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </CardContent>
        </Card>

        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">1</div>
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </CardContent>
        </Card>

        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-orange-600 dark:text-orange-400">0</div>
            <span className="h-3 w-3 rounded-full bg-orange-500" />
          </CardContent>
        </Card>

        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Full-Time</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-purple-600 dark:text-purple-400">1</div>
            <Clock3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </CardContent>
        </Card>

        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Part-Time</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">0</div>
            <Clock3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </CardContent>
        </Card>

        <Card variant="tile" density="compact">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg<br />Experience</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-semibold text-orange-600 dark:text-orange-400">3<span className="text-2xl">y</span></div>
            <Award className="h-6 w-6 text-orange-500" />
          </CardContent>
        </Card>
      </section>


      {/* Search + filters (pill style like screenshot) */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff by name, ID, or email..."
            aria-label="Search team members"
            className="h-11 w-full rounded-full border-0 bg-muted/60 pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-muted/40"
          />
        </div>

        <Select
          value={filters.department}
          onValueChange={(v) => setFilters((f) => ({ ...f, department: v as Filters["department"] }))}
        >
          <SelectTrigger className="h-11 rounded-full border-0 bg-muted/60 px-4 dark:bg-muted/40" aria-label="Filter by department">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.skill} onValueChange={(v) => setFilters((f) => ({ ...f, skill: v as Filters["skill"] }))}>
          <SelectTrigger className="h-11 rounded-full border-0 bg-muted/60 px-4 dark:bg-muted/40" aria-label="Filter by skill level">
            <SelectValue placeholder="All Skill Levels" />
          </SelectTrigger>
          <SelectContent>
            {["All", "Trainee", "Junior", "Senior", "Lead", "Specialist"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v as Filters["status"] }))}>
          <SelectTrigger className="h-11 rounded-full border-0 bg-muted/60 px-4 dark:bg-muted/40" aria-label="Filter by status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {["All", "Active", "On-Leave"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Members table card */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="text-base">Team Members ({filtered.length})</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allVisibleSelected}
              onCheckedChange={(v) => toggleSelectAll(Boolean(v))}
              aria-label="Select all visible"
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Skill Level</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(m.id)}
                        onCheckedChange={(v) => toggleOne(m.id, Boolean(v))}
                        aria-label={`Select ${m.name}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{m.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.empId}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">{m.department}</TableCell>

                    <TableCell>
                      <Badge className={`capitalize ${skillBadgeStyle(m.skill)}`}>{m.skill}</Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {m.contract} <span className="text-muted-foreground">({m.hours})</span>
                    </TableCell>

                    <TableCell>
                      <StatusPill status={m.status} />
                    </TableCell>

                    <TableCell>{m.experienceYears} years</TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {m.availability.map((a) => (
                          <span key={a} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                            {a}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label={`More for ${m.name}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No team members match your filters.
            </div>
          )}
        </CardContent>
      </Card>
      <AddStaffMemberModal open={showModal} onClose={() => setShowModal(false)} />
    </main>
  )
}
