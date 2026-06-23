"use client";

const soundMap = {
  addToCart: "/sounds/add-to-cart.mp3",
  orderComplete: "/sounds/order-complete.mp3",
} as const;

export type SoundKey = keyof typeof soundMap;

const audioCache = new Map<SoundKey, HTMLAudioElement>();

function getAudio(key: SoundKey) {
  if (typeof window === "undefined") return null;

  let audio = audioCache.get(key);

  if (!audio) {
    audio = new Audio(soundMap[key]);
    audio.preload = "auto";
    audioCache.set(key, audio);
  }

  return audio;
}

export function playSound(key: SoundKey) {
  const audio = getAudio(key);
  if (!audio) return;

  audio.currentTime = 0;

  void audio.play().catch(() => {
    // silent fail: sound will never block the app flow
  });
}

export function preloadSound(key: SoundKey) {
  getAudio(key);
}