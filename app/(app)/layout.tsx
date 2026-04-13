// app/(app)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";
import AppHeader from "@/components/headers/AppHeader";
import Footer from "@/components/Footer";

export default function AppLayout({children}: {children: React.ReactNode;}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 flex min-w-0 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}