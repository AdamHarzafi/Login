import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { redirect } from "next/navigation"

// Funzione per verificare se l'utente è autenticato
export async function getSession() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development_only")
    const { payload } = await jwtVerify(sessionCookie.value, secret)

    if (!payload || !payload.userId) {
      return null
    }

    return { userId: payload.userId as string }
  } catch (error) {
    console.error("Errore nella verifica della sessione:", error)
    return null
  }
}

// Middleware per proteggere le route che richiedono autenticazione
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return session
}

// Funzione per effettuare il logout
export async function logout() {
  cookies().delete("session")
  redirect("/")
}
