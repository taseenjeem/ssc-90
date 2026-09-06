import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBanglaDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  // Check if it's an ISO or YYYY-MM-DD date string
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      // fallback to original string
    }
  }
  return dateStr;
}

export function toDateInputValue(dateStr?: string | null): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  // Already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  // If ISO string like 2026-07-08T...
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  // Parse any natural language date string like "08 July 2026" or "July 8, 2026"
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return "";
}
