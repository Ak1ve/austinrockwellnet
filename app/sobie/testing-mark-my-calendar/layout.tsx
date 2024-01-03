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

            <body>
                {children}
            </body>
        </html>
    )
}
