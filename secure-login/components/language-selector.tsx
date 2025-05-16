"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GlobeIcon } from "lucide-react"

const languages = [
  { code: "it", name: "Italiano" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
]

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState("it")

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    // Qui implementeresti la logica per cambiare la lingua dell'applicazione
    console.log(`Lingua cambiata in: ${langCode}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <GlobeIcon className="h-4 w-4" />
          <span className="sr-only">Cambia lingua</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-gray-100" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
