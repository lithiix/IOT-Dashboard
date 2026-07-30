import type { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "GravityCore IoT Dashboard",
  description: "GravityCore IoT Dashboard connected to PHP MySQL REST API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
