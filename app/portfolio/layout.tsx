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
        <html lang="en" className="bg-white">
            <body className="text-[#120c0c]">
                {children}
            </body>
        </html>
    )
}
