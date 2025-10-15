import React, { useState } from "react";
import { Search, SlidersHorizontal, Calendar, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Filters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [skillLevel, setSkillLevel] = useState("All Skill Levels");
  const [view, setView] = useState<"Calendar" | "Day">("Calendar");

  const departments = ["All Departments", "ICU", "ER", "Pediatrics", "General"];
  const skillLevels = ["All Skill Levels", "Junior", "Mid", "Senior"];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search + Filters */}
      <div className="flex w-full items-center gap-3">
        {/* 🔍 Search Bar */}
        <div className="relative w-full max-w-4xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team"
            className="pl-11 py-3 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ⚙️ Filter Buttons */}
        <DropdownButton
          label="Show all"
          options={["All", "Active", "Off-duty"]}
          onSelect={(v) => console.log("Show:", v)}
        />
        <DropdownButton
          label={department}
          options={departments}
          onSelect={(v) => setDepartment(v)}
        />
        <DropdownButton
          label={skillLevel}
          options={skillLevels}
          onSelect={(v) => setSkillLevel(v)}
        />
      </div>

      {/* 🗓 View Tabs */}
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-muted/40 p-1 flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setView("Calendar")}
            className={`h-9 px-3 rounded-full flex items-center gap-2 ${
              view === "Calendar"
                ? "bg-background text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Calendar</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setView("Day")}
            className={`h-9 px-3 rounded-full flex items-center gap-2 ${
              view === "Day"
                ? "bg-background text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm">Day</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* 🔽 DropdownButton component for reuse */
const DropdownButton = ({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="ml-2 gap-2 bg-transparent rounded-full hidden sm:inline-flex"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-md shadow-lg z-50">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
