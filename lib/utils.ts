import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets initials from a name string
 * @param name Full name string
 * @param maxLength Maximum number of initials to return (default: 2)
 * @returns Uppercase initials string
 */
export function getInitials(name?: string, maxLength: number = 2): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join("")
    .toUpperCase();
}

/**
 * Formats a number as money with abbreviations for large values
 * @param amount Number to format
 * @returns Formatted string representation
 */
export function formatMoney(amount: number): string {
  if (amount >= 1e12) {
    return (amount / 1e12).toFixed(2) + "T";
  } else if (amount >= 1e9) {
    return (amount / 1e9).toFixed(2) + "B";
  } else if (amount >= 1e6) {
    return (amount / 1e6).toFixed(2) + "M";
  } else if (amount >= 1e3) {
    return (amount / 1e3).toFixed(2) + "K";
  } else {
    return amount.toFixed(2);
  }
}
