/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: false,
    forceSwcTransforms: true,
  }
}

const removeImports = require('next-remove-imports')()

module.exports = removeImports(nextConfig)
