import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coash26 - Senku AI",
  description: "Next-gen AI Coach for eFootball",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
