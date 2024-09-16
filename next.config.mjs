/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io",
        ],
    },
    webpack: (config) => {
        // Add support for "node:" scheme
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                async_hooks: false, // Add this line to ignore 'node:async_hooks' in browser builds
            },
            fullySpecified: false, // Resolve the "node:" URI issue
        };

        return config;
    },
};

export default nextConfig;
