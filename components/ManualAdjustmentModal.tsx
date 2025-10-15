"use client"

import React, { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const ADJUSTMENT_TYPES = [
  { value: "rule_override", label: "Rule Override" },
  { value: "policy_exception", label: "Policy Exception" },
]
const DEPARTMENTS = [
  { value: "emergency", label: "Emergency" },
  { value: "surgery", label: "Surgery" },
  { value: "icu", label: "ICU" },
  { value: "pediatrics", label: "Pediatrics" },
]
const NURSES = [
  { id: "nurse1", name: "Sarah Johnson", dept: "Emergency" },
  { id: "nurse2", name: "Mike Chen", dept: "Emergency" },
  { id: "nurse3", name: "Emily Davis", dept: "ICU" },
  { id: "nurse4", name: "James Wilson", dept: "ICU" },
  { id: "nurse5", name: "David Lee", dept: "Surgery" },
  { id: "nurse6", name: "Anna Rodriguez", dept: "Surgery" },
  { id: "nurse7", name: "Lisa Thompson", dept: "Pediatrics" },
  { id: "nurse8", name: "Robert Kim", dept: "Pediatrics" },
]

export function ManualAdjustmentModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  // Form state
  const [type, setType] = useState<string>("")
  const [dept, setDept] = useState<string>("")
  const [nurse, setNurse] = useState<string>("")
  const [justification, setJustification] = useState<string>("")

  // Search for nurse
  const [nurseSearch, setNurseSearch] = useState("")
  const filteredNurses = NURSES.filter(n =>
    n.name.toLowerCase().includes(nurseSearch.toLowerCase())
  )

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-adjust-title"
      aria-describedby="manual-adjust-desc"
      className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg max-w-2xl"
      tabIndex={-1}
      style={{ pointerEvents: "auto" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 id="manual-adjust-title" className="text-lg leading-none font-semibold">
          Create Manual Adjustment
        </h2>
        <p id="manual-adjust-desc" className="text-muted-foreground text-sm">
          Create a manual override or special case adjustment that bypasses normal scheduling rules.
        </p>
      </div>
      <form className="space-y-4">
        {/* Adjustment Type & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="adjustment-type" className="text-sm font-medium">
              Adjustment Type
            </label>
            <div className="relative mt-1">
              <select
                id="adjustment-type"
                value={type}
                onChange={e => setType(e.target.value)}
                className="border-input text-sm flex w-full items-center rounded-md border bg-input-background px-3 py-2 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
              >
                <option value="">Select type</option>
                {ADJUSTMENT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="department" className="text-sm font-medium">
              Department
            </label>
            <div className="relative mt-1">
              <select
                id="department"
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="border-input text-sm flex w-full items-center rounded-md border bg-input-background px-3 py-2 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Nurse Search/Select */}
        <div>
          <label htmlFor="affected-nurse" className="text-sm font-medium">
            Affected Nurse
          </label>
          <input
            id="affected-nurse"
            className="border-input w-full rounded-md border px-3 py-2 text-base bg-input-background mt-1 mb-2"
            type="text"
            placeholder="Search and select nurse..."
            value={nurseSearch}
            onChange={e => setNurseSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        {/* Justification */}
        <div>
          <label htmlFor="justification" className="text-sm font-medium">
            Justification
          </label>
          <textarea
            id="justification"
            className="resize-none border-input w-full rounded-md border bg-input-background px-3 py-2 text-base min-h-[100px] mt-1"
            placeholder="Provide detailed justification for this manual adjustment..."
            value={justification}
            onChange={e => setJustification(e.target.value)}
          />
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
            Create Adjustment
          </Button>
        </div>
      </form>
      <button
        type="button"
        className="absolute top-4 right-4 opacity-70 hover:opacity-100 rounded-xs"
        aria-label="Close"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}