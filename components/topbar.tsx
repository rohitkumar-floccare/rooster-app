"use client"

import { Bell, PanelLeftOpen, PanelLeftClose, PanelsTopLeft, BrainCircuit } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-context"

export function Topbar() {
  const { openMobile, isCollapsed, toggleCollapsed } = useSidebar()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 items-center gap-3 px-4">
        {/* Mobile: open drawer */}
        <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open navigation" onClick={openMobile}>
          {"\u2630"}
        </Button>

        {/* Desktop: collapse/expand control (kept for functionality) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>

        {/* Title cluster */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* removed: <LayoutGrid className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> */}
          <span className="font-semibold tracking-tight">St. Mary&apos;s Hospital</span>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          {/* AI Copilot pill */}
          <Button
            variant="secondary"
            className="hidden sm:inline-flex h-9 rounded-full gap-2 px-3"
            aria-label="Open AI Copilot"
          >
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">AI Copilot</span>
          </Button>

          {/* Layout options */}
          <Button variant="ghost" size="icon" aria-label="Layout options" className="text-muted-foreground">
            <PanelsTopLeft className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Avatar */}
          <Avatar className="ml-1 h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
