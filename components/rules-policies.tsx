"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ChevronRight,
  Heart,
  ListChecks,
  Search,
  Shield,
  ShieldAlert,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AddRuleModal } from "./RuleModal"

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

function severityTone(sev: Rule["severity"]) {
  if (sev === "high") return "text-destructive"
  if (sev === "medium") return "text-foreground/70"
  return "text-foreground/60"
}

export default function RulesPolicies() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [rows, setRows] = useState<Rule[]>(RULES_SEED)
  const [showModal, setShowModal] = useState(false)


  const counts = useMemo(
    () => ({
      all: rows.length,
      hard: rows.filter((r) => r.isHard).length,
      soft: rows.filter((r) => !r.isHard).length,
    }),
    [rows],
  )

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
      {/* Title + Subheader */}
      <section className="py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: title + subtitle (stacked) */}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Rules & Policies
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage scheduling rules and compliance requirements
            </p>
          </div>

          {/* Right: KPI + primary action (wraps on small, inline on sm+) */}
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1.5 text-sm text-rose-700 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="truncate">{totalViolations} violations</span>
            </span>
            <Button
              className="w-full sm:w-auto gap-2 bg-foreground text-background hover:bg-foreground/90"
              aria-label="Add Rule"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sm:whitespace-nowrap">Add Rule</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Search (pill) */}
      <section>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules and policies..."
            aria-label="Search rules and policies"
            className="h-11 w-full rounded-full border-0 bg-muted/60 pl-10 shadow-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-muted/40"
          />
        </div>
      </section>

      {/* Segmented Tabs */}
      <section>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/60 p-1 dark:bg-muted/40 md:w-auto md:min-w-[520px]">
            <TabsTrigger
              value="all"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ListChecks className="mr-2 h-4 w-4" />
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value="hard"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Shield className="mr-2 h-4 w-4" />
              Hard ({counts.hard})
            </TabsTrigger>
            <TabsTrigger
              value="soft"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Heart className="mr-2 h-4 w-4" />
              Soft ({counts.soft})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Context band (changes with tab like in the mock) */}
      {activeTab !== "all" && (
        <section>
          <div className="rounded-xl border bg-card px-4 py-3 text-sm">
            {activeTab === "soft" ? (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="font-medium">Soft Rules</span>
                <span className="text-muted-foreground">
                  Preferences & fairness – can be violated if necessary
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Hard Rules</span>
                <span className="text-muted-foreground">
                  Compliance & safety – must always be met
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Rules list */}
      <section className="flex flex-col gap-3">
        {filtered.map((rule) => (
          <Card key={rule.id} className="rounded-xl">
            <CardContent className="p-4 md:p-5">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_auto]">
                {/* Title + Meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-medium md:text-lg">{rule.title}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {categoryBadgeLabel(rule.category)}
                    </Badge>
                    {rule.violations > 0 && (
                      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300">
                        {rule.violations} violations
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                </div>

                {/* Severity (as plain tone on the right like mock) */}
                <div className="justify-self-start text-sm md:justify-self-center">
                  <span className={`capitalize ${severityTone(rule.severity)}`}>
                    {rule.severity}
                  </span>
                </div>

                {/* Toggle + Chevron */}
                <div className="flex items-center justify-self-end gap-3">
                  <div className="flex items-center gap-2">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {rule.isHard ? "hard" : "soft"}
                    </span>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(v) => toggleEnabled(rule.id, Boolean(v))}
                      aria-label={`Toggle ${rule.title}`}
                    />
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Open details">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No rules match your filters.
          </div>
        )}
      </section>
      <AddRuleModal open={showModal} onClose={() => setShowModal(false)} />
    </main>
  )
}
