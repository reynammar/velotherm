import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Flame,
  PlaySquare,
} from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const socialLinks = [
  {
    label: "YouTube",
    href: "#",
    icon: <FaYoutube className="size-4" />,
  },
  {
    label: "Instagram",
    href: "#",
    icon: <FaInstagram className="size-4" />,
  },
  {
    label: "GitHub",
    href: "#",
    icon: <FaGithub className="size-4" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <FaLinkedinIn className="size-4" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[color:var(--color-brand-charcoal)] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-slate-800 pb-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Information */}
          <div className="space-y-5 lg:col-span-2">
            <Link
              href="#home"
              className="group flex items-center gap-3"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-[color:var(--color-brand-red)] to-[color:var(--color-brand-crimson)] text-white shadow-[var(--shadow-glow-red)]"
                style={{
                  clipPath: "var(--clip-chamfer-md)",
                }}
              >
                <Flame className="size-5" />
              </div>

              <span className="font-[var(--font-oswald)] text-2xl font-bold tracking-wider text-white">
                VELO
                <span className="text-[color:var(--color-brand-red)]">
                  THERM
                </span>
              </span>
            </Link>

            <p className="max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              An interactive thermodynamics learning platform designed to
              connect engineering theory with automotive energy systems,
              interactive simulation, and spatial visualization.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-8 items-center justify-center bg-slate-800 text-slate-300 transition-colors hover:bg-[color:var(--color-brand-red)] hover:text-white"
                  style={{
                    clipPath: "var(--clip-chamfer-sm)",
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <FooterColumn
            title="Quick Navigation"
            links={[
              ["Home", "#home"],
              ["Principles & Values", "#principles"],
              ["Learning Modules", "#modules"],
              ["Quiz Evaluation", "/quiz"],
            ]}
          />

          {/* Modules */}
          <FooterColumn
            title="Modules"
            links={[
              [
                "01. Thermodynamics Fundamentals",
                "/simulation?scene=1",
              ],
              [
                "02. Energy & The First Law",
                "/simulation?scene=3",
              ],
              [
                "03. Cycles & Hybrid",
                "/simulation?scene=8",
              ],
              ["Interactive Simulation", "/simulation"],
            ]}
          />

          {/* Learning System */}
          <div className="font-[var(--font-chakra-petch)]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Learning System
            </h3>

            <div className="space-y-3 text-[11px] leading-relaxed text-slate-400">
              <div className="flex items-start gap-2">
                <BookOpen className="mt-0.5 size-3.5 shrink-0 text-[color:var(--color-brand-red)]" />

                <span>
                  Thermodynamic fundamentals and energy analysis.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <PlaySquare className="mt-0.5 size-3.5 shrink-0 text-[color:var(--color-brand-red)]" />

                <span>
                  Interactive simulation and vehicle energy flow.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 pt-7 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
          <p className="font-[var(--font-jetbrains-mono)]">
            © 2026 VeloTherm Automotive Thermodynamics.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="#"
              className="transition-colors hover:text-slate-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="transition-colors hover:text-slate-300"
            >
              Terms of Use
            </Link>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-brand-red)]"
            >
              Access Quiz
              <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="font-[var(--font-chakra-petch)]">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>

      <ul className="space-y-2.5 text-xs text-slate-400">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="transition-colors hover:text-[color:var(--color-brand-red)]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}