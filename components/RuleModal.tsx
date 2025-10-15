"use client"

import React, { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const CATEGORIES = [
  { value: "compliance", label: "Compliance" },
  { value: "skills", label: "Skills" },
  { value: "fairness", label: "Fairness" },
  { value: "preference", label: "Preference" },
]
const TYPES = [
  { value: "hard", label: "Hard" },
  { value: "soft", label: "Soft" },
]
const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function AddRuleModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit?: (rule: any) => void
}) {
  const [ruleName, setRuleName] = useState("")
  const [ruleDescription, setRuleDescription] = useState("")
  const [ruleDetails, setRuleDetails] = useState("")
  const [category, setCategory] = useState("compliance")
  const [type, setType] = useState("hard")
  const [priority, setPriority] = useState("medium")

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        title: ruleName,
        description: ruleDescription,
        details: ruleDetails,
        category,
        priority,
        isHard: type === "hard",
        enabled: true,
        violations: 0,
      })
    }
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-rule-title"
      aria-describedby="add-rule-desc"
      className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
      tabIndex={-1}
      style={{ pointerEvents: "auto" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 id="add-rule-title" className="text-lg leading-none font-semibold">
          Add New Rule
        </h2>
        <p id="add-rule-desc" className="text-muted-foreground text-sm">
          Create a new scheduling rule to enforce compliance requirements or preferences.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="ruleName" className="text-sm font-medium">
            Rule Name
          </label>
          <input
            id="ruleName"
            className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-base bg-input-background"
            placeholder="Enter rule name"
            value={ruleName}
            onChange={e => setRuleName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="ruleDescription" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="ruleDescription"
            className="resize-none border-input min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base"
            placeholder="Brief description of the rule..."
            value={ruleDescription}
            onChange={e => setRuleDescription(e.target.value)}
            required
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="ruleDetails" className="text-sm font-medium">
            Detailed Policy
          </label>
          <textarea
            id="ruleDetails"
            className="resize-none border-input min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base"
            placeholder="Enter detailed policy information, exceptions, and implementation notes..."
            value={ruleDetails}
            onChange={e => setRuleDetails(e.target.value)}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="border-input text-sm flex w-full items-center rounded-md border bg-input-background px-3 py-2"
              >
                {CATEGORIES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <div className="relative">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="border-input text-sm flex w-full items-center rounded-md border bg-input-background px-3 py-2"
              >
                {TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="relative">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="border-input text-sm flex w-full items-center rounded-md border bg-input-background px-3 py-2"
              >
                {PRIORITIES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Rule
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