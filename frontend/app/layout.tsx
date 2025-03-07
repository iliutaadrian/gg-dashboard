import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GG Dashboard",
  description: "All in one dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.iliutaadrian.cloud/script.js" data-website-id="9fb601c5-952b-4d26-930a-99aa8a5c0337"></script>
      </head>
      <body className={cn("bg-background", inter.className)}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
