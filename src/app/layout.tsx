import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Template",
  description: "Plantilla Next.js fullstack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}