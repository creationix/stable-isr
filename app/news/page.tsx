import Link from "next/link";

const newsArticles = [
  {
    slug: "nextjs-16-released",
    title: "Next.js 16 Released",
    description:
      "Explore the latest features in Next.js 16 including improved caching and ISR.",
    date: "2024-11-20",
  },
  {
    slug: "understanding-cache-components",
    title: "Understanding Cache Components",
    description:
      "Deep dive into Next.js 16's Cache Components and how they improve performance.",
    date: "2024-11-18",
  },
  {
    slug: "partial-prerendering-guide",
    title: "Partial Prerendering Guide",
    description:
      "Learn how to use PPR to optimize your Next.js applications for better UX.",
    date: "2024-11-15",
  },
  {
    slug: "isr-best-practices",
    title: "ISR Best Practices",
    description:
      "Best practices for implementing Incremental Static Regeneration in production.",
    date: "2024-11-12",
  },
];

export default function NewsIndexPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>News & Articles</h1>
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </div>

      <div className="cache-info">
        <div className="cache-badge">On-Demand ISR</div>
        <div className="cache-details">
          <p>
            <strong>Feature:</strong> Dynamic route caching with 'use cache'
          </p>
          <p className="cache-note">
            Click any article below to see on-demand ISR in action. Each article
            is cached for 60 seconds after the first request.
          </p>
        </div>
      </div>

      <div className="products-grid">
        {newsArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="product-card"
          >
            <h2>{article.title}</h2>
            <p className="product-category">{article.date}</p>
            <p className="product-description">{article.description}</p>
          </Link>
        ))}
      </div>

      <div className="demo-notes">
        <h3>On-Demand ISR with Dynamic Routes</h3>
        <ul>
          <li>
            Each article uses 'use cache' with cacheLife('seconds') for 60s cache
          </li>
          <li>
            Articles are generated on-demand with a simulated 2s delay on first
            request
          </li>
          <li>
            Subsequent requests within 60s serve the cached version instantly
          </li>
          <li>
            After 60s, the cache automatically revalidates on the next request
          </li>
          <li>
            Params Promise is passed directly to cached component - no
            intermediate compute layer
          </li>
          <li>
            Try visiting an article, then refresh - notice it loads instantly
            from cache
          </li>
        </ul>
      </div>
    </div>
  );
}
