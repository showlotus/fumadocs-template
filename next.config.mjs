import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export', // ⭐ 必须
  images: {
    unoptimized: true, // GitHub Pages 不支持 Image 优化
  },
  trailingSlash: true,
  ...(process.env.NODE_ENV === 'production'
    ? {
        // basePath: '/fumadocs-template', // 仓库名
        // assetPrefix: '', // 资源路径前缀
      }
    : {}),
}

export default withMDX(config)
