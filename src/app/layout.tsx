import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Idealize PlanBee',
  description: 'A modern Next.js application with frontend and backend capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
