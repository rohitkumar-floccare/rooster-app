"use client"

import React, { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const DEPARTMENTS = [
  "Emergency", "ICU", "Surgery", "Pediatrics", "Maternity", "Oncology", "Cardiology", "Neurology", "General Medicine"
]
const SKILL_LEVELS = [
  "Trainee", "Junior", "Senior", "Lead", "Specialist"
]

export function AddStaffMemberModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit?: (member: any) => void
}) {
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        name,
        department,
        skill: skillLevel,
        email,
        phone,
        initials: name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
        status: "Active",
        contract: "Full-Time",
        experienceYears: 0,
        hours: "40h/Wk",
        availability: [],
      })
    }
    onClose()
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-staff-title"
      aria-describedby="add-staff-desc"
      className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
      tabIndex={-1}
      style={{ pointerEvents: "auto" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 id="add-staff-title" className="text-lg leading-none font-semibold">
          Add New Staff Member
        </h2>
        <p id="add-staff-desc" className="text-muted-foreground text-sm">
          Add a new nurse to the team roster.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-base bg-input-background"
            placeholder="Enter full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            Department
          </label>
          <div className="relative">
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border-input flex w-full items-center rounded-md border bg-input-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="skillLevel" className="text-sm font-medium">
            Skill Level
          </label>
          <div className="relative">
            <select
              id="skillLevel"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="border-input flex w-full items-center rounded-md border bg-input-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select skill level</option>
              {SKILL_LEVELS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-base bg-input-background"
            placeholder="Enter email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-base bg-input-background"
            placeholder="Enter phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Staff Member
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