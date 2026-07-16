/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Turbopack to correctly bundle framer-motion ESM packages
  transpilePackages: ["framer-motion", "motion-dom", "motion"],

  // firebase-admin v14 internally uses jwks-rsa which require()s the ESM-only
  // jose package.  When Next.js bundles these into a serverless function the
  // require() call fails with ERR_REQUIRE_ESM.  Marking them as external keeps
  // them as normal node_modules imports so the native ESM resolution works.
  serverExternalPackages: ["firebase-admin"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },       // Cloudinary (Phase 4)
      { protocol: "https", hostname: "images.unsplash.com" },      // Dev placeholders
    ],
  },
};

export default nextConfig;
