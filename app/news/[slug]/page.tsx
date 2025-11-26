import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

// Page shell that provides layout and suspense boundary
export default function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>News Article</h1>
        <Link href="/news" className="back-link">
          ← Back to News
        </Link>
      </div>

      <Suspense fallback={<div className="loading">Loading article...</div>}>
        <NewsContent params={params} />
      </Suspense>
    </div>
  );
}

// Unwrap params and pass to cached component
async function NewsContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CachedStory slug={slug} />;
}

// The cached component with 'use cache' for ISR behavior
async function CachedStory({ slug }: { slug: string }) {
  "use cache";
  cacheLife("seconds"); // Cache for 60s

  // Simulate heavy DB work
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const generatedAt = new Date().toISOString();

  return (
    <>
      <div className="cache-info">
        <div className="cache-badge">Cached with ISR</div>
        <div className="cache-details">
          <p>
            <strong>Cache Life:</strong> seconds (60s)
          </p>
          <p>
            <strong>Generated At:</strong> {generatedAt}
          </p>
          <p className="cache-note">
            This article is cached on-demand using Next.js ISR. The first
            request generates the page, subsequent requests serve the cached
            version for 60 seconds.
          </p>
        </div>
      </div>

      <article className="product-detail-content">
        <div className="product-detail-section">
          <h2>{title}</h2>
          <p style={{ marginTop: "1rem", lineHeight: "1.8" }}>
            This is a dynamically generated news article with on-demand ISR.
            The content is cached for 60 seconds after the first request, then
            automatically revalidated.
          </p>
          <p style={{ marginTop: "1rem", lineHeight: "1.8" }}>
            The page provides a Suspense boundary, then unwraps params and
            delegates to a cached component with 'use cache'. The unwrapper
            component is minimal and only runs to resolve the Promise - the real
            caching happens in CachedStory.
          </p>
        </div>
      </article>

      <div className="demo-notes">
        <h3>How This Works:</h3>
        <ul>
          <li>
            The page shell renders immediately with a Suspense boundary
          </li>
          <li>
            NewsContent unwraps the params Promise (required in Next.js 15+)
          </li>
          <li>
            CachedStory uses <code>'use cache'</code> with{" "}
            <code>cacheLife('seconds')</code> for 60s cache
          </li>
          <li>
            First request to a slug has a 2s delay (simulated), cached requests
            are instant
          </li>
          <li>After 60s, the cache automatically revalidates on the next request</li>
          <li>
            The unwrapper is lightweight - it only resolves the Promise. All
            expensive operations happen in the cached component.
          </li>
        </ul>
      </div>
    </>
  );
}
