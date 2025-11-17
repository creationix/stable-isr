"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { getAllProducts } from "@/lib/data";
import Link from "next/link";

export default async function ProductsPage() {
  // Set cache life to 1 hour
  cacheLife("hours");

  // Tag this cached content for granular revalidation
  cacheTag("products");

  const products = await getAllProducts();
  const fetchTime = new Date().toISOString();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products Catalog</h1>
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </div>

      <div className="cache-info">
        <div className="cache-badge">Cached with 'use cache'</div>
        <div className="cache-details">
          <p>
            <strong>Cache Life:</strong> hours (stale: 3600s, revalidate: 900s)
          </p>
          <p>
            <strong>Cache Tag:</strong> products
          </p>
          <p>
            <strong>Data Fetched:</strong> {fetchTime}
          </p>
          <p className="cache-note">
            This page is cached using Next.js 16's Cache Components. The cache
            will automatically revalidate after 15 minutes in the background.
          </p>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="product-card"
          >
            <h2>{product.name}</h2>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-footer">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <span className="product-stock">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="demo-notes">
        <h3>What's Happening Here?</h3>
        <ul>
          <li>
            The <code>'use cache'</code> directive at the top makes this entire
            page cached as a React Server Component
          </li>
          <li>
            <code>cacheLife('hours')</code> sets the cache duration to 1 hour
            with background revalidation after 15 minutes
          </li>
          <li>
            <code>cacheTag('products')</code> allows us to invalidate this cache
            on-demand from the admin panel
          </li>
          <li>
            The fetch timestamp shows when the data was last retrieved - refresh
            the page to see it stays the same (cached!)
          </li>
          <li>
            Go to the <Link href="/admin">Admin Dashboard</Link> to trigger cache
            revalidation
          </li>
        </ul>
      </div>
    </div>
  );
}
