import { requireAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

export default async function DashboardPage() {
  // Verifica che l'utente sia autenticato
  const session = await requireAuth()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Benvenuto! Sei autenticato con l'ID utente: {session.userId}</p>

      <form action={logout}>
        <Button type="submit" variant="outline">
          Logout
        </Button>
      </form>
    </div>
  )
}
