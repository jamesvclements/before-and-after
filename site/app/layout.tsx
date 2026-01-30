import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import { Agentation } from "agentation"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const vanillaCream = localFont({
  src: "./fonts/VanillaCreamOx-Regular.otf",
  variable: "--font-vanilla-cream",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://jm.sv"),
  title: "before-and-after",
  description: "Add before and after screenshots to your PRs. Install as a skill for your AI agent or use directly from the CLI.",
  openGraph: {
    title: "before-and-after",
    description: "Add before and after screenshots to your PRs. Install as a skill for your AI agent or use directly from the CLI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "before-and-after",
    description: "Add before and after screenshots to your PRs. Install as a skill for your AI agent or use directly from the CLI.",
  },
  icons: {
    icon: "/before-and-after/icon",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${vanillaCream.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}
