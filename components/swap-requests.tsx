"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Search,
  X,
  ArrowLeftRight,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// --- Popup Modal Component ---

function SwapRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {  
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-request-title"
      aria-describedby="swap-request-description"
      className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/30"
      tabIndex={-1}
    >
      <div className="bg-background rounded-lg border p-6 shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex flex-col gap-2 mb-4">
          <h2 id="swap-request-title" className="text-lg font-semibold">Create New Swap Request</h2>
          <p id="swap-request-description" className="text-muted-foreground text-sm">
            Submit a new shift swap request. All fields marked with * are required.
          </p>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="requester" className="text-sm font-medium">Requester *</label>
              <select id="requester" name="requester" className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select requesting nurse</option>
                <option value="nurse1">Sarah Johnson</option>
                <option value="nurse2">Emily Davis</option>
                <option value="nurse3">james Wilson</option>
                <option value="nurse4">David Lee</option>
                <option value="nurse5">Anna Rodriguez</option>
                <option value="nurse6">Robert kin</option>
                <option value="nurse7">Lisa Thomsan</option>

              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="target" className="text-sm font-medium">Target Nurse *</label>
              <select id="target" name="target" className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select target nurse</option>
                <option value="nurse1">Sarah Johnson</option>
                <option value="nurse2">Emily Davis</option>
                <option value="nurse3">james Wilson</option>
                <option value="nurse4">David Lee</option>
                <option value="nurse5">Anna Rodriguez</option>
                <option value="nurse6">Robert kin</option>
                <option value="nurse7">Lisa Thomsan</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-2 border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right-left w-4 h-4 text-muted-foreground" aria-hidden="true"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>
            <h4 className="font-medium">Shift to Give Up</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Original Shift Date *</label>
              <input type="date" name="originalShiftDate" className="w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Original Shift Type *</label>
              <select name="originalShiftType" className="w-full border rounded-md px-3 py-2 text-sm" required >
                <option value="">Select shift type</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-2 border-b">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right-left w-4 h-4 text-muted-foreground" aria-hidden="true"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>
            <h4 className="font-medium">Shift to Give Up</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Requested Shift Date *</label>
              <input type="date" name="requestedShiftDate" className="w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Requested Shift Type *</label>
              <select name="requestedShiftType" className="w-full border rounded-md px-3 py-2 text-sm" required>
                <option value="">Select shift type</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">Reason for Swap Request *</label>
            <textarea id="reason" name="reason" className="w-full border rounded-md px-3 py-2 text-base min-h-[80px]" required placeholder="Please provide a detailed reason for this swap request..." />
            <p className="text-xs text-muted-foreground">Be specific about why this swap is needed (e.g., medical appointment, family emergency, etc.)</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">Priority Level</label>
            <select id="priority" name="priority" className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="medium">Medium - Standard request</option>
              <option value="high">High - Urgent</option>
              <option value="low">Low - Non-urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">Submit Request</Button>
          </div>
        </form>
        <button type="button" className="absolute top-4 right-4 opacity-70 hover:opacity-100" onClick={onClose} aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

// --- Rest of your SwapRequests component ---
type Status = "pending" | "approved" | "conflict"
type Priority = "low" | "medium" | "high"

type Person = { name: string; dept: string; initials: string }
type SwapRow = {
  id: string; status: Status; priority: Priority; from: Person; to: Person;
  submittedDate: string; submittedTime: string; risk?: "warning" | "none"
}

const DATA: SwapRow[] = [
  { id: "#swap-001", status: "pending", priority: "high", from: { name: "Sarah Johnson", dept: "Emergency", initials: "SJ" }, to: { name: "Mike Chen", dept: "ICU", initials: "MC" }, submittedDate: "Fri, Jan 12", submittedTime: "04:00 PM", risk: "none" },
  { id: "#swap-002", status: "approved", priority: "medium", from: { name: "Emily Davis", dept: "ICU", initials: "ED" }, to: { name: "James Wilson", dept: "ICU", initials: "JW" }, submittedDate: "Wed, Jan 10", submittedTime: "07:50 PM", risk: "none" },
  { id: "#swap-003", status: "conflict", priority: "high", from: { name: "David Lee", dept: "Surgery", initials: "DL" }, to: { name: "Anna Rodriguez", dept: "Cardiology", initials: "AR" }, submittedDate: "Thu, Jan 11", submittedTime: "10:15 PM", risk: "warning" },
  { id: "#swap-004", status: "pending", priority: "low", from: { name: "Lisa Thompson", dept: "Pediatrics", initials: "LT" }, to: { name: "Robert Kim", dept: "Radiology", initials: "RK" }, submittedDate: "Fri, Jan 12", submittedTime: "04:30 PM", risk: "none" },
]

function StatusBadge({ status }: { status: Status }) {
  if (status === "approved") {
    return (
      <Badge className="rounded-full px-2 h-6 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
        Approved
      </Badge>
    )
  }
  if (status === "conflict") {
    return (
      <Badge className="rounded-full px-2 h-6 bg-rose-500/15 text-rose-700 dark:text-rose-400">
        <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
        Has Conflicts
      </Badge>
    )
  }
  return (
    <Badge className="rounded-full px-2 h-6 bg-amber-500/15 text-amber-700 dark:text-amber-400">
      <Clock className="mr-1.5 h-3.5 w-3.5" />
      Pending Review
    </Badge>
  )
}

function PriorityChip({ level }: { level: Priority }) {
  const map: Record<Priority, string> = {
    high: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    medium: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    low: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
  }
  return <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs ${map[level]}`}>{level[0].toUpperCase() + level.slice(1)}</span>
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

export function SwapRequests() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [modalOpen, setModalOpen] = useState(false)

  const counts = useMemo(() => ({
    pending: DATA.filter((r) => r.status === "pending").length,
    conflict: DATA.filter((r) => r.status === "conflict").length,
    high: DATA.filter((r) => r.priority === "high").length,
  }), [])

  const filtered = useMemo(() => {
    return DATA.filter((r) => {
      const q = query.toLowerCase().trim()
      const matchesQuery = !q || r.id.toLowerCase().includes(q) || r.from.name.toLowerCase().includes(q) || r.to.name.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter
      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [query, statusFilter, priorityFilter])

  return (
    <div className="space-y-6">
      {/* Heading */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Swap Requests</h1>
        <p className="text-sm text-muted-foreground">Manage shift swap requests and approvals</p>
      </header>

      {/* KPI row */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-amber-500"><Clock className="h-4 w-4" /></span>
          <span className="text-muted-foreground">Pending:</span>
          <span className="font-medium text-foreground">{counts.pending}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-rose-500"><AlertTriangle className="h-4 w-4" /></span>
          <span className="text-muted-foreground">Conflicts:</span>
          <span className="font-medium text-foreground">{counts.conflict}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-rose-500"><AlertTriangle className="h-4 w-4" /></span>
          <span className="text-muted-foreground">High Priority:</span>
          <span className="font-medium text-foreground">{counts.high}</span>
        </div>
      </div>

      {/* CTA */}
      <Button
        className="w-full h-10 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Swap Request
      </Button>
      {/* Popup modal */}
      <SwapRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by nurse name or request ID..."
            className="pl-9 w-full"
            aria-label="Search swap requests"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full" aria-label="Filter by status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="conflict">Has Conflicts</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full" aria-label="Filter by priority">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Request ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Swap Details</TableHead>
                <TableHead className="w-[160px]">Submitted</TableHead>
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell><PriorityChip level={r.priority} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <PersonPill p={r.from} />
                      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <PersonPill p={r.to} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{r.submittedDate}</div>
                    <div className="text-xs text-muted-foreground">{r.submittedTime}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" aria-label="Approve" className="h-8 w-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Reject" className="h-8 w-8 rounded-full bg-transparent">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="More actions" className="h-8 w-8 rounded-full">
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

      {/* Inline notice */}
      <div className="rounded-md border bg-destructive/5 text-destructive px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">Some swap requests have conflicts and may require manual review before approval.</p>
        </div>
      </div>
    </div>
  )
}