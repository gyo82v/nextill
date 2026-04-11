"use client"

import ThemeToggle from "@/components/ThemeToggle"
import LanguageToggle from "@/components/LanguageToggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
       <div className="p-4">
        <ThemeToggle />
        <LanguageToggle />
      </div>
      {children}
    </main>
  )
}