"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import { AppProvider } from "@/context/AppContext";
import { treasuryConfig } from "@/constants";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster />
      <Sonner />
        <AbstraxionProvider config={treasuryConfig}>
          <AppProvider>{children}</AppProvider>
        </AbstraxionProvider>
      </body>
    </html>
  );
}
