"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, ChevronRight, Search, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type Rule = {
  id: string
  title: string
  description: string
  category: "compliance" | "skills" | "fairness" | "preference"
  severity: "low" | "medium" | "high"
  violations: number
  isHard: boolean
  enabled: boolean
}

const RULES_SEED: Rule[] = [
  {
    id: "rule-1",
    title: "Maximum Consecutive Night Shifts",
    description: "No nurse can work more than 2 consecutive night shifts",
    category: "compliance",
    severity: "high",
    violations: 3,
    isHard: true,
    enabled: true,
  },
  {
    id: "rule-2",
    title: "Weekly Hour Limit",
    description: "Maximum 48 hours per week per nurse",
    category: "compliance",
    severity: "high",
    violations: 1,
    isHard: true,
    enabled: true,
  },
  {
    id: "rule-3",
    title: "Minimum Rest Between Shifts",
    description: "At least 11 hours rest between consecutive shifts",
    category: "compliance",
    severity: "high",
    violations: 0,
    isHard: true,
    enabled: true,
  },
  {
    id: "rule-4",
    title: "ICU Certification Required",
    description: "ICU shifts must be assigned to certified ICU nurses",
    category: "skills",
    severity: "high",
    violations: 0,
    isHard: true,
    enabled: true,
  },
  {
    id: "rule-5",
    title: "Fair Weekend Distribution",
    description: "Distribute weekend shifts evenly among all nurses",
    category: "fairness",
    severity: "medium",
    violations: 2,
    isHard: false,
    enabled: true,
  },
  {
    id: "rule-6",
    title: "Preferred Shift Requests",
    description: "Honor nurse shift preferences when possible",
    category: "preference",
    severity: "low",
    violations: 5,
    isHard: false,
    enabled: false,
  },
  {
    id: "rule-7",
    title: "Senior Nurse Coverage",
    description: "Each shift should have at least one senior nurse",
    category: "skills",
    severity: "medium",
    violations: 1,
    isHard: false,
    enabled: true,
  },
  {
    id: "rule-8",
    title: "Vacation Request Priority",
    description: "Approved vacation requests take precedence over scheduling",
    category: "compliance",
    severity: "high",
    violations: 0,
    isHard: true,
    enabled: true,
  },
]

type TabKey = "all" | "hard" | "soft"

function categoryBadgeLabel(cat: Rule["category"]) {
  switch (cat) {
    case "compliance":
      return "compliance"
    case "skills":
      return "skills"
    case "fairness":
      return "fairness"
    case "preference":
      return "preference"
  }
}

function severityBadgeStyle(sev: Rule["severity"]) {
  // semantic emphasis without hardcoding raw colors
  if (sev === "high") return "bg-destructive/15 text-destructive"
  if (sev === "medium") return "bg-muted text-foreground/70"
  return "bg-muted text-foreground/60"
}

export default function RulesPolicies() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [rows, setRows] = useState<Rule[]>(RULES_SEED)

  const totalViolations = useMemo(() => rows.reduce((sum, r) => sum + r.violations, 0), [rows])

  const filtered = useMemo(() => {
    let f = rows
    if (activeTab === "hard") f = f.filter((r) => r.isHard)
    if (activeTab === "soft") f = f.filter((r) => !r.isHard)
    if (query.trim()) {
      const q = query.toLowerCase()
      f = f.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      )
    }
    return f
  }, [rows, query, activeTab])

  const toggleEnabled = (id: string, enabled: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)))
  }

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Rules & Policies</h1>
        <p className="text-sm text-muted-foreground">Manage scheduling rules and compliance requirements</p>
      </section>

      {/* KPI and actions */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <AlertTriangle className="size-4 text-destructive" aria-hidden="true" />
              <span className="text-sm">{totalViolations} violations</span>
            </Button>
          </div>
          <Button className="gap-2">
            <ShieldAlert className="size-4" aria-hidden="true" />
            Add Rule
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules and policies..."
            className="pl-9"
            aria-label="Search rules and policies"
          />
        </div>

        {/* Segmented filter */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all" className="px-6">
              All ({rows.length})
            </TabsTrigger>
            <TabsTrigger value="hard" className="px-6">
              Hard ({rows.filter((r) => r.isHard).length})
            </TabsTrigger>
            <TabsTrigger value="soft" className="px-6">
              Soft ({rows.filter((r) => !r.isHard).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Rules list */}
      <section className="flex flex-col gap-3">
        {filtered.map((rule) => (
          <Card key={rule.id} className="rounded-xl">
            <CardContent className="p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center gap-4">
                {/* Left: title + meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base md:text-lg truncate">{rule.title}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {categoryBadgeLabel(rule.category)}
                    </Badge>
                    {rule.violations > 0 && (
                      <Badge className="bg-destructive/15 text-destructive">{rule.violations} violations</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                </div>

                {/* Middle: severity */}
                <div className="justify-self-start md:justify-self-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${severityBadgeStyle(rule.severity)}`}>
                    {rule.severity}
                  </span>
                </div>

                {/* Right: toggle + chevron */}
                <div className="flex items-center gap-3 justify-self-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {rule.isHard ? "hard" : "soft"}
                    </span>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(v) => toggleEnabled(rule.id, Boolean(v))}
                      aria-label={`Toggle ${rule.title}`}
                    />
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Open details">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground py-8 text-center">No rules match your filters.</div>
        )}
      </section>
    </main>
  )
}
