export const metadata = {
    title: 'SOBIE',
    description: 'Autumn Rockwell',
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
            <body className="text-[#120c0c]">
                {children}
            </body>
        </html>
    )
}
