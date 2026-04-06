import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely, combining Tailwind classes logically without conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
