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
    >
      <body className="min-h-full flex flex-col"><ClientProviders>{children}</ClientProviders></body>
    </html>
  );
}
