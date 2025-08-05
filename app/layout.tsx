import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Umair Nadeem - SQA Engineer',
  description: 'Software Quality Assurance Engineer with over 3 years of experience in ensuring high-quality software solutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark text-light">
        {children}
      </body>
    </html>
  )
} 