import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TechCare-specific utility functions for Rwanda market
export const languages = {
  en: { name: "English", flag: "🇬🇧", direction: "ltr" },
  rw: { name: "Kinyarwanda", flag: "🇷🇼", direction: "ltr" },
  fr: { name: "Français", flag: "🇫🇷", direction: "ltr" },
} as const

export type Language = keyof typeof languages
export type UserRole = "customer" | "technician" | "admin" | null

// Text length adjustment for different languages
export function getTextScale(lang: Language): number {
  switch (lang) {
    case "rw": return 1.2 // Kinyarwanda can be longer
    case "fr": return 1.1 // French can be slightly longer
    default: return 1.0
  }
}

// Mobile-first responsive helpers
export function isMobileScreen(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Format phone numbers for Rwanda
export function formatRwandaPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('250')) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('0')) {
    return `+250${cleaned.slice(1)}`
  }
  return `+250${cleaned}`
}

// Service categories for TechCare
export const serviceCategories = [
  { id: "computer", name: "Computer Repair", icon: "laptop" },
  { id: "phone", name: "Phone Repair", icon: "smartphone" },
  { id: "tv", name: "TV & Electronics", icon: "tv" },
  { id: "networking", name: "Networking", icon: "wifi" },
  { id: "software", name: "Software Support", icon: "code" },
  { id: "consultation", name: "Tech Consultation", icon: "users" },
] as const 