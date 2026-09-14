import type { Metadata } from "next";
import {
  Chakra_Petch,
  Inter,
  JetBrains_Mono,
  Oswald,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VeloTherm",
  description:
    "Interactive thermodynamics and energy learning platform for automotive engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={[
          inter.variable,
          oswald.variable,
          chakraPetch.variable,
          jetBrainsMono.variable,
          "antialiased",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}