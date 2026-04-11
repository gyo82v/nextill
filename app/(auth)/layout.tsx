import ThemeToggle from "@/components/ThemeToggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
       <div className="p-4">
        <ThemeToggle />
      </div>
      {children}
    </main>
  )
}