const redirects = [
    {
        name: "Progress Book Grade Tester",
        source: "/progressbook",
        destination: "https://chrome.google.com/webstore/detail/progressbook-grade-tester/gbefacokacnljmbohkddpackecdcjflk",
        permanent: false
    },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return redirects.map((x) => {
            let {name, ...rest} = x;
            return rest;
        })
    },
    experimental:
    {serverActions: true}
}


module.exports = nextConfig

