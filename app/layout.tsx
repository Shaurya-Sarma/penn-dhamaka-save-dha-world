import type { Metadata } from "next";
import { Inter, Patrick_Hand_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const patrickHandSc = Patrick_Hand_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patrick-hand-sc",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Save Dha World | Penn Dhamaka",
  description:
    "Turn performance into impact. Take climate action in 30 seconds.",
  generator: "v0.app",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${patrickHandSc.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
