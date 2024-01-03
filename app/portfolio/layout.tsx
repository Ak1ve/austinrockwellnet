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
            <body className="text-[#120c0c] bg-[#0f0606]">
                {children}
            </body>
        </html>
    )
}
