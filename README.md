# Next.js 16 ISR & Cache Components Demo

A comprehensive demo showcasing the latest Next.js 16 caching features including Cache Components, ISR (Incremental Static Regeneration), and Partial Prerendering (PPR).

## Features Demonstrated

### Next.js 16 Cache Components
- ✅ **`'use cache'` directive** - Explicit caching at component level
- ✅ **`cacheLife()` API** - Control cache duration with preset profiles
- ✅ **`cacheTag()` API** - Tag cached content for granular invalidation
- ✅ **`revalidateTag()`** - On-demand cache revalidation with stale-while-revalidate
- ✅ **`revalidatePath()`** - Path-based cache invalidation

### React Server Components (RSC)
- All pages use async React Server Components
- Direct data fetching without client-side JavaScript
- Streaming and Suspense for progressive rendering

### Partial Prerendering (PPR)
- Mix static (cached) and dynamic (uncached) content in the same page
- Product detail pages demonstrate PPR in action
- Static product data + dynamic timestamps

## Project Structure

```
app/
├── page.tsx                  # Home page with feature overview
├── products/
│   ├── page.tsx             # Products listing (cached with 'use cache')
│   └── [id]/page.tsx        # Product detail page (PPR demo)
├── admin/
│   └── page.tsx             # Admin dashboard (fully dynamic)
├── actions/
│   └── revalidate.ts        # Server Actions for cache control
└── globals.css              # Styling with Pure.css

lib/
└── data.ts                   # Mock product data source

next.config.ts               # Cache Components enabled
```

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## How to Test the Features

### Testing Cache Components

1. **Visit the Products page** (`/products`)
   - Note the "Data Fetched" timestamp
   - Refresh the page multiple times
   - **Expected:** Timestamp stays the same (page is cached!)

2. **Go to Admin Dashboard** (`/admin`)
   - Click "Revalidate All Products (revalidateTag)"
   - Return to `/products` and refresh
   - **Expected:** New timestamp (cache was invalidated!)

### Testing PPR (Partial Prerendering)

1. **Visit a product detail page** (`/products/1`)
   - Observe two sections:
     - **Static (Cached):** Product details with a fixed timestamp
     - **Dynamic (Uncached):** "Current Server Time" section

2. **Refresh the page multiple times**
   - **Expected:**
     - Product "Last Updated" timestamp stays the same
     - "Current Server Time" updates on every refresh
   - This demonstrates PPR - mixing cached and dynamic content!

### Testing Tag-Based Revalidation

1. **View product 1** (`/products/1`) - note its timestamp
2. **Go to Admin** (`/admin`)
3. **Click "Revalidate Product 1"**
4. **Return to `/products/1` and refresh**
   - **Expected:** Product timestamp updated
   - **Note:** Products listing `/products` is NOT affected (granular control!)

### Testing Data Updates

1. **View products listing** - note stock levels
2. **Go to Admin Dashboard**
3. **Click "Update Stock for Product 1"**
4. **Return to products listing**
   - **Expected:** Stock level changed after cache revalidation

## Key Concepts

### Cache Components vs Traditional ISR

**Traditional ISR (Next.js 15 and earlier):**
```typescript
export const revalidate = 3600; // Time-based only
```

**Cache Components (Next.js 16):**
```typescript
'use cache'
import { cacheLife, cacheTag } from 'next/cache';

export default async function Page() {
  cacheLife('hours');        // Flexible cache duration
  cacheTag('products');      // Granular invalidation
  // ...
}
```

### Caching Strategies

1. **Static with Long Cache** - Use `cacheLife('days')` for rarely changing content
2. **Stale-While-Revalidate** - Use `cacheLife('hours')` for frequently updated content
3. **Dynamic** - Don't use `'use cache'` for user-specific or real-time data
4. **Hybrid (PPR)** - Combine cached components with `Suspense` boundaries for dynamic content

### Server Actions for Cache Control

```typescript
'use server'
import { revalidateTag } from 'next/cache';

export async function updateProduct(id: string) {
  await db.update(id);
  revalidateTag(`product-${id}`);  // Invalidate specific product
  revalidateTag('products');        // Invalidate listing
}
```

## Technologies Used

- **Next.js 16** (canary) - Latest features
- **React 19.2.0** - React Server Components
- **TypeScript 5** - Type safety
- **Pure.css 3.0** - Minimal CSS framework
- **Biome** - Fast linter and formatter

## Cache Configuration

The app uses these cache life profiles:

- **'hours'**: stale=3600s, revalidate=900s (default for most content)
- **'days'**: For long-lived static content
- **'minutes'**: For frequently changing content

Custom profiles can be defined:
```typescript
cacheLife({
  stale: 3600,      // Serve stale content for 1 hour
  revalidate: 900,  // Revalidate in background after 15 min
  expire: 86400,    // Hard expiration after 1 day
});
```

## Production Deployment

1. **Build the app:**
   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel deploy
   ```

## Learning Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Cache Components Guide](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Partial Prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

## Notes

- This demo uses mock data stored in memory - refresh the server to reset
- Cache Components require Next.js 16 with `cacheComponents: true`
- All async request APIs (`cookies()`, `headers()`, `params`) require `await` in Next.js 16
- The dev server automatically restarts when config changes

## License

MIT
