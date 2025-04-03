import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Steam Common Games Finder',
  description: 'Find games that you and your friends have in common on Steam',
  keywords: 'steam, games, common games, multiplayer, gaming',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
