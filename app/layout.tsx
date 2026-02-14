import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/providers/LayoutProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertical Hub CRM | Real Estate Lead Management System",
  description:
    "Vertical Hub CRM is a lightweight real estate lead management system built for efficient tracking, follow-ups, and team-based access control.",
  keywords: [
    "Real Estate CRM",
    "Lead Management System",
    "Sales CRM",
    "Vertical Hub CRM",
    "Vijay Singh"
  ],
  authors: [{ name: "Vijay Singh" }],
  creator: "Vijay Singh",
  metadataBase: new URL("https://www.upwork.com/freelancers/~015338fad1d2cf57ac"),
  openGraph: {
    title: "Vertical Hub CRM",
    description:
      "A simple and efficient CRM for real estate businesses with role-based access for Admin and Sales teams.",
    type: "website"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutProvider>{children}</LayoutProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
