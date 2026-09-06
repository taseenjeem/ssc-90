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

