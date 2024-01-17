export const metadata = {
    title: 'FlexSwipe',
    description: 'Calculate Your Oberlin Spending',
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
            </body>
        </html>
    )
}
