import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../app/components/header/Header'
import Footer from '../app/components/footer/Footer'
import { FormAppProvider } from './context/FormContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Rental',
  description: 'Car Rental',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <>
        <body className={inter.className}>
          <main className="grid grid-rows-[60px,1fr,60px] min-h-screen ">
            <Header />
            <section className="flex-1">
              <FormAppProvider>{children}</FormAppProvider>
            </section>
            <Footer />
          </main>
        </body>
      </>
    </html>
  )
}
