const isProd = process.env.NODE_ENV === 'production'
const prefixPath = !isProd ? '/ffmpeg_test' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: prefixPath,
  basePath: prefixPath,
}

module.exports = nextConfig
