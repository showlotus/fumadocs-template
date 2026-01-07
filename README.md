<div align="center">
   <h1>Fumadocs Template</h1>
   <p align="center">English | <a href="README-zh.md">简体中文</a></p>
   <p><em>A modern documentation website template built with <a href="https://nextjs.org/">Next.js</a> and <a href="https://fumadocs.dev/">Fumadocs</a></em></p>
</div>

## Features

- **MDX Support**: Write documentation in Markdown with JSX components
- **Theme Switching**: Light and dark mode support with next-themes
- **Code Highlighting**: Syntax highlighting with Shiki
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **TypeScript**: Full TypeScript support
- **ESLint**: Code linting and formatting
- **Custom Components**: Pre-built components like LinkButton, ThemeImage, CodeBlock, ViewCode
- **Static Export**: Built-in static site generation for GitHub Pages compatibility

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/showlotus/fumadocs-template.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fumadocs-template
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fumadocs-template/
├── content/
│   └── docs/                 # Documentation content in MDX
│       ├── index.mdx         # Homepage
│       ├── components.mdx    # Component documentation
│       ├── components/       # Component demos
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── (home)/           # Landing page
│   │   ├── docs/             # Documentation pages
│   │   ├── api/              # API routes
│   │   ├── og/               # OG image generation
│   │   └── global.css        # Global styles
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and configurations
│   └── plugins/              # Custom remark plugins
├── source.config.ts          # Fumadocs MDX configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
├── eslint.config.mjs         # ESLint configuration
└── package.json              # Dependencies and scripts
```

## Customization

### Adding Documentation

Add new MDX files to the `content/docs/` directory. The file structure will automatically generate the navigation.

Example frontmatter:

```yaml
---
title: My New Page
description: A description of this page
---
```

### Custom Components

Create reusable components in `src/components/` and import them in your MDX files.

### Theme Configuration

Modify themes in `source.config.ts`:

```typescript
rehypeCodeOptions: {
  themes: {
    light: 'your-light-theme',
    dark: 'your-dark-theme',
  },
}
```

### Layout Options

Customize the layout in `src/lib/layout.shared.tsx`:

- Navigation links
- Footer content
- Theme settings

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm types:check` - Check TypeScript types
- `pnpm lint` - Run ESLint

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms

This project is configured for static export, so it can be deployed to:

- GitHub Pages
- Netlify
- Any static hosting service

## Configuration Notes

- **Static Export**: The project uses static export (`output: 'export'`) for GitHub Pages compatibility
- **Output Directory**: Built files are exported to the `docs` folder
- **Search API**: The search API route is available but currently commented out for static deployment
- **Asset Prefix**: Configure `basePath` and `assetPrefix` in `next.config.mjs` for subpath deployments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Fumadocs Documentation](https://fumadocs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com)
- [Tailwind CSS](https://tailwindcss.com)
