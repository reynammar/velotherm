type TechnicalLabelProps = {
  children: React.ReactNode;
  accent?: "red" | "cyan" | "muted";
};

const accentStyles = {
  red: "text-[var(--color-brand-red)]",
  cyan: "text-[var(--color-brand-cyan)]",
  muted: "text-[var(--color-brand-muted)]",
};

export function TechnicalLabel({
  children,
  accent = "red",
}: TechnicalLabelProps) {
  return (
    <span
      className={`font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-[0.2em] ${accentStyles[accent]}`}
    >
      {children}
    </span>
  );
}