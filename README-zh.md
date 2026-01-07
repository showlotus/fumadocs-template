<div align="center">
   <h1>Fumadocs Template</h1>
   <p align="center"><a href="README.md">English</a> | 简体中文</p>
   <p><em>这是一个使用 <a href="https://nextjs.org/">Next.js</a> 和 <a href="https://fumadocs.dev/">Fumadocs</a> 构建的现代文档网站模板</em></p>
</div>

## 特性

- **MDX 支持**：可在 Markdown 中嵌入 JSX 组件编写文档
- **主题切换**：通过 `next-themes` 支持浅色/深色模式
- **代码高亮**：使用 Shiki 提供语法高亮
- **响应式设计**：基于 Tailwind CSS 的移动友好布局
- **TypeScript**：完整的 TypeScript 支持
- **ESLint**：代码检查与格式化
- **自定义组件**：内置常用组件（如 `LinkButton`、`ThemeImage`、`CodeBlock`、`ViewCode`）
- **静态导出**：内置静态站点生成，方便部署到 GitHub Pages

## 快速开始

### 前提条件

- Node.js 20+
- pnpm（推荐）或 npm/yarn

### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/showlotus/fumadocs-template.git
   ```

2. 进入项目目录：

   ```bash
   cd fumadocs-template
   ```

3. 安装依赖：

   ```bash
   pnpm install
   ```

4. 运行开发服务器：

   ```bash
   pnpm dev
   ```

5. 在浏览器打开 `http://localhost:3000`。

## 项目结构

```
fumadocs-template/
├── content/
│   └── docs/                 # 文档内容（MDX）
│       ├── index.mdx         # 主页
│       ├── components.mdx    # 组件文档
│       ├── components/       # 组件示例
├── src/
│   ├── app/                  # Next.js 应用目录
│   │   ├── (home)/           # 落地页
│   │   ├── docs/             # 文档页面
│   │   ├── api/              # API 路由
│   │   ├── og/               # 生成 OG 图片
│   │   └── global.css        # 全局样式
│   ├── components/           # 可复用 UI 组件
│   ├── lib/                  # 工具函数与配置
│   └── plugins/              # 自定义 remark 插件
├── source.config.ts          # Fumadocs MDX 配置
├── next.config.mjs           # Next.js 配置
├── tailwind.config.mjs       # Tailwind CSS 配置
├── eslint.config.mjs         # ESLint 配置
└── package.json              # 依赖与脚本
```

## 自定义

### 添加文档

将新的 MDX 文件添加到 `content/docs/` 目录，文件结构将自动生成导航。

示例 Frontmatter：

```yaml
---
title: My New Page
description: A description of this page
---
```

（注：Frontmatter 字段可根据需要翻译或保持原样）

### 自定义组件

在 `src/components/` 中创建可复用组件，并在 MDX 文件中导入使用。

### 主题配置

可在 `source.config.ts` 中修改主题设置，例如：

```typescript
rehypeCodeOptions: {
  themes: {
    light: 'your-light-theme',
    dark: 'your-dark-theme',
  },
}
```

### 布局选项

在 `src/lib/layout.shared.tsx` 中自定义布局：

- 导航链接
- 页脚内容
- 主题相关设置

## 脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm types:check` - 检查 TypeScript 类型
- `pnpm lint` - 运行 ESLint

## 部署

### Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中连接你的仓库
3. 自动部署

### 其他平台

此项目已配置为静态导出，因此可以部署到：

- GitHub Pages
- Netlify
- 任何静态托管服务

## 配置说明

- **静态导出**：项目使用静态导出（`output: 'export'`），以兼容 GitHub Pages
- **输出目录**：构建文件将导出到 `docs` 文件夹
- **搜索 API**：搜索 API 路由可用，但为静态部署时通常被注释或禁用
- **资源前缀**：在子路径部署时可在 `next.config.mjs` 中配置 `basePath` 与 `assetPrefix`

## 许可证

本项目基于 MIT 许可证，详见 `LICENSE` 文件。

## 参考资源

- [Fumadocs 文档](https://fumadocs.dev)
- [Next.js 文档](https://nextjs.org/docs)
- [MDX 文档](https://mdxjs.com)
- [Tailwind CSS](https://tailwindcss.com)
