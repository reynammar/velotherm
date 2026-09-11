type PanelProps = {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
  interactive?: boolean;
};

const variantStyles = {
  light: "border-slate-200 bg-white text-[var(--color-brand-charcoal)]",
  dark: "border-slate-700 bg-[var(--color-brand-charcoal)] text-white",
};

export function Panel({
  children,
  variant = "light",
  className = "",
  interactive = false,
}: PanelProps) {
  return (
    <section
      className={[
        "border p-6",
        "transition-all duration-[var(--duration-base)]",
        variantStyles[variant],
        interactive
          ? "hover:border-[var(--color-brand-red)] hover:shadow-[var(--shadow-card-hover)]"
          : "shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
      style={{
        clipPath: "var(--clip-chamfer-lg)",
      }}
    >
      {children}
    </section>
  );
}