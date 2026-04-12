export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];