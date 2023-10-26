export const metadata = {
    title: 'FlexSwipe',
    description: 'Austin Rockwell',
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
