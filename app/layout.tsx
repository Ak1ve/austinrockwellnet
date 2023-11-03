import { Analytics } from '@vercel/analytics/react';
import "./global.css";
export const metadata = {
  title: 'Austin Rockwell',
  description: 'Austin Rockwell',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-[#120c0c] dark:text-[#f9f9f9] dark:bg-[#102124]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
