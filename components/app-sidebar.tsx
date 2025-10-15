"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import {
  CalendarCheck2,
  ClipboardList,
  FileText,
  GitCompare,
  LayoutDashboard,
  Settings2,
  UsersRound,
  Activity,
} from "lucide-react"
import { useSidebar } from "./sidebar-context"

const items = [
  { label: "Roster Overview", icon: LayoutDashboard, href: "/" },
  { label: "Roster Builder", icon: ClipboardList, href: "/roster-builder" },
  { label: "Swap Requests", icon: GitCompare, href: "/swap-requests" },
  { label: "Manual Adjustments", icon: Settings2, href: "/manual-adjustments" },
  { label: "Rules & Policies", icon: FileText, href: "/rules-policies" },
  { label: "Team Manager", icon: UsersRound, href: "/team-manager" },
  { label: "Reports", icon: CalendarCheck2, href: "/reports" },
]

function DesktopSidebar() {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()

  // fixed widths so clicking list items never changes the sidebar width
  const widthClass = isCollapsed ? "md:w-[72px]" : "md:w-[240px]"

  return (
    <aside
      className={cn(
        // remove width transition on click; only animate when collapsed state changes
        "hidden md:block shrink-0 h-dvh border-r bg-card ease-in-out",
        widthClass
      )}
      aria-label="Primary"
    >
      {/* Brand row */}
      <div className={cn("px-4 py-5 flex items-center", isCollapsed ? "justify-center gap-0" : "gap-3")}>
        <div className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-border bg-foreground text-background">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* hide brand text entirely when collapsed so it doesn't occupy width */}
        {!isCollapsed && (
          <div className="text-sm">
            <div className="font-medium">Swap Manager</div>
            <div className="text-muted-foreground">Daily Adjustments</div>
          </div>
        )}
      </div>

      {/* Nav */}
      {!isCollapsed ? (
        // OPEN (unchanged styling)
        <nav className="px-2 pb-6">
          <ul className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="max-w-[200px]">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : (
        // COLLAPSED (replicates screenshot behavior)
        <nav className="pb-6">
          <ul className="flex flex-col items-center gap-2">
            {items.map((item) => {
              const Icon = item.icon
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

              return (
                <li key={item.label} className="w-full flex justify-center">
                  <Link
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    // square icon button centered; black when active
                    className={cn(
                      "grid place-items-center h-12 w-12 rounded-2xl transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </aside>
  )
}

function MobileDrawer() {
  const { isMobileOpen, closeMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={closeMobile}
      />
      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-[260px] border-r bg-card p-4 md:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-border bg-foreground text-background">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="text-sm">
            <div className="font-medium">Swap Manager</div>
            <div className="text-muted-foreground">Daily Adjustments</div>
          </div>
        </div>

        <nav className="px-1">
          <ul className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export function AppSidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileDrawer />
    </>
  )
}
