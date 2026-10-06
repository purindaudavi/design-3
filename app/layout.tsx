import type { Metadata } from "next";
import localFont from "next/font/local";
import { SourceInspector } from "./source-inspector";
import "./globals.css";

const manrope = localFont({
  src: [{ path: "./fonts/manrope/Manrope-Variable.ttf", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

const inter = localFont({
  src: [
    { path: "./fonts/inter/Inter-Variable.ttf", weight: "100 900", style: "normal" },
    { path: "./fonts/inter/Inter-VariableItalic.ttf", weight: "100 900", style: "italic" }
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

export const metadata: Metadata = {
  title: "Destination Management System",
  description: "Connect channel operations to your Destination Management System property-management workflow.",
  icons: {
    icon: "/assets/dms-mark.png",
    apple: "/assets/dms-mark.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <SourceInspector />}
      </body>
    </html>
  );
}
