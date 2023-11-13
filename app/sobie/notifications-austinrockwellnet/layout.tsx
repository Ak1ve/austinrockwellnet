export const metadata = {
    title: 'Notification Center',
    description: 'If you are reading this, you probably shouldnt be here',
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
            <body className="text-[#120c0c] ">
                {children}
            </body>
        </html>
    )
}
