import { LoginForm } from "@/components/login-form"
import { LanguageSelector } from "@/components/language-selector"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-16 h-16 mb-2">
            <Image src="/placeholder.svg?height=64&width=64" alt="Logo" fill className="rounded-full" priority />
          </div>
          <h1 className="text-2xl font-bold text-center">Accedi al tuo account</h1>
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <p className="text-gray-600 mt-4">
            Non hai un account?{" "}
            <Link href="/registrazione" className="text-blue-600 hover:underline font-medium">
              Registrati qui
            </Link>
          </p>
          <div className="mt-4 space-x-3">
            <Link href="/termini" className="text-gray-500 hover:text-gray-700 text-xs">
              Termini di Servizio
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-xs">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
