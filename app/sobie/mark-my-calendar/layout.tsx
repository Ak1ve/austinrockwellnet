export const metadata = {
    title: 'Mark My Calendar',
    description: 'Never miss another date again',
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
