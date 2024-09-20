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
        },

        config.externals.push({
            
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil",
            
        })

        return config;
    },
};

export default nextConfig;
