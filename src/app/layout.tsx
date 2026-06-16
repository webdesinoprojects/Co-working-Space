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
  title: {
    default: "Alley Workspace | Premium Coworking & Office Spaces in Delhi",
    template: "%s | Alley Workspace",
  },
  description:
    "Alley Workspace offers premium coworking spaces, private cabins, dedicated desks, meeting rooms, and virtual office solutions in Delhi. Strategy-led environments designed for teams ready to dominate their category.",
  keywords: [
    "coworking space",
    "coworking space in Delhi",
    "premium office space",
    "virtual office",
    "private cabins",
    "meeting rooms",
    "dedicated desks",
    "shared workspace",
    "office space for rent",
    "Alley Workspace",
    "coworking near me",
    "business centre Delhi",
    "hot desk",
    "flexible workspace",
    "startup office space",
  ],
  authors: [{ name: "Alley Workspace" }],
  creator: "Alley Workspace",
  publisher: "Alley Workspace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/alley_favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/alley_favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/alley_favicon.png", sizes: "180x180" }],
    shortcut: "/alley_favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Alley Workspace",
    title: "Alley Workspace | Premium Coworking & Office Spaces in Delhi",
    description:
      "Premium coworking spaces, private cabins, dedicated desks, and meeting rooms. Designed for teams that demand excellence.",
    images: [
      {
        url: "/alley_logo.png",
        width: 1200,
        height: 630,
        alt: "Alley Workspace — Premium Coworking Spaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alley Workspace | Premium Coworking & Office Spaces",
    description:
      "Strategy-led workspaces delivering results. Premium coworking, private cabins, and meeting rooms in Delhi.",
    images: ["/alley_logo.png"],
  },
  metadataBase: new URL("https://alleyworkspace.com"),
  alternates: {
    canonical: "/",
  },
  category: "business",
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
