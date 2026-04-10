export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {/* Logo, language switch, dark mode */}
      {children}
    </main>
  )
}