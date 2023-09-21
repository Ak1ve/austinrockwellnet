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
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
  async redirects() {
    return redirects.map((x) => {
        let {name, ...rest} = x;
        return rest;
    })
},
}

module.exports = nextConfig
