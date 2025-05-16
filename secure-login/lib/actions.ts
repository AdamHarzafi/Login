"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { compare } from "bcrypt"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

// Schema di validazione per i dati di login
const LoginSchema = z.object({
  identifier: z.string().min(1, "Identificativo richiesto"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
  identifierType: z.enum(["email", "username", "phone"]),
  rememberMe: z.string().transform((val) => val === "true"),
})

// Simulazione di un database utenti
// In un'applicazione reale, useresti un database vero
const USERS_DB = [
  {
    id: "1",
    username: "utente",
    email: "utente@esempio.com",
    phone: "+391234567890",
    // Password: "password123" (hashed)
    passwordHash: "$2b$10$8JEFVNYYhLoBysjAxe2/5OWZ9.T.ESt.7WrxlmtL0fKn51CnOjy3W",
  },
]

// Funzione per limitare i tentativi di accesso (rate limiting)
const loginAttempts = new Map<string, { count: number; timestamp: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, timestamp: now })
    return true
  }

  // Reset dopo 15 minuti
  if (now - attempt.timestamp > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, timestamp: now })
    return true
  }

  // Limite di 5 tentativi in 15 minuti
  if (attempt.count >= 5) {
    return false
  }

  attempt.count += 1
  loginAttempts.set(ip, attempt)
  return true
}

// Funzione per creare un token JWT sicuro
async function createSecureToken(userId: string, rememberMe: boolean) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development_only")

  // Creazione di un token JWT
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(rememberMe ? "30d" : "1d") // 30 giorni o 1 giorno
    .sign(secret)

  return token
}

// Server Action per l'autenticazione
export async function authenticate(prevState: any, formData: FormData) {
  try {
    // Simulazione di un controllo dell'indirizzo IP per rate limiting
    const clientIp = "127.0.0.1" // In produzione, otterresti l'IP reale del client
    if (!checkRateLimit(clientIp)) {
      return {
        error: "Troppi tentativi di accesso. Riprova tra 15 minuti.",
        success: false,
      }
    }

    // Validazione dei dati di input
    const validatedFields = LoginSchema.safeParse({
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      identifierType: formData.get("identifierType"),
      rememberMe: formData.get("rememberMe"),
    })

    if (!validatedFields.success) {
      return {
        error: "Dati di accesso non validi. Controlla i campi e riprova.",
        success: false,
      }
    }

    const { identifier, password, identifierType, rememberMe } = validatedFields.data

    // Ricerca dell'utente nel database
    let user
    if (identifierType === "email") {
      user = USERS_DB.find((u) => u.email === identifier)
    } else if (identifierType === "username") {
      user = USERS_DB.find((u) => u.username === identifier)
    } else if (identifierType === "phone") {
      user = USERS_DB.find((u) => u.phone === identifier)
    }

    // Utente non trovato
    if (!user) {
      // Per sicurezza, non specifichiamo se l'utente non esiste o la password è errata
      return {
        error: "Credenziali non valide. Controlla e riprova.",
        success: false,
      }
    }

    // Verifica della password
    const passwordMatch = await compare(password, user.passwordHash)
    if (!passwordMatch) {
      return {
        error: "Credenziali non valide. Controlla e riprova.",
        success: false,
      }
    }

    // Creazione del token di sessione
    const token = await createSecureToken(user.id, rememberMe)

    // Impostazione del cookie di sessione
    cookies().set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 giorni o 1 giorno
      sameSite: "lax",
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Errore di autenticazione:", error)
    return {
      error: "Si è verificato un errore durante l'accesso. Riprova più tardi.",
      success: false,
    }
  }

  // Reindirizzamento dopo il login riuscito
  redirect("/dashboard")
}
