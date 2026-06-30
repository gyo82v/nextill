"use client";

import { useEffect } from "react";

type Props = {
  reduceMotion: boolean | null; // null = not set yet
};

export default function MotionProvider({ reduceMotion }: Props) {
  useEffect(() => {
    const root = document.documentElement;

    if (reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [reduceMotion]);

  return null;
}



