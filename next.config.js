const isProd = process.env.NODE_ENV === 'production'
const prefixPath = !isProd ? '/ffmpeg_test' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: prefixPath,
  basePath: prefixPath,
  trailingSlash: true,
  publicRuntimeConfig: {
    urlPrefix: prefixPath
  },  
}

module.exports = nextConfig
