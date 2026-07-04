/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { dev, isServer }) => {
        if (dev && !isServer) {
            Object.defineProperty(config, 'devtool', {
                get() {
                    return 'source-map'; // atau 'inline-source-map', jangan pakai varian eval-*
                },
                set() { },
            });
        }
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;