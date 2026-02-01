import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://nlp-client-newtts.vercel.app"),
  title: "DCS-HCI NLP",
  description: "Text-to-Speech Interface and Evaluation System",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "_lCe2iAUIzZ_GakDP9V6q5fnQnueruXExk0zvc9BUg8",
  },
  openGraph: {
    title: "DCS-HCI NLP",
    description: "Text-to-Speech Interface and Evaluation System",
    url: "/",
    siteName: "DCS-HCI NLP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DCS-HCI NLP",
    description: "Text-to-Speech Interface and Evaluation System",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
