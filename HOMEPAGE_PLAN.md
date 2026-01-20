# Food Focus Thailand - Implementation Plan

## Overview
Build the website for foodfocusthailand.com using Astro, React, TypeScript, and TailwindCSS with Radix UI components. Content will be fetched from WordPress via GraphQL. This is a revamp from the existing CRA-based site.

### Pages to Implement
1. **Homepage** - Main landing page with hero, articles, news, and ads
2. **List Page** - Reusable listing page for posts/CPTs (e.g., What's In, News, Roadmaps)
3. **Article Page** - Reusable detail page for posts/CPTs with "Other Articles" sidebar
4. **404 Page** - Custom error page

## Tech Stack
- **Framework**: Astro 5.16 (static site generation)
- **UI Components**: React 19 + Radix UI (navigation only)
- **Styling**: TailwindCSS v4 (already configured)
- **Data**: WordPress GraphQL (`https://foodfocusthailand.com/wp-cms/graphql`)
- **GraphQL Client**: `graphql-request` (lightweight, SSG-focused)
- **Carousel**: Embla Carousel (~7kb, lightweight)
- **Typography**: Work Sans (already loaded in `/public/fonts/`)
- **Hosting**: Traditional server + Cloudflare CDN
- **WordPress Plugin**: WPGraphQL Smart Cache (for faster builds)

---

## Architecture Decisions

### Why `graphql-request` over `urql`
- **Bundle size**: ~5kb vs ~25kb
- **Use case**: Build-time fetching in `.astro` files, not client-side React hooks
- **Simplicity**: Thin fetch wrapper, no provider/cache setup needed
- Client-side "Load more" handled with simple fetch calls

### Component Hydration Strategy (Islands Architecture)
Minimize JavaScript by using Astro components for static content:

| Component | Type | Hydration | Reason |
|-----------|------|-----------|--------|
| Header | React | `client:load` | Interactive dropdowns, mobile menu |
| BannerCarousel | React | `client:visible` | Carousel interaction |
| SearchInput | React | `client:load` | Form interaction |
| LoadMoreButton | React | `client:visible` | Client-side pagination |
| HeroSection | **Astro** | None | Static content |
| WhatsInSection | **Astro** | None | Static content |
| NewsSection | **Astro** | None | Static content |
| AdvertisementSection | **Astro** | None | Static content |
| Footer | **Astro** | None | Static content |
| ArticleContent | **Astro** | None | Static HTML rendering |
| Breadcrumb | **Astro** | None | Static navigation |

---

## GraphQL Schema Summary

### Content Types & Queries

| Content | Query | Key Fields |
|---------|-------|------------|
| **Magazine** | `magazines(first: 1)` | `title`, `date`, `magazines.image.node.sourceUrl`, `magazines.link`, `magazines.magazineNo` |
| **Banners (Top)** | `banners` filter by `T_` prefix | `bannerFields.image.node.sourceUrl`, `bannerFields.link` |
| **Banners (Bottom)** | `banners` filter by `B_` prefix | Same as above |
| **What's In** | `posts(where: {categoryName: "whats-in"})` | `title`, `excerpt`, `featuredImage.node.sourceUrl`, `link` |
| **News** | `posts(where: {categoryName: "news"})` | Same as above |
| **Ushare** | `posts(where: {categoryName: "ushare"})` | Same as above |
| **Advertisement** | `posts(where: {categoryName: "advertisement"})` | `title`, `featuredImage.node.sourceUrl`, `link` |
| **Roadmap** | `roadmaps(first: 3)` | `title`, `featuredImage.node.sourceUrl`, `link`, `postSummary.summary` |
| **Roadshow** | `roadshows(first: 3)` | Same as above |
| **Seminar** | `seminars(first: 3)` | Same as above |
| **Proseries** | `proseries(first: 3)` | Same as above |

---

## Implementation Steps

### Phase 1: Project Setup & Utilities

#### 1.1 Install Dependencies
```bash
# Core dependencies
npm install graphql-request graphql
npm install embla-carousel-react

# Radix UI (only for interactive components)
npm install @radix-ui/react-navigation-menu @radix-ui/react-slot

# Dev dependencies
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

#### 1.2 Configure GraphQL Codegen
**File**: `codegen.ts`
```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.WP_GRAPHQL_URL,
  documents: ['src/**/*.ts', 'src/**/*.astro'],
  generates: {
    './src/types/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};
export default config;
```
- Run `npm run codegen` to generate TypeScript types from schema
- Add script: `"codegen": "graphql-codegen --config codegen.ts"`

#### 1.3 Create GraphQL Client
**File**: `src/lib/graphql.ts`
- Create typed GraphQL client using `graphql-request`
- Configure with endpoint from environment variable
- Add error handling with retry logic
- Export reusable query functions

```typescript
import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.WP_GRAPHQL_URL;

export const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Wrapper with error handling
export async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
}
```

#### 1.4 Configure Astro for Images
**File**: `astro.config.mjs`
```javascript
export default defineConfig({
  image: {
    domains: ['foodfocusthailand.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
```

#### 1.5 Add Alt Text to GraphQL Queries
Ensure all image queries include `altText` for accessibility:
```graphql
featuredImage {
  node {
    sourceUrl
    altText
  }
}
```

---

### Phase 2: Shared Components

#### 2.1 UI Primitives
**Directory**: `src/components/ui/`

| Component | File | Type | Description |
|-----------|------|------|-------------|
| Button | `Button.tsx` | React | Radix Slot-based button with variants |
| Tag | `Tag.astro` | Astro | Category/label tag component |
| Card | `Card.astro` | Astro | Base card component for news/articles |
| ArticleCard | `ArticleCard.astro` | Astro | Vertical card with image, tag, title, excerpt |
| Breadcrumb | `Breadcrumb.astro` | Astro | Navigation breadcrumb |
| SearchInput | `SearchInput.tsx` | React | Styled search input with icon |
| LoadMoreButton | `LoadMoreButton.tsx` | React | Client-side pagination button |

#### 2.2 Layout Components
**Directory**: `src/components/layout/`

| Component | File | Type | Description |
|-----------|------|------|-------------|
| Header | `Header.tsx` | React | Navigation bar (Radix NavigationMenu) - responsive |
| Footer | `Footer.astro` | Astro | Site footer with links and social icons |
| Container | `Container.astro` | Astro | Max-width wrapper with padding |

---

### Phase 3: Homepage Sections

**Directory**: `src/components/sections/`

| Section | File | Type | Notes |
|---------|------|------|-------|
| Hero | `HeroSection.astro` | Astro | Magazine cover, email form, logos |
| Banner Top | `BannerCarousel.tsx` | React | Embla carousel, `T_` prefix banners |
| What's In | `WhatsInSection.astro` | Astro | Featured + 3 horizontal cards |
| Advertisement | `AdvertisementSection.astro` | Astro | 3 ad images in a row |
| News | `NewsSection.astro` | Astro | 6 news articles left column |
| Configurable | `ConfigurableSection.astro` | Astro | CPT cards (roadmap/ushare/proseries) |
| Banner Bottom | `BannerCarousel.tsx` | React | Reuse carousel, `B_` prefix banners |

#### 3.1 Hero Section (`HeroSection.astro`)
- Background image from `src/assets/header-bg.svg`
- Latest magazine cover + info (from `magazines` query)
- Email subscription form (POST to `https://www.foodfocusthailand.com/email.php`)
- Logos from `src/assets/`
- Use Astro `<Image>` component for optimization

#### 3.2 Banner Carousel (`BannerCarousel.tsx`)
- **Library**: Embla Carousel React (~7kb)
- Query banners, filter by title prefix (`T_` or `B_`)
- Carousel with pagination dots
- Clickable with link from `bannerFields.link`
- Use `client:visible` for lazy hydration

#### 3.3 What's In Section (`WhatsInSection.astro`)
- Section header with "See all" button
- Featured article card (large, left side)
- 3 horizontal article cards (right side, stacked)
- Query: `posts(first: 4, where: {categoryName: "whats-in"})`

#### 3.4 Advertisement Section (`AdvertisementSection.astro`)
- "- Advertisement -" label
- 3 advertisement images in a row
- Query: `posts(first: 3, where: {categoryName: "advertisement"})`

#### 3.5 News & Activities Section (`NewsSection.astro`)
- Left column: News articles (6 items)
- Right column: Configurable content (Roadmap/Ushare/Proseries cards)
- Query: `posts(first: 6, where: {categoryName: "news"})`

#### 3.6 Configurable Section (`ConfigurableSection.astro`)
- Display 3 items from user-selected CPTs
- Props: array of content type configs
- Initial config: `['roadmap', 'ushare', 'proseries']`

#### 3.7 Banner Carousel - Bottom
- Reuse `BannerCarousel.tsx` component
- Pass banners filtered by `B_` title prefix

---

### Phase 4: Homepage Assembly

#### 4.1 Homepage Layout
**File**: `src/layouts/BaseLayout.astro`
- HTML structure with meta tags
- Import global styles
- Slot for page content

#### 4.2 Homepage Page
**File**: `src/pages/index.astro`
- Fetch all data at build time (SSG)
- Compose sections with fetched data
- Pass data as props to React components

---

## Phase 5: List Page

The List Page is a reusable template for displaying posts or CPT items in a grid layout.

### 5.1 Design (from Figma)
- **Breadcrumb**: Home > Category Name
- **Page Title**: Category name as heading
- **Grid Layout**: 3 columns of article cards
- **Load More**: Button at bottom to load additional items
- **Cards**: Image, category tag, title, excerpt, date

### 5.2 Components

#### Breadcrumb (`src/components/ui/Breadcrumb.astro`)
```typescript
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}
```
- Home icon + text links separated by ">"
- Last item is not a link (current page)

#### ArticleCard (`src/components/ui/ArticleCard.astro`)
```typescript
interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}
```
- Vertical card with image on top
- Category tag below image
- Title, excerpt, date stacked

#### ArticleGrid (`src/components/sections/ArticleGrid.astro`)
```typescript
interface ArticleGridProps {
  articles: ArticleCardProps[];
  columns?: 2 | 3; // Default 3
}
```
- CSS Grid with responsive columns
- Gap between cards

### 5.3 Dynamic Routing

**Important**: Post categories and CPTs use different GraphQL queries, so we need separate route handling.

#### Option A: Separate Route Files (Recommended)
```
src/pages/
├── whats-in/
│   ├── index.astro        # Posts with category "whats-in"
│   └── [slug].astro
├── news/
│   ├── index.astro        # Posts with category "news"
│   └── [slug].astro
├── ushare/
│   ├── index.astro        # Posts with category "ushare"
│   └── [slug].astro
├── roadmap/
│   ├── index.astro        # CPT: roadmaps query
│   └── [slug].astro
├── roadshow/
│   ├── index.astro        # CPT: roadshows query
│   └── [slug].astro
├── seminar/
│   ├── index.astro        # CPT: seminars query
│   └── [slug].astro
└── proseries/
    ├── index.astro        # CPT: proseries query
    └── [slug].astro
```

#### Route Configuration Map
**File**: `src/lib/routes.ts`
```typescript
export const CONTENT_ROUTES = {
  'whats-in': { type: 'category', query: 'posts', label: "What's In" },
  'news': { type: 'category', query: 'posts', label: 'News' },
  'ushare': { type: 'category', query: 'posts', label: 'Ushare' },
  'roadmap': { type: 'cpt', query: 'roadmaps', label: 'Roadmap' },
  'roadshow': { type: 'cpt', query: 'roadshows', label: 'Roadshow' },
  'seminar': { type: 'cpt', query: 'seminars', label: 'Seminar' },
  'proseries': { type: 'cpt', query: 'proseries', label: 'Proseries' },
} as const;
```

### 5.4 Pagination Strategy
- **Initial Load**: 9 items (3x3 grid)
- **Load More**: Client-side fetch of next 9 items
- Use GraphQL `first` and `after` (cursor-based) pagination
- "Load more" button triggers client-side fetch with `client:load`

### 5.5 GraphQL Query Example
```graphql
query GetPosts($first: Int!, $after: String, $category: String!) {
  posts(first: $first, after: $after, where: {categoryName: $category}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      title
      excerpt
      date
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

---

## Phase 6: Article Page

The Article Page is a reusable template for displaying individual post/CPT content.

### 6.1 Design (from Figma)
- **Two-column layout**: Content (left ~70%) + Sidebar (right ~30%)
- **Breadcrumb**: Home > Category > Article Title
- **Title**: English title (large) + Thai title (smaller, gray)
- **View Count**: Eye icon + number
- **Featured Image**: Full-width below title
- **Content**: WordPress content rendered as HTML
- **Sidebar**: "Other Articles" section with 3 random related articles

### 6.2 Components

#### ArticleHeader (`src/components/sections/ArticleHeader.astro`)
```typescript
interface ArticleHeaderProps {
  titleEn: string;
  titleTh?: string;
  viewCount: number;
  featuredImage: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}
```

#### ArticleContent (`src/components/sections/ArticleContent.astro`)
```typescript
interface ArticleContentProps {
  content: string; // HTML from WordPress
}
```
- Renders WordPress content with proper styling
- Handles embedded images, videos, etc.

#### OtherArticles (`src/components/sections/OtherArticles.astro`)
```typescript
interface OtherArticlesProps {
  articles: Array<{
    image: string;
    title: string;
    href: string;
  }>;
  sectionTitle?: string; // Default: "Other Articles"
}
```
- Vertical stack of 3 article cards (smaller format)
- Image + title only (no excerpt)

### 6.3 Dynamic Routing

**File**: `src/pages/[category]/[slug].astro`

- Fetches single post/CPT by slug
- Fetches 3 random "other articles" from same category/CPT
- Passes data to React components

### 6.4 Random "Other Articles" Strategy

WordPress GraphQL doesn't have a native random query, so we use one of these approaches:

**Option A: Build-time Random (Recommended for SSG)**
```typescript
// Fetch more items than needed, shuffle, take 3
const allPosts = await fetchPosts({ category, first: 20, exclude: currentSlug });
const shuffled = allPosts.sort(() => Math.random() - 0.5);
const otherArticles = shuffled.slice(0, 3);
```

**Option B: Offset-based Pseudo-random**
```typescript
// Use date or ID-based offset for variety
const offset = Math.floor(Date.now() / 86400000) % 10; // Changes daily
const posts = await fetchPosts({ category, first: 3, offset });
```

### 6.5 GraphQL Query for Single Post
```graphql
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    title
    content
    date
    slug
    featuredImage {
      node {
        sourceUrl
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
    # Custom field for Thai title if available
    postFields {
      titleTh
    }
  }
}
```

### 6.6 View Count
- If WordPress has a view count plugin with GraphQL support, query it
- Otherwise, implement client-side tracking (analytics event)
- For MVP: Display static count or hide if unavailable

---

## Phase 7: SEO & Accessibility

### 7.1 SEO Meta Tags
**File**: `src/components/SEO.astro`
```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}
---
<title>{title} | Food Focus Thailand</title>
<meta name="description" content={description} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:type" content={type} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />

<!-- JSON-LD for Articles -->
{type === 'article' && (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "image": image,
      "datePublished": publishedTime
    })}
  </script>
)}
```

### 7.2 Accessibility Requirements
- **Skip link**: Add "Skip to main content" link in Header
- **ARIA landmarks**: Use `<main>`, `<nav>`, `<footer>` semantic elements
- **Alt text**: All images must have `altText` from WordPress (added to queries)
- **Focus states**: Visible focus indicators on all interactive elements
- **Color contrast**: Verify WCAG AA compliance for all text colors

### 7.3 Error Handling
**File**: `src/pages/404.astro`
- Custom 404 page with navigation back to home
- Styled consistently with site design

**Error Boundaries**: Add try/catch in data fetching with fallback UI

---

## Phase 8: URL Redirects (CRA Migration)

### 8.1 Redirect Map
Create redirects from old CRA routes to new Astro routes:

**File**: `public/_redirects` (if using Netlify) or `.htaccess` (Apache)

```apache
# .htaccess redirects from old CRA routes
RewriteEngine On

# Old hash-based routes (CRA used HashRouter)
RewriteRule ^#/whats-in/(.*)$ /whats-in/$1 [R=301,L]
RewriteRule ^#/news/(.*)$ /news/$1 [R=301,L]

# Old query string routes
RewriteCond %{QUERY_STRING} ^article=(.*)$
RewriteRule ^$ /news/%1? [R=301,L]
```

### 8.2 Canonical URLs
Add canonical URLs to prevent duplicate content:
```html
<link rel="canonical" href="https://foodfocusthailand.com{Astro.url.pathname}" />
```

---

## Phase 9: Caching & Deployment (Traditional Hosting)

### 9.1 Caching Strategy Overview
```
┌─────────────────────────────────────────────────────────┐
│         CACHING STRATEGY (Traditional Hosting)          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  BUILD                                                   │
│  ├── Run `npm run build` locally or via GitHub Actions │
│  └── Upload `dist/` folder to server via FTP/SSH       │
│                                                          │
│  CDN (Cloudflare - FREE)                                │
│  ├── Point domain DNS to Cloudflare                    │
│  ├── Enable "Cache Everything" page rule               │
│  ├── Set Edge TTL: 4 hours (or less for frequent updates)│
│  └── Purge cache after each deploy                     │
│                                                          │
│  SERVER (.htaccess for Apache)                          │
│  ├── HTML: Cache-Control: no-cache (Cloudflare handles)│
│  ├── JS/CSS/Fonts: max-age=31536000, immutable         │
│  └── Enable gzip/brotli compression                    │
│                                                          │
│  WORDPRESS                                               │
│  └── WPGraphQL Smart Cache plugin installed            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Cloudflare Setup
1. Create free Cloudflare account
2. Add site and update nameservers
3. Enable these settings:
   - **SSL**: Full (strict)
   - **Auto Minify**: JS, CSS, HTML
   - **Brotli**: On
   - **Page Rule**: `*foodfocusthailand.com/*` → Cache Level: Cache Everything, Edge TTL: 4 hours

### 9.3 Apache .htaccess Configuration
**File**: `public/.htaccess`
```apache
# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache Control Headers
<IfModule mod_headers.c>
  # HTML - no cache (Cloudflare handles caching)
  <FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
  
  # Static assets - long cache with immutable
  <FilesMatch "\.(css|js|woff2|woff|ttf|png|jpg|jpeg|gif|svg|webp|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 9.4 Deployment Options

#### Option A: Manual Deployment
```bash
npm run build
# Upload dist/ folder via FileZilla or similar FTP client
```

#### Option B: GitHub Actions (Recommended)
**File**: `.github/workflows/deploy.yml`
```yaml
name: Deploy to Server

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          WP_GRAPHQL_URL: ${{ secrets.WP_GRAPHQL_URL }}
      
      - name: Deploy via SSH
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/public_html/"
      
      - name: Purge Cloudflare Cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
```

### 9.5 WordPress Webhook (Auto-rebuild on Publish)
**Option**: Install WP Webhooks plugin to trigger GitHub Actions on content publish

```php
// Webhook URL: https://api.github.com/repos/OWNER/REPO/dispatches
// Headers: Authorization: token YOUR_GITHUB_PAT
// Body: {"event_type": "wordpress_publish"}
```

---

## Updated File Structure

```
src/
├── assets/
│   ├── FFT-logo.png (existing)
│   ├── be-media-logo.png (existing)
│   └── header-bg.svg (existing)
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # React
│   │   ├── Tag.astro            # Astro
│   │   ├── Card.astro           # Astro
│   │   ├── ArticleCard.astro    # Astro
│   │   ├── Breadcrumb.astro     # Astro
│   │   ├── SearchInput.tsx      # React
│   │   └── LoadMoreButton.tsx   # React
│   ├── layout/
│   │   ├── Header.tsx           # React (interactive nav)
│   │   ├── Footer.astro         # Astro
│   │   └── Container.astro      # Astro
│   ├── sections/
│   │   ├── HeroSection.astro    # Astro
│   │   ├── BannerCarousel.tsx   # React (Embla)
│   │   ├── WhatsInSection.astro # Astro
│   │   ├── AdvertisementSection.astro  # Astro
│   │   ├── NewsSection.astro    # Astro
│   │   ├── ConfigurableSection.astro   # Astro
│   │   ├── ArticleGrid.astro    # Astro
│   │   ├── ArticleHeader.astro  # Astro
│   │   ├── ArticleContent.astro # Astro
│   │   └── OtherArticles.astro  # Astro
│   └── SEO.astro                # NEW
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── graphql.ts
│   └── routes.ts                # NEW
├── pages/
│   ├── index.astro
│   ├── 404.astro                # NEW
│   ├── whats-in/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── news/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── ushare/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── roadmap/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── roadshow/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── seminar/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── proseries/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   └── global.css (existing)
└── types/
    └── generated/
        └── graphql.ts           # Auto-generated
public/
├── .htaccess                    # NEW
└── fonts/ (existing)
.github/
└── workflows/
    └── deploy.yml               # NEW
codegen.ts                       # NEW
```

---

## Key Implementation Details

### Colors (from Figma)
```css
--color-primary: #3a5f47;      /* Green - buttons, tags, footer */
--color-primary-light: #cbe5d5; /* Light green - hover states */
--color-text-dark: #2d3319;     /* Dark text */
--color-text-muted: #535353;    /* Muted text */
--color-bg-light: #f8f8f8;      /* Section backgrounds */
--color-accent: #5bb4ae;        /* Teal accent */
```

### Banner Filtering Logic
```typescript
// Top banners (position 14)
const topBanners = banners.filter(b => b.title.startsWith('T_'));

// Bottom banners (position 15)
const bottomBanners = banners.filter(b => b.title.startsWith('B_'));
```

### Email Subscription
```typescript
// POST to https://www.foodfocusthailand.com/email.php
// Form data: email field
```

### Navigation Structure
```
Home | About us ▼ | Magazines ▼ | Events ▼ | Services ▼ | Contact us
```
- Dropdowns use Radix NavigationMenu
- Mobile: hamburger menu with slide-out drawer

---

## Responsive Strategy
- **Desktop-first** implementation
- **Navigation only** responsive for now (hamburger menu on mobile)
- Full mobile responsiveness as follow-up task

---

## Data Fetching Strategy
- **Build-time (SSG)**: All homepage data fetched in `index.astro` frontmatter
- **Client-side hydration**: Only for interactive components (navigation dropdowns, carousels)
- **Islands architecture**: React components with `client:load` or `client:visible` directives

---

## Files to Create/Modify (Final Count: ~46 files)

### Configuration Files
1. `codegen.ts` - GraphQL code generation config
2. `astro.config.mjs` - Update with image domains
3. `.github/workflows/deploy.yml` - CI/CD pipeline
4. `public/.htaccess` - Apache cache/redirect rules

### Library Files
5. `src/lib/graphql.ts` - GraphQL client with error handling
6. `src/lib/routes.ts` - Route configuration map
7. `src/types/generated/graphql.ts` - Auto-generated types

### UI Components (Astro unless noted)
8. `src/components/ui/Button.tsx` - React
9. `src/components/ui/Tag.astro`
10. `src/components/ui/Card.astro`
11. `src/components/ui/ArticleCard.astro`
12. `src/components/ui/Breadcrumb.astro`
13. `src/components/ui/SearchInput.tsx` - React
14. `src/components/ui/LoadMoreButton.tsx` - React

### Layout Components
15. `src/components/layout/Header.tsx` - React (interactive nav)
16. `src/components/layout/Footer.astro`
17. `src/components/layout/Container.astro`
18. `src/components/SEO.astro`

### Section Components (Astro unless noted)
19. `src/components/sections/HeroSection.astro`
20. `src/components/sections/BannerCarousel.tsx` - React (Embla)
21. `src/components/sections/WhatsInSection.astro`
22. `src/components/sections/AdvertisementSection.astro`
23. `src/components/sections/NewsSection.astro`
24. `src/components/sections/ConfigurableSection.astro`
25. `src/components/sections/ArticleGrid.astro`
26. `src/components/sections/ArticleHeader.astro`
27. `src/components/sections/ArticleContent.astro`
28. `src/components/sections/OtherArticles.astro`

### Page Files
29. `src/layouts/BaseLayout.astro`
30. `src/pages/index.astro` (modify)
31. `src/pages/404.astro`
32-33. `src/pages/whats-in/index.astro`, `[slug].astro`
34-35. `src/pages/news/index.astro`, `[slug].astro`
36-37. `src/pages/ushare/index.astro`, `[slug].astro`
38-39. `src/pages/roadmap/index.astro`, `[slug].astro`
40-41. `src/pages/roadshow/index.astro`, `[slug].astro`
42-43. `src/pages/seminar/index.astro`, `[slug].astro`
44-45. `src/pages/proseries/index.astro`, `[slug].astro`

### Style Files
46. `src/styles/global.css` (modify - add color variables)

---

## Implementation Order (Updated - 10 Phases)

### Phase 1: Project Setup
- Install dependencies (graphql-request, embla-carousel-react, Radix UI)
- Configure GraphQL codegen, run initial generation
- Configure Astro for remote images
- Set up `.htaccess` with cache headers

### Phase 2: Core Infrastructure
- Create GraphQL client with error handling
- Create route configuration map
- Set up BaseLayout.astro with SEO component

### Phase 3: UI Primitives
- Button.tsx (React)
- Tag.astro, Card.astro, ArticleCard.astro (Astro)
- Breadcrumb.astro (Astro)
- SearchInput.tsx, LoadMoreButton.tsx (React)

### Phase 4: Layout Components
- Header.tsx with Radix NavigationMenu (React)
- Footer.astro (Astro)
- Container.astro (Astro)

### Phase 5: Homepage Sections
- HeroSection.astro
- BannerCarousel.tsx (Embla)
- WhatsInSection.astro
- AdvertisementSection.astro
- NewsSection.astro + ConfigurableSection.astro

### Phase 6: Homepage Assembly
- Wire up index.astro with data fetching
- Test all sections with real WordPress data

### Phase 7: List Pages
- ArticleGrid.astro component
- Create all 7 category/CPT list pages
- Implement LoadMoreButton pagination

### Phase 8: Article Pages
- ArticleHeader.astro, ArticleContent.astro
- OtherArticles.astro (random selection)
- Create all 7 article detail pages

### Phase 9: SEO & Polish
- SEO.astro component with Open Graph, JSON-LD
- 404.astro page
- Accessibility audit (skip links, alt text, focus states)
- Final styling adjustments

### Phase 10: Deployment Setup
- Configure Cloudflare CDN
- Set up GitHub Actions workflow
- Test full build and deploy pipeline
- Configure WordPress webhook (optional)
