import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { RosterOverview } from "@/components/roster-overview"

export default function Page() {
  return (
    <div className="h-dvh flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <RosterOverview />
        </main>
      </div>
    </div>
  )
}
