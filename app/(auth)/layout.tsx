"use client"

import PublicFooter from "@/components/footer/PublicFooter"
import AuthHeader from "@/components/headers/AuthHeader"

export default function AuthLayout({children}: { children: React.ReactNode }) {
  return (
    <>
      <AuthHeader />
      <main className="flex-1 flex min-w-0 w-full">
        {children}
      </main>
      <PublicFooter />
    </>
  )
}