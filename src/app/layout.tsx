import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description: "A minimal Next.js starter for smart bookmarks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
