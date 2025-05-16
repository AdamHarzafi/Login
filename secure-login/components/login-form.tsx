"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormState } from "react-dom"
import { authenticate } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { SocialLogin } from "@/components/social-login"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [identifierType, setIdentifierType] = useState<"email" | "username" | "phone">("email")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Utilizziamo useFormState per gestire lo stato del form e gli errori
  const [state, formAction] = useFormState(authenticate, {
    error: null,
    success: false,
  })

  // Validazione lato client
  const validateForm = () => {
    if (!identifier) return "Inserisci il tuo identificativo"
    if (!password) return "Inserisci la tua password"
    if (identifierType === "email" && !isValidEmail(identifier)) return "Formato email non valido"
    if (identifierType === "phone" && !isValidPhone(identifier)) return "Formato numero di telefono non valido"
    if (password.length < 8) return "La password deve contenere almeno 8 caratteri"
    return null
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhone = (phone: string) => {
    return /^\+?[0-9]{10,15}$/.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      // Gestione errori di validazione lato client
      return
    }

    setIsLoading(true)

    // Il form verrà gestito da formAction (Server Action)
    const formData = new FormData(e.currentTarget)
    formData.append("identifierType", identifierType)
    formData.append("rememberMe", rememberMe.toString())

    await formAction(formData)
    setIsLoading(false)
  }

  const getPlaceholder = () => {
    switch (identifierType) {
      case "email":
        return "nome@esempio.com"
      case "username":
        return "nomeutente"
      case "phone":
        return "+39 123 456 7890"
      default:
        return ""
    }
  }

  const getLabel = () => {
    switch (identifierType) {
      case "email":
        return "Email"
      case "username":
        return "Nome utente"
      case "phone":
        return "Numero di telefono"
      default:
        return "Identificativo"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {state.error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="identifier">{getLabel()}</Label>
          <div className="flex space-x-2 text-xs">
            <button
              type="button"
              onClick={() => setIdentifierType("email")}
              className={`px-2 py-1 rounded ${identifierType === "email" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setIdentifierType("username")}
              className={`px-2 py-1 rounded ${identifierType === "username" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
            >
              Username
            </button>
            <button
              type="button"
              onClick={() => setIdentifierType("phone")}
              className={`px-2 py-1 rounded ${identifierType === "phone" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
            >
              Telefono
            </button>
          </div>
        </div>
        <Input
          id="identifier"
          name="identifier"
          type={identifierType === "email" ? "email" : "text"}
          placeholder={getPlaceholder()}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete={identifierType === "email" ? "email" : identifierType === "username" ? "username" : "tel"}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="/password-dimenticata" className="text-sm text-blue-600 hover:underline">
            Password dimenticata?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          name="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
          Ricordami
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Accesso in corso..." : "Accedi"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Oppure continua con</span>
        </div>
      </div>

      <SocialLogin />
    </form>
  )
}
