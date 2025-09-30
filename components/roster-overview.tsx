"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowLeftRight, Download, Users, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"

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
  const toneClass =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-foreground"
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

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

const sampleWeek: Day[] = [
  {
    date: "Sun 28",
    items: [
      { label: "DAY", value: "6/5" },
      { label: "NIGHT", value: "5/8" },
      { label: "WEEKEND", value: "5/7" },
    ],
  },
  {
    date: "Mon 29",
    isToday: true,
    items: [
      { label: "DAY", status: "Approved", value: "6/9", alert: 1 },
      { label: "NIGHT", value: "10/11" },
      { label: "WEEKEND", value: "3/5" },
    ],
  },
  {
    date: "Tue 30",
    items: [
      { label: "DAY", status: "Pending", value: "12/11" },
      { label: "NIGHT", status: "Conflict", value: "13/10", alert: 1 },
      { label: "WEEKEND", value: "4/5", alert: 1 },
    ],
  },
  {
    date: "Wed 1",
    items: [
      { label: "DAY", value: "9/6" },
      { label: "NIGHT", status: "Approved", value: "8/8" },
      { label: "WEEKEND", value: "7/6" },
    ],
  },
  {
    date: "Thu 2",
    items: [
      { label: "DAY", status: "Approved", value: "4/6" },
      { label: "NIGHT", value: "5/5" },
      { label: "WEEKEND", value: "6/6" },
    ],
  },
  {
    date: "Fri 3",
    items: [
      { label: "DAY", value: "12/8" },
      { label: "NIGHT", value: "5/5" },
      { label: "WEEKEND", value: "5/8", alert: 1 },
    ],
  },
  {
    date: "Sat 4",
    items: [
      { label: "DAY", value: "9/7" },
      { label: "NIGHT", status: "Conflict", value: "5/5" },
      { label: "WEEKEND", status: "Pending", value: "7/5" },
    ],
  },
]

export function RosterOverview() {
  const [dept, setDept] = useState("All Departments")
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-balance">Roster Overview</h1>
        <p className="text-sm text-muted-foreground">2-week roster cycle • Week 1 of 2</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Departments">All Departments</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="ICU">ICU</SelectItem>
            <SelectItem value="Ward A">Ward A</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Coverage Rate" value="104.9%" icon={<Users className="h-4 w-4" />} tone="success" />
        <Stat title="Staff Shortage" value="-15" icon={<AlertTriangle className="h-4 w-4" />} tone="danger" />
        <Stat title="Pending Swaps" value="6" icon={<ArrowLeftRight className="h-4 w-4" />} tone="warning" />
        <Stat title="Active Conflicts" value="2" icon={<AlertCircle className="h-4 w-4" />} tone="danger" />
      </div>

      {/* Alert Banner */}
      <div className="rounded-md border bg-destructive/5 text-destructive px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">
            <span className="font-medium">2 scheduling conflicts</span> require immediate attention.
            <Button variant="link" className="text-destructive pl-2 h-auto p-0">
              Review conflicts →
            </Button>
          </p>
        </div>
      </div>

      {/* Weekly Roster */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly Roster View</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {sampleWeek.map((day) => (
              <Card key={day.date} className="overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
                  <div className="text-xs text-muted-foreground">{day.date}</div>
                  {day.isToday && (
                    <Badge variant="secondary" className="text-[10px]">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  {day.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border p-2 text-xs"
                      style={{
                        background:
                          it.label === "DAY"
                            ? "color-mix(in oklch, var(--color-primary) 7%, transparent)"
                            : it.label === "NIGHT"
                              ? "color-mix(in oklch, oklch(0.6 0.118 184.704) 20%, transparent)"
                              : "color-mix(in oklch, oklch(0.769 0.188 70.08) 15%, transparent)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{it.label}</span>
                          {it.status && (
                            <span
                              className={
                                it.status === "Approved"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : it.status === "Pending"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-red-600 dark:text-red-400"
                              }
                            >
                              {it.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {it.value && <span className="text-muted-foreground">{it.value}</span>}
                          {typeof it.alert === "number" && (
                            <Badge className="bg-red-600 text-white hover:bg-red-600/90">{it.alert}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground flex flex-wrap gap-4">
            <Legend color="oklch(0.95 0.02 95)" label="Day Shift" />
            <Legend color="oklch(0.6 0.118 184.704)" label="Night Shift" />
            <Legend color="oklch(0.769 0.188 70.08)" label="Weekend Shift" />
            <Legend color="oklch(0.828 0.189 84.429)" label="Pending Swap" />
            <Legend color="oklch(0.4 0.17 155)" label="Approved Swap" />
            <Legend color="oklch(0.62 0.24 25)" label="Conflict" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}