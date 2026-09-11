type BadgeProps = {
  children: React.ReactNode;
  variant?: "red" | "dark" | "cyan" | "warning" | "success";
};

const variantStyles = {
  red: "bg-red-50 text-[var(--color-brand-red)]",
  dark: "bg-[var(--color-brand-card-dark)] text-white",
  cyan: "bg-cyan-50 text-[var(--color-brand-cyan)]",
  warning: "bg-amber-50 text-amber-600",
  success: "bg-emerald-50 text-emerald-600",
};

export function Badge({
  children,
  variant = "red",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1.5",
        "font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
      ].join(" ")}
      style={{
        clipPath: "var(--clip-chamfer-sm)",
      }}
    >
      {children}
    </span>
  );
}