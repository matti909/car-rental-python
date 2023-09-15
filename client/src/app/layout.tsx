import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '../app/components/footer/Footer'
import Header from '../app/components/header/Header'
import Providers from '../redux/provider'
import { FormAppProvider } from './context/FormContext'
import './globals.css'

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
      <Providers>
        <body className={inter.className}>
          <main className="grid grid-rows-[60px,1fr,60px] min-h-screen ">
            <Header />
            <section className="flex-1">
              <FormAppProvider>{children}</FormAppProvider>
            </section>
            <Footer />
          </main>
        </body>
      </Providers>
    </html>
  )
}
