"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { cn, languages, Language } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LanguageSwitcherProps {
  currentLanguage?: Language
  onLanguageChange?: (language: Language) => void
  variant?: "dropdown" | "inline" | "button"
  className?: string
}

export function LanguageSwitcher({
  currentLanguage = "en",
  onLanguageChange,
  variant = "dropdown",
  className,
}: LanguageSwitcherProps) {
  const [selectedLang, setSelectedLang] = React.useState<Language>(currentLanguage)

  // Sync with parent component when currentLanguage prop changes
  React.useEffect(() => {
    setSelectedLang(currentLanguage)
  }, [currentLanguage])

  const handleLanguageChange = (newLang: Language) => {
    setSelectedLang(newLang)
    onLanguageChange?.(newLang)
  }

  React.useEffect(() => {
    // Load from localStorage on mount only if no currentLanguage prop provided
    if (typeof window !== 'undefined' && currentLanguage === "en") {
      const savedLang = localStorage.getItem('techcare-language') as Language
      if (savedLang && languages[savedLang]) {
        setSelectedLang(savedLang)
        onLanguageChange?.(savedLang)
      }
    }
  }, [currentLanguage, onLanguageChange])

  if (variant === "dropdown") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedLang}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          className="text-sm border border-input rounded px-2 py-1 bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Select language"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              selectedLang === code
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    )
  }

  if (variant === "button") {
    const currentLangData = languages[selectedLang]
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("gap-2", className)}
        onClick={() => {
          const langKeys = Object.keys(languages) as Language[]
          const currentIndex = langKeys.indexOf(selectedLang)
          const nextIndex = (currentIndex + 1) % langKeys.length
          handleLanguageChange(langKeys[nextIndex])
        }}
        aria-label={`Current language: ${currentLangData.name}, click to change`}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLangData.flag}</span>
        <span className="hidden sm:inline">{currentLangData.name}</span>
      </Button>
    )
  }

  return null
}

// Hook for using language in components
export function useLanguage() {
  const [language, setLanguage] = React.useState<Language>("en")

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('techcare-language') as Language
      if (savedLang && languages[savedLang]) {
        setLanguage(savedLang)
      }
    }
  }, [])

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('techcare-language', newLang)
    }
  }

  return { language, changeLanguage, languages }
} 