"use client"

import {
  Bell,
  PanelLeftOpen,
  PanelLeftClose,
  PanelsTopLeft,
  Brain,
  AlertTriangle,
  CalendarDays,
  ArrowRight,
  X,
  Send
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

type Notif = {
  id: string
  title: string
  description: string
  staffInitials: string
  staffName: string
  dept: string
  date: string
  shift: string
  time: string
}

const SEED_BASE: Omit<Notif, "id">[] = [
  {
    title: "Critical Scheduling Conflict",
    description: "Double-booking detected – nurse scheduled for overlapping shifts",
    staffInitials: "ED",
    staffName: "Emily Davis",
    dept: "Emergency",
    date: "Tue, Sep 30",
    shift: "Night Shift",
    time: "04:32 PM",
  },
  {
    title: "Rest Period Violation",
    description: "Insufficient rest time between consecutive shifts",
    staffInitials: "JM",
    staffName: "Jennifer Miller",
    dept: "ICU",
    date: "Thu, Oct 2",
    shift: "Day Shift",
    time: "03:32 PM",
  },
  {
    title: "Skill Level Mismatch",
    description: "Assigned shift requires a senior nurse",
    staffInitials: "RB",
    staffName: "Robert Brown",
    dept: "Surgery",
    date: "Fri, Oct 3",
    shift: "Evening",
    time: "02:32 PM",
  },
]

// create exactly 8 notifications
const SEED: Notif[] = Array.from({ length: 8 }, (_, i) => {
  const base = SEED_BASE[i % SEED_BASE.length]
  return { id: `n${i + 1}`, ...base }
})

// --- Copilot types ---
type ChatMsg = { id: string; role: "user" | "assistant"; text: string }

export function Topbar() {
  const { openMobile, isCollapsed, toggleCollapsed } = useSidebar()

  const [notifs, setNotifs] = useState<Notif[]>(SEED)
  const [openPanel, setOpenPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Copilot state
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "a1", role: "assistant", text: "Hi! I can help with coverage, compliance checks, and quick reports." },
  ])
  const [draft, setDraft] = useState("")
  const copilotRef = useRef<HTMLDivElement | null>(null)

  // click-outside to close notifications
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (openPanel && panelRef.current && !panelRef.current.contains(t)) setOpenPanel(false)
      if (copilotOpen && copilotRef.current && !copilotRef.current.contains(t)) setCopilotOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [openPanel, copilotOpen])

  // ESC to close drawers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenPanel(false)
        setCopilotOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const clearAll = () => setNotifs([])

// ---- Copilot helpers ----
async function fetchAIReply(messages: ChatMsg[]) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })
  const data = await res.json()
  return data.reply
}

const sendMessage = async (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return

  const user: ChatMsg = { id: crypto.randomUUID(), role: "user", text: trimmed }
  setMessages((prev) => [...prev, user])
  setDraft("")

  const conversation = [...messages, user]
  const aiText = await fetchAIReply(conversation)

  const aiMsg: ChatMsg = { id: crypto.randomUUID(), role: "assistant", text: aiText }
  setMessages((prev) => [...prev, aiMsg])
}

const runQuick = (label: string) => sendMessage(label)


  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 items-center gap-3 px-4">
        {/* Mobile: open drawer */}
        <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open navigation" onClick={openMobile}>
          {"\u2630"}
        </Button>

        {/* Desktop: collapse/expand control */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>

        {/* Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="font-semibold tracking-tight">St. Mary&apos;s Hospital</span>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          {/* AI Copilot trigger: desktop pill + mobile icon */}
          <Button
            variant="outline"
            className="hidden sm:inline-flex h-9 rounded-full gap-2 px-3 bg-background items-center"
            aria-label="Open AI Copilot"
            onClick={() => setCopilotOpen(true)}
          >
            <Brain className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">AI Copilot</span>
            <span aria-hidden className="mx-1 h-4 w-px bg-border" />
            {/* the “other” icon combined in the same pill */}
            <PanelsTopLeft className="h-4 w-4 opacity-70" aria-hidden="true" />
          </Button>

          {/* Mobile: brain-only button to open Copilot */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Open AI Copilot"
            onClick={() => setCopilotOpen(true)}
          >
            <Brain className="h-5 w-5" />
          </Button>

          {/* Notifications with badge */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="text-muted-foreground"
              onClick={() => setOpenPanel((v) => !v)}
            >
              <Bell className="h-5 w-5" />
            </Button>

            {notifs.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
                {notifs.length}
              </span>
            )}
          </div>

          {/* Avatar */}
          <Avatar className="ml-1 h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Notifications Panel (smaller) */}
      {openPanel && (
        <div
          ref={panelRef}
          className="fixed right-4 top-16 z-40 w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border bg-background shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="text-sm font-medium">Notifications</h3>
              {notifs.length > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{notifs.length} new</span>
              )}
            </div>
            <button
              onClick={clearAll}
              className={cn(
                "text-xs font-medium",
                notifs.length ? "text-primary hover:underline" : "text-muted-foreground cursor-default"
              )}
              disabled={!notifs.length}
            >
              Clear all
            </button>
          </div>

          {/* List */}
          <div className="max-h-[60vh] overflow-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</div>
            ) : (
              notifs.map((n, idx) => (
                <div
                  key={n.id}
                  className={cn("grid grid-cols-[1fr_auto] gap-3 px-4 py-3", idx !== notifs.length - 1 && "border-b")}
                >
                  <div className="min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
                        <p className="text-sm font-medium">{n.title}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>

                    <div className="mt-2 flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">{n.staffInitials}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <span className="font-medium">{n.staffName}</span>{" "}
                        <span className="text-muted-foreground">{n.dept}</span>
                      </div>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{n.date}</span>
                      <ArrowRight className="h-3 w-3 opacity-60" />
                      <span className="font-medium">{n.shift}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5">
            <Button variant="outline" className="h-9 w-full justify-center rounded-full text-sm">
              View All Notifications
            </Button>
          </div>
        </div>
      )}

      {/* ---- Copilot Drawer ---- */}
      {copilotOpen && (
        <>
          {/* dim backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setCopilotOpen(false)} />
          <div
            ref={copilotRef}
            className="fixed right-0 top-0 z-50 flex h-screen w-[420px] max-w-[calc(100vw-1rem)] flex-col border-l bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold">AI Copilot</div>
                  <div className="text-xs text-muted-foreground">Rostering Assistant</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCopilotOpen(false)} aria-label="Close Copilot">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs bar (static “Activity” marker like screenshot) */}
            <div className="flex items-center gap-4 border-b px-4">
              <button className="relative py-2 text-sm font-medium after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-foreground">
                Activity
              </button>
            </div>

            {/* Content scroll area */}
            <div className="flex-1 space-y-4 overflow-auto px-4 py-4">
              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2">
                {["Show system status", "Find coverage gaps", "Optimize schedules", "Check compliance"].map((t) => (
                  <button
                    key={t}
                    onClick={() => runQuick(t)}
                    className="rounded-full border px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="text-amber-500">⚡</span>
                  Quick Actions
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Check Coverage",
                    "Optimize Schedule",
                    "Compliance Audit",
                    "Generate Report",
                    "Swap Request",
                    "Manual Adjustments",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => runQuick(q)}
                      className="rounded-xl border px-4 py-3 text-left text-sm hover:bg-accent"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      m.role === "assistant"
                        ? "bg-muted text-foreground"
                        : "ml-auto bg-primary text-primary-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form
              className="flex items-center gap-2 border-t p-3"
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(draft)
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask AI Copilot anything..."
                className="h-10 flex-1 rounded-full"
              />
              <Button type="submit" className="h-10 w-10 rounded-full p-0" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </header>
  )
}
