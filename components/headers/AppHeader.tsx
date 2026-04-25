"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import ThemeToggle from "@/components/headers/ThemeToggle";
import UserSection from "@/components/headers/UserSection";
import Navbar from "@/components/headers/Navbar";
import { GradientDivider } from "../ui/dividers/Dividers";
import { focusRing, transitions, activePress } from "@/styles";

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50  bg-slate-100/90 backdrop-blur dark:bg-slate-800/90">
      <div className="mx-auto max-w-screen-3xl px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex h-16 items-center justify-between gap-3">
          <span className="select-none text-xl xl:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Nextill
          </span>

          <div className="hidden flex-1 md:flex md:justify-center">
            <Navbar />
          </div>

          <div className="flex items-center gap-2 lg:gap-4 xl:gap-10">
            <ThemeToggle />

            <div className="hidden md:block">
              <UserSection />
            </div>

            <button
              type="button"
              className={`inline-flex  h-11 w-11 items-center justify-center rounded-xl 
                          bg-surface-2 text-muted border border-default shadow-sm 
                          hover:-translate-y-0.5 hover:shadow-md hover-surface-1
                          dark:hover:shadow-black/20
                          md:hidden ${focusRing} ${transitions} ${activePress}`}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-header-menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMenu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-header-menu"
          className={`${mobileMenuOpen ? "pb-4" : "hidden"} md:hidden`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="rounded-2xl border border-slate-300/70 bg-white/70 p-3 shadow-sm dark:border-slate-600/70 dark:bg-slate-700/70">
            {/* Mobile navigation will go here later */}
          </div>
        </div>
      </div>
      <GradientDivider />
    </header>
  );
}


