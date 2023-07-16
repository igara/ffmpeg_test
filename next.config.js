const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? "/ffmpeg_test'" : undefined,
  basePath: isProd ? "/ffmpeg_test'" : undefined,,
  trailingSlash: true,
  publicRuntimeConfig: {
    urlPrefix: isProd ? "/ffmpeg_test'" : undefined,
  },  
}

module.exports = nextConfig
