"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

const treasuryConfig = {
  treasury: "xion1hpfm7zgg3qal9xx4m4mhgrhhsu0scnw500khfcca3mg85cyu8ddse7t3ug",
  rpcUrl: "https://rpc.xion-testnet-2.burnt.com/",
  restUrl: "https://api.xion-testnet-2.burnt.com/",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <AbstraxionProvider config={treasuryConfig}>
            {children}
          </AbstraxionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
