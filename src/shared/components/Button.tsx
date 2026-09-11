import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "warning";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
  };

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-brand-red)]",
    "text-white",
    "hover:bg-[var(--color-brand-crimson)]",
    "hover:shadow-[var(--shadow-glow-red)]",
  ].join(" "),

  secondary: [
    "bg-white",
    "text-[var(--color-brand-charcoal)]",
    "border-slate-300",
    "hover:border-[var(--color-brand-red)]",
    "hover:text-[var(--color-brand-red)]",
  ].join(" "),

  dark: [
    "bg-[var(--color-brand-charcoal)]",
    "text-white",
    "hover:bg-[var(--color-brand-red)]",
  ].join(" "),

  warning: [
    "bg-amber-500",
    "text-white",
    "hover:bg-amber-600",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

const baseStyles = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "border",
  "font-[var(--font-chakra-petch)]",
  "font-semibold",
  "uppercase",
  "tracking-wide",
  "transition-all",
  "duration-[var(--duration-fast)]",
  "active:scale-95",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-[var(--color-brand-red)]",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
].join(" ");

function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className = "",
) {
  return [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(" ");
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return getButtonClassName(
    variant,
    size,
    className,
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const styles = getButtonClassName(
    variant,
    size,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={styles}>
      {children}
    </button>
  );
}