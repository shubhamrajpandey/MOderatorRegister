import type { Metadata } from "next";
import "./globals.css"

export const metadata: Metadata = {
  title: "HCKCORE | Moderator",
  description: "Moderator section for HeraldHub platform",
  icons: {
    icon: "/hck core logo.svg",
  },
};

export default function ModeratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen px-4">{children}</main>
      </body>
    </html>
  );
}
