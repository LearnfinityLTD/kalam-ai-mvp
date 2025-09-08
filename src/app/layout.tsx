import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <TooltipProvider delayDuration={200}>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
