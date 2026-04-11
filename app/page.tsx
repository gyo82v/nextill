"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/till");
    } else {
      router.replace("/sign-in");
    }
  }, [user, loading, router]);

  return null;
}
