import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Footer from "./_components/ui/footer"
import { Toaster } from "./_components/ui/sonner"
import AutProvider from "./_providers/auth"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AutProvider>
          <div className="flex-grow">{children}</div>
          <Toaster />
        </AutProvider>
        <Footer />
      </body>
    </html>
  )
}
