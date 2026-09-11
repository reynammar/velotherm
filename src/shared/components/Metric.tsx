type MetricProps = {
  value: string;
  label: string;
  unit?: string;
  variant?: "light" | "dark";
};

export function Metric({
  value,
  label,
  unit,
  variant = "light",
}: MetricProps) {
  const isDark = variant === "dark";

  return (
    <div>
      <div
        className={[
          "flex items-end gap-2",
          isDark
            ? "text-white"
            : "text-[var(--color-brand-charcoal)]",
        ].join(" ")}
      >
        <span className="font-[var(--font-oswald)] text-4xl font-semibold leading-none">
          {value}
        </span>

        {unit && (
          <span
            className={[
              "mb-0.5 font-[var(--font-jetbrains-mono)] text-xs",
              isDark
                ? "text-slate-300"
                : "text-[var(--color-brand-muted)]",
            ].join(" ")}
          >
            {unit}
          </span>
        )}
      </div>

      <span
        className={[
          "mt-2 block font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-[0.15em]",
          isDark
            ? "text-slate-400"
            : "text-[var(--color-brand-muted)]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}