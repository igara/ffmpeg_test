/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './',
  basePath: './',
  trailingSlash: true,
  publicRuntimeConfig: {
    urlPrefix: './',
  },  
}

module.exports = nextConfig
