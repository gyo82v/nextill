import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "@/firebase/ClientProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexTill",
  description: "a till simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
         <a
          href="#content"
          className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 z-50
                      rounded-md bg-white px-3 py-2 text-sm font-medium text-black shadow`}
        >
          Skip to content
        </a>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
