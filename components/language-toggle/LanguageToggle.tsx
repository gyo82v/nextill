"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/authProvider";
import { updateLanguage } from "@/firebase/userSettings";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/languages";

import LanguageToggleButton from "./LanguageToggleButton";
import LanguageOptionsPanel from "./LanguageOptionsPanel";
import LanguageOption from "./LanguageOptions";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return hydrated;
}

export default function LanguageToggle() {
  const hydrated = useHydrated();
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en") as LanguageCode;

  const currentLanguageLabel =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage)?.label ?? "English";

  async function handleSelect(nextLanguage: LanguageCode) {
    await i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);

    if (user) {
      await updateLanguage({ uid: user.uid, nextLang: nextLanguage });
    }
    
    buttonRef.current?.focus();
    setOpen(false);
    setFocusedIndex(null);
  }

  function openMenu() {
    const index = SUPPORTED_LANGUAGES.findIndex((lang) => lang.code === currentLanguage);
    setFocusedIndex(index >= 0 ? index : 0);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    setFocusedIndex(null);
  }

  function toggleMenu() {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        buttonRef.current?.focus(); // ✅ fix
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        buttonRef.current?.focus();
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, currentLanguage]);

  useEffect(() => {
    if (!open || focusedIndex === null) return;
    optionRefs.current[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  function handleOptionKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    code: LanguageCode
  ) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        index === SUPPORTED_LANGUAGES.length - 1 ? 0 : index + 1;
      setFocusedIndex(nextIndex);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex =
        index === 0 ? SUPPORTED_LANGUAGES.length - 1 : index - 1;
      setFocusedIndex(nextIndex);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(code);
    }
  }

  if (!hydrated) return null;

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <LanguageToggleButton
        label={currentLanguageLabel}
        open={open}
        onClick={toggleMenu}
        ref={buttonRef}
      />

      <LanguageOptionsPanel open={open}>
        {SUPPORTED_LANGUAGES.map((lang, index) => (
          <LanguageOption
            key={lang.code}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            code={lang.code}
            label={lang.label}
            selected={lang.code === currentLanguage}
            onKeyDown={(e) => handleOptionKeyDown(e, index, lang.code)}
            onSelect={handleSelect}
          />
        ))}
      </LanguageOptionsPanel>
    </div>
  );
}