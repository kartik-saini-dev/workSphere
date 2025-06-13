
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from "../providers/AuthProvider";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import  GlobalState  from '../context';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'nextjs workSphere',
  description: 'Developed by Kartik',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
       <AuthProvider>
       <GlobalState>
      <main className="relative flex flex-col  justify-between">
       <Navbar/>
         {children}
         <Footer/>
         </main>
         </GlobalState>
       </AuthProvider>
         
      </body>
    </html>
  )
}
