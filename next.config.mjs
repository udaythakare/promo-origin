/** @type {import('next').NextConfig} */
import withSerwist from '@serwist/next';

const nextConfig = {
    turbopack: {},
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tse3.mm.bing.net',
                pathname: '/th/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
        ],
    },
    experimental: {
        optimizePackageImports: [
            'react-icons',
            'lucide-react',
            'date-fns',
            'recharts',
            'framer-motion',
        ],
        staleTimes: {
            dynamic: 30,
            static: 180,
        },
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
            {
                source: '/icons/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

const config = withSerwist({
    swSrc: 'app/sw.js',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default config;