import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, IBM_Plex_Mono, Young_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TabBar } from "@/components/ui/TabBar";
import "./globals.css";

// Section 11.4: serif for titles, Atkinson for reading, Plex Mono for numbers.
const youngSerif = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-young-serif" });
const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-atkinson" });
const plexMono = IBM_Plex_Mono({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Cooly",
  description: "Recipes from what's already in your fridge, for students on a budget.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#171614" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${youngSerif.variable} ${atkinson.variable} ${plexMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-3"
          >
            Skip to content
          </a>
          <div className="mx-auto min-h-dvh max-w-xl pb-24">{children}</div>
          <TabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
