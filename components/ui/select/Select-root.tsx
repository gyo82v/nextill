"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("useSelect must be used within SelectRoot");
  }

  return context;
}

type SelectRootProps<T extends string = string> = {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function SelectRoot<T extends string>({
  value,
  onValueChange,
  children,
  disabled = false,
  className,
}: SelectRootProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const toggleMenu = useCallback(() => {
    if (open) closeMenu();
    else openMenu();
  }, [open, closeMenu, openMenu]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeMenu]);

  const contextValue = useMemo<SelectContextValue>(
    () => ({
      value,
      onValueChange: onValueChange as (value: string) => void,
      open,
      setOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      triggerRef,
      wrapperRef,
      disabled,
    }),
    [value, onValueChange, open, openMenu, closeMenu, toggleMenu, disabled]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={wrapperRef} className={`relative inline-flex ${className ?? ""}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}


/*


"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string ) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("useSelect must be used within SelectRoot");
  }

  return context;
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return hydrated;
}

type SelectRootProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function SelectRoot({
  value,
  onValueChange,
  children,
  disabled = false,
  className,
}: SelectRootProps) {
  const hydrated = useHydrated();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [open, closeMenu, openMenu]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeMenu]);

  const contextValue = useMemo<SelectContextValue>(
    () => ({
      value,
      onValueChange,
      open,
      setOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      triggerRef,
      wrapperRef,
      disabled,
    }),
    [value, onValueChange, open, openMenu, closeMenu, toggleMenu, disabled]
  );

  if (!hydrated) return null;

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        className={className ?? "relative inline-flex"}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
}






*/