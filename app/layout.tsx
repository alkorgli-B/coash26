import "./globals.css";

export const metadata = {
  title: "Coash26 | Senku AI Coach",
  description: "AI Coach for PlayStation 5 eFootball",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
