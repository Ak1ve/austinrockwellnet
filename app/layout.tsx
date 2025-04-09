import { Analytics } from '@vercel/analytics/react';
import "./global.css";
export const metadata = {
  title: 'Autumn Rockwell',
  description: 'Autumn Rockwell',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-[#120c0c] dark:text-[#f9f9f9] dark:bg-[#120C0B]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
