"use client"

import { Button } from "@/components/ui/button"
import { GithubIcon, FacebookIcon } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export function SocialLogin() {
  return (
    <div className="flex flex-col space-y-2">
      <Button variant="outline" className="w-full" onClick={() => console.log("Google login")}>
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button variant="outline" className="w-full" onClick={() => console.log("Facebook login")}>
        <FacebookIcon className="mr-2 h-4 w-4 text-blue-600" />
        Facebook
      </Button>
      <Button variant="outline" className="w-full" onClick={() => console.log("GitHub login")}>
        <GithubIcon className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
}
