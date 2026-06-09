import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollerProvider } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/lib/ThemeContext";
import { Toaster } from "sonner";
import {
  manrope,
  montserrat,
  spaceGrotesk,
  sora,
  outfit,
  dmSans,
  playfair,
  inter,
  jetbrainsMono
} from "@/lib/fontS";

export const metadata: Metadata = {
  title: "Axion Workspace | Premium Coworking & Offices",
  description: "Strategy-led workspaces delivering results. We craft professional environments for teams ready to dominate their category offline.",
  keywords: ["coworking space", "premium office", "virtual office", "private cabins", "meeting rooms", "axion workspace"],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${sora.variable} ${outfit.variable} ${dmSans.variable} ${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider>
          <Toaster position="top-right" richColors />
          <SmoothScrollerProvider>
            {children}
          </SmoothScrollerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
