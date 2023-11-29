import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stringify: typeof JSON.stringify = (value, replacer, space) =>
  JSON.stringify(
    value,
    (key, value_) => {
      const value = typeof value_ === "bigint" ? value_.toString() : value_
      return typeof replacer === "function" ? replacer(key, value) : value
    },
    space
  )
