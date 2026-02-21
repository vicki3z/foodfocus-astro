# Project overview
This is a SSG (Static Site Generation) website for Food Focus Thailand built with Astro + React TypeScript. It uses a headless WordPress backend and retrieves content via GraphQL.

## Architecture Overview

| Concern | Technology |
|---|---|
| **Node Version** | 20 |
| **Package Manager** | pnpm 10 |
| **Framework** | Astro 5 (SSG, `output: "static"`) |
| **UI Layer** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| **UI Components** | Radix UI primitives (`navigation-menu`, `tabs`, `slot`) |
| **Carousel** | Embla Carousel |
| **CMS / Backend** | Headless WordPress at `foodfocusthailand.com/wp-cms` |
| **GraphQL Client** | `@urql/core` (used at build-time for data fetching) |
| **GraphQL Codegen** | `@graphql-codegen/cli` — generates TypeScript types into `src/types/generated/graphql.ts` |
| **Sitemap** | `@astrojs/sitemap` integration |
| **Build Bundler** | Vite + esbuild (minification, ES2022 target) |
| **Hosting** | FTP server (deployed via GitHub Actions on push to `main`) |
| **CI/CD** | GitHub Actions — also triggered by WordPress webhook on publish/update |

See @package.json for available npm commands.

## Architectural Decisions

- **Astro over other frameworks** — Astro is purpose-built for content-rich websites and ships zero JavaScript by default, resulting in less overhead and faster page loads compared to fully client-side frameworks like Next.js or Remix.

- **SSG strategy** — Pages are pre-rendered at build time to maximise performance and SEO. The hosting environment is a static FTP server with no server-side runtime, so SSR is not a viable option.

- **Tailwind CSS + Radix UI** — Tailwind's utility-first approach and Radix UI's unstyled, accessible primitives together allow rapid layout development without having to build components from scratch or fight with opinionated styles.

- **urql (`@urql/core`)** — Used at build time to fetch data from the WordPress GraphQL API. urql's built-in caching avoids redundant network requests during the build, which is important given the number of pages fetching overlapping data.

## Folder Structure

```
foodfocus-astro/
├── public/               # Static assets (fonts, images)
├── src/
│   ├── assets/           # Build-time assets
│   ├── components/
│   │   ├── layout/       # Header, footer, and structural layout components
│   │   ├── sections/     # Page section components
│   │   └── ui/           # Reusable UI components
│   ├── layouts/          # Astro layout wrappers
│   ├── lib/              # GraphQL queries and utility functions
│   ├── pages/            # File-based routing (mirrors site URL structure)
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types (generated GraphQL types + internal)
├── dist/                 # Build output (generated)
├── .env                  # Environment variables (e.g. WordPress GraphQL endpoint)
├── astro.config.mjs      # Astro configuration
└── codegen.ts            # GraphQL code generation config (generates types in src/types/generated)
```

## Additional Instructions
- Use to Astro Docs MCP when required Astro knowledge
- Always optimise for website performance first
