export const metadata = {
    title: 'ObieEats',
    description: 'See The Best Dining Options of The Day',
}

// dark red : #a6192e
// yellow: #FFC72C
// light red: #e81727


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="text-[#120c0c] dark:text-[#f9f9f9] dark:bg-[#120C0B]">
                {children}
            </body>
        </html>
    )
}
