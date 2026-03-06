import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jade & Co - Luxury Real Estate",
  description: "Discover your dream luxury property with Jade & Co",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        {React.createElement("elevenlabs-convai", {
          "agent-id": "agent_4001kjydnk9der5vbxwfwnkhhy2x",
        })}
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          async
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
