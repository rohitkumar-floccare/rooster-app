"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Edit3,
  MoreHorizontal,
  Search,
  ShieldHalf,
  TriangleAlert,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Person = {
  name: string
  dept: string
  initials: string
}

type AdjStatus = "pending" | "under_review" | "approved" | "resolved"
type Priority = "low" | "medium" | "high"
type AdjType = "rule_override" | "policy_exception"

type AdjRow = {
  id: string
  status: AdjStatus
  type: AdjType
  priority: Priority
  nurse: Person
  submittedDateTime: string
  submittedBy: string
}

const ROWS: AdjRow[] = [
  {
    id: "#adj-001",
    status: "pending",
    type: "rule_override",
    priority: "high",
    nurse: { name: "Sarah Johnson", dept: "Emergency", initials: "SJ" },
    submittedDateTime: "Fri, Jan 12, 09:00 PM",
    submittedBy: "Dr. Michael Torres",
  },
  {
    id: "#adj-003",
    status: "under_review",
    type: "policy_exception",
    priority: "medium",
    nurse: { name: "David Lee", dept: "Surgery", initials: "DL" },
    submittedDateTime: "Thu, Jan 11, 02:50 PM",
    submittedBy: "Dr. Patricia Kim",
  },
]

function StatusBadge({ status }: { status: AdjStatus }) {
  const map: Record<AdjStatus, { label: string; cls: string }> = {
    pending: {
      label: "Pending Approval",
      cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    under_review: {
      label: "Under Review",
      cls: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    },
    approved: {
      label: "Approved",
      cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    resolved: {
      label: "Resolved",
      cls: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
    },
  }
  const item = map[status]
  return <Badge className={`h-6 rounded-full px-2 ${item.cls}`}>{item.label}</Badge>
}

function PriorityChip({ level }: { level: Priority }) {
  const map: Record<Priority, string> = {
    high: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    medium: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
    low: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
  }
  return <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs ${map[level]}`}>{level}</span>
}

function TypePill({ type }: { type: AdjType }) {
  if (type === "rule_override") {
    return (
      <span className="inline-flex items-center gap-2">
        <ShieldHalf className="h-4 w-4 text-rose-500" aria-hidden="true" />
        <span className="font-medium">Rule Override</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2">
      <TriangleAlert className="h-4 w-4 text-sky-500" aria-hidden="true" />
      <span className="font-medium">Policy Exception</span>
    </span>
  )
}

function PersonPill({ p }: { p: Person }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-[11px]">{p.initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm font-medium leading-5">{p.name}</div>
        <div className="text-xs text-muted-foreground leading-4">{p.dept}</div>
      </div>
    </div>
  )
}

export function ManualAdjustments() {
  const [query, setQuery] = useState("")
  const [statusTab, setStatusTab] = useState<"pending" | "approved" | "resolved" | "all">("pending")
  const [dept, setDept] = useState("all")

  const kpis = useMemo(() => {
    return {
      pending: ROWS.filter((r) => r.status === "pending").length,
      highPriority: ROWS.filter((r) => r.priority === "high").length,
      approved: ROWS.filter((r) => r.status === "approved").length,
    }
  }, [])

  const filtered = useMemo(() => {
    return ROWS.filter((r) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        r.id.toLowerCase().includes(q) ||
        r.nurse.name.toLowerCase().includes(q) ||
        r.nurse.dept.toLowerCase().includes(q)
      const matchesStatus =
        statusTab === "all"
          ? true
          : statusTab === "pending"
            ? r.status === "pending" || r.status === "under_review"
            : r.status === statusTab
      const matchesDept = dept === "all" ? true : r.nurse.dept.toLowerCase() === dept
      return matchesQuery && matchesStatus && matchesDept
    })
  }, [query, statusTab, dept])

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Manual Adjustments</h1>
        <p className="text-sm text-muted-foreground">Special cases and rule overrides requiring manual intervention</p>
      </header>

      {/* Tabs + KPI + CTA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="pending">Pending ({kpis.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <span className="text-muted-foreground">Pending:</span>
            <span className="font-medium text-foreground">{kpis.pending}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <span className="text-muted-foreground">High Priority:</span>
            <span className="font-medium text-foreground">{kpis.highPriority}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-muted-foreground">Approved:</span>
            <span className="font-medium text-foreground">{kpis.approved}</span>
          </div>
          <Button className="ml-auto md:ml-0">
            <Edit3 className="mr-2 h-4 w-4" />
            New Override
          </Button>
        </div>
      </div>

      {/* Filters: search + department */}
      <div className="grid gap-3 md:grid-cols-[1fr,220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by nurse, department, or ID..."
            className="pl-9"
            aria-label="Search manual adjustments"
          />
        </div>

        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger aria-label="Filter by department">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="surgery">Surgery</SelectItem>
            <SelectItem value="icu">ICU</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Adjustment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Affected Nurse</TableHead>
                <TableHead className="w-[220px]">Submitted</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <TypePill type={r.type} />
                  </TableCell>
                  <TableCell>
                    <PriorityChip level={r.priority} />
                  </TableCell>
                  <TableCell>
                    <PersonPill p={r.nurse} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{r.submittedDateTime}</div>
                    <div className="text-xs text-muted-foreground">By: {r.submittedBy}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        aria-label="Approve override"
                        className="h-8 w-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="Reject override"
                        className="h-8 w-8 rounded-full bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        aria-label="Edit override"
                        className="h-8 w-8 rounded-full"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="More actions" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom callout */}
      <div className="rounded-md border border-amber-200/50 bg-amber-500/10 px-4 py-3 text-amber-900 dark:border-amber-500/30 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <div className="space-y-1">
            <p className="font-medium">Chief Nursing Officer Authority:</p>
            <p className="text-sm">
              As Vanessa Martinez, you can approve any override immediately for patient safety. All approvals are logged
              and require post-incident review within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
