export const metadata = {
    title: 'Connect Oberlin',
    description: 'Connect Oberlin',
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
            <body>
                {children}
            </body>
        </html>
    )
}
