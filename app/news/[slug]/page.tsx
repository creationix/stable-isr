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
        <CachedStory slug={params.then((p) => p.slug)} />
      </Suspense>
    </div>
  );
}

// The cached component with 'use cache' for ISR behavior
async function CachedStory({ slug }: { slug: Promise<string> }) {
  "use cache";
  cacheLife("hours");

  // Await the slug promise
  const resolvedSlug = await slug;

  // Simulate heavy DB work
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const title = resolvedSlug
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
            The page provides a Suspense boundary and passes the params promise
            directly to the cached component. This eliminates any intermediate
            compute layer - the promise is resolved inside the cached component,
            so everything is cached together.
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
            The params Promise is passed directly to CachedStory using{" "}
            <code>params.then(p =&gt; p.slug)</code>
          </li>
          <li>
            CachedStory awaits the slug promise and uses <code>'use cache'</code>{" "}
            with <code>cacheLife('seconds')</code> for 60s cache
          </li>
          <li>
            First request to a slug has a 2s delay (simulated), cached requests
            are instant
          </li>
          <li>After 60s, the cache automatically revalidates on the next request</li>
          <li>
            No intermediate compute layer - promise unwrapping happens inside the
            cached component
          </li>
        </ul>
      </div>
    </>
  );
}
