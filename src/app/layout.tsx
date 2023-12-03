import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from '@/components/Provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tixxtok',
  description: 'Adult site',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div>
            <Navbar />
            {children}
          </div>
        </Provider>
        <ToastContainer position="bottom-center" theme="dark" autoClose={3000}/>
        </body>
    </html>
  )
}
