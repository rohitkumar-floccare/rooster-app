import { useEffect, useState } from "react"
import { X, Plus, Check, RefreshCw, ChartColumn, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const departmentsList = ["Emergency", "ICU", "Surgery", "Neurology", "Pediatrics", "Oncology"];
const shiftTypes = ["Day", "Night", "Morning", "Evening", "Weekend"];

export default function QuickAssignDialog({ onClose }: { onClose: () => void }) {
  // Checkbox state

  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    setAnimate(true)
  }, [])

  const [scope, setScope] = useState({
    currentWeek: true,
    specificDepartments: false,
    matchSkills: true,
  });
  const [priority, setPriority] = useState({
    preferFullTime: true,
    balanceWorkload: true,
    avoidOvertime: true,
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const [shiftsToFill, setShiftsToFill] = useState<Record<string, boolean>>(
    Object.fromEntries(shiftTypes.map(s => [s, true]))
  );

  // Checkbox toggle helpers
  function toggleScope(key: keyof typeof scope) {
    setScope(prev => ({ ...prev, [key]: !prev[key] }))
  }
  function togglePriority(key: keyof typeof priority) {
    setPriority(prev => ({ ...prev, [key]: !prev[key] }))
  }
  function toggleShiftType(type: string) {
    setShiftsToFill(prev => ({ ...prev, [type]: !prev[type] }))
  }

  // Dropdown helpers
  function handleDeptSelect(dept: string) {
    setSelectedDepartments(prev =>
      prev.includes(dept)
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-assign-title"
      aria-describedby="quick-assign-desc"
      className={cn(
        "bg-background fixed top-1/2 left-1/2 z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg max-w-2xl max-h-[80vh] overflow-y-auto",
        "transition-all duration-300",
        animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      tabIndex={-1}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 id="quick-assign-title" className="text-lg leading-none font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Quick Assign Nurses
        </h2>
        <p id="quick-assign-desc" className="text-muted-foreground text-sm">
          Automatically assign available nurses to unfilled shifts for the selected week.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assignment Scope Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
            <div className="p-4">
              <h4 className="font-medium text-sm mb-3">Assignment Scope</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={scope.currentWeek}
                    onClick={() => toggleScope("currentWeek")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      scope.currentWeek ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="current-week"
                  >
                    {scope.currentWeek && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="current-week">Current Week (1)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={scope.specificDepartments}
                    onClick={() => toggleScope("specificDepartments")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      scope.specificDepartments ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="specific-departments"
                  >
                    {scope.specificDepartments && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="specific-departments">Specific Departments Only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={scope.matchSkills}
                    onClick={() => toggleScope("matchSkills")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      scope.matchSkills ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="skill-matching"
                  >
                    {scope.matchSkills && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="skill-matching">Match Skill Requirements</label>
                </div>
              </div>
            </div>
          </div>
          {/* Priority Rules Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
            <div className="p-4">
              <h4 className="font-medium text-sm mb-3">Priority Rules</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={priority.preferFullTime}
                    onClick={() => togglePriority("preferFullTime")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      priority.preferFullTime ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="prefer-full-time"
                  >
                    {priority.preferFullTime && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="prefer-full-time">Prefer Full-time Staff</label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={priority.balanceWorkload}
                    onClick={() => togglePriority("balanceWorkload")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      priority.balanceWorkload ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="balance-workload"
                  >
                    {priority.balanceWorkload && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="balance-workload">Balance Workload</label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={priority.avoidOvertime}
                    onClick={() => togglePriority("avoidOvertime")}
                    className={cn(
                      "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                      priority.avoidOvertime ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                    )}
                    id="avoid-overtime"
                  >
                    {priority.avoidOvertime && <Check className="size-3.5" />}
                  </button>
                  <label className="text-sm font-medium" htmlFor="avoid-overtime">Avoid Overtime</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Target Departments */}
        <div className="relative">
          <label className="text-sm font-medium mb-2 block">Target Departments</label>
          <button
            type="button"
            className={cn(
              "border-input flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
              selectedDepartments.length ? "" : "text-muted-foreground"
            )}
            aria-expanded={showDeptDropdown}
            onClick={() => setShowDeptDropdown((prev) => !prev)}
          >
            <span>
              {selectedDepartments.length
                ? selectedDepartments.join(", ")
                : "Select departments to assign"}
            </span>
            <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
          </button>
          {showDeptDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-auto">
              {departmentsList.map(dept => (
                <div
                  key={dept}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer",
                    selectedDepartments.includes(dept) ? "bg-accent font-semibold" : ""
                  )}
                  onClick={() => handleDeptSelect(dept)}
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept)}
                    readOnly
                    className="size-4 mr-2"
                  />
                  {dept}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Shift Types */}
        <div>
          <label className="text-sm font-medium mb-2 block">Shift Types to Fill</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shiftTypes.map(shift => (
              <div key={shift} className="flex items-center space-x-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={shiftsToFill[shift]}
                  onClick={() => toggleShiftType(shift)}
                  className={cn(
                    "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow focus-visible:ring-[3px]",
                    shiftsToFill[shift] ? "bg-primary text-primary-foreground border-primary" : "bg-input-background"
                  )}
                  id={`shift-${shift.toLowerCase()}`}
                >
                  {shiftsToFill[shift] && <Check className="size-3.5" />}
                </button>
                <label className="text-sm font-medium" htmlFor={`shift-${shift.toLowerCase()}`}>{shift}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Assignment Preview */}
        <div className="flex flex-col gap-6 rounded-xl border bg-blue-50 border-blue-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ChartColumn className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-blue-900 mb-2">Assignment Preview</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Estimated vacant positions: 24 shifts</p>
                  <p>• Available nurses: 25 staff members</p>
                  <p>• Expected assignments: ~18 shifts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          This will automatically assign nurses to open shifts
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-blue-600 text-primary-foreground hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Assign Nurses
          </Button>
        </div>
      </div>
      {/* X/Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100"
        variant="ghost"
        size="icon"
      >
        <X />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}