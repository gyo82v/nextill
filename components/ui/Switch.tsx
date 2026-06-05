"use client";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export default function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...ariaProps
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaProps["aria-label"]}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full border border-default transition",
        "focus-visible:outline-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        backgroundColor: checked ? "var(--primary)" : "var(--surface-2)",
      }}
    >
      <span
        className="absolute left-1 h-5 w-5 rounded-full bg-surface-1 transition-transform"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}