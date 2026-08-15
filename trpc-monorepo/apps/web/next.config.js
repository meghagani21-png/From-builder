/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only add rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/api/trpc/:path*",
          destination: "http://localhost:8000/trpc/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
