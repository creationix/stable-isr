import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import {
  revalidateProducts,
  revalidateProductById,
  revalidateProductsPath,
  revalidateProductsHard,
  revalidateProductByIdHard,
  revalidateProductsPathHard,
  updateProductStock,
} from "@/app/actions/revalidate";
import { Suspense } from "react";

async function AdminContent() {
  const products = await getAllProducts();
  const productIds = products.map((p) => p.id);
  const currentTime = new Date().toISOString();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </div>

      <div className="dynamic-section">
        <p>
          <strong>Current Server Time:</strong> {currentTime}
        </p>
        <p className="cache-note">
          This page is NOT cached - it's fully dynamic and regenerates on every
          request. This demonstrates RSC (React Server Components) without
          caching.
        </p>
      </div>

      <div className="admin-actions">
        <div className="action-section">
          <h2>Cache Revalidation Methods</h2>
          <p style={{ marginBottom: "1rem" }}>
            Three different approaches to invalidate cached content:
          </p>
          <div className="revalidation-methods-grid">
            <div className="method-card">
              <h3>revalidateTag()</h3>
              <p className="method-description">
                Soft revalidation (SWR) - serves stale content while revalidating
                in background
              </p>
              <form action={revalidateProducts}>
                <button type="submit" className="pure-button admin-button soft">
                  <span className="button-label">Revalidate Products Tag</span>
                  <span className="button-desc">revalidateTag('products', 'max')</span>
                </button>
              </form>
            </div>

            <div className="method-card">
              <h3>updateTag()</h3>
              <p className="method-description">
                Hard revalidation - immediately expires cache, blocks until fresh
                data loads
              </p>
              <form action={revalidateProductsHard}>
                <button type="submit" className="pure-button admin-button hard">
                  <span className="button-label">Update Products Tag</span>
                  <span className="button-desc">updateTag('products')</span>
                </button>
              </form>
            </div>

            <div className="method-card">
              <h3>revalidatePath()</h3>
              <p className="method-description">
                Invalidates all routes under a path (including nested routes)
              </p>
              <div className="path-buttons">
                <form action={revalidateProductsPath}>
                  <button type="submit" className="pure-button admin-button-small soft">
                    Soft
                  </button>
                </form>
                <form action={revalidateProductsPathHard}>
                  <button type="submit" className="pure-button admin-button-small hard">
                    Hard
                  </button>
                </form>
              </div>
              <p className="button-desc" style={{ marginTop: "0.5rem", fontSize: "0.75rem", opacity: 0.8 }}>
                revalidatePath('/products', 'layout')
              </p>
            </div>
          </div>
        </div>

        <div className="action-section">
          <h2>Individual Product Revalidation</h2>
          <div className="product-revalidation-grid">
            {productIds.map((id) => (
              <div key={id} className="product-revalidation-row">
                <span className="product-id">Product {id}</span>
                <div className="product-actions">
                  <form action={revalidateProductById.bind(null, id)}>
                    <button type="submit" className="pure-button admin-button-medium soft">
                      <span className="button-label-small">Soft</span>
                      <span className="button-api">revalidateTag('product-{id}')</span>
                    </button>
                  </form>
                  <form action={revalidateProductByIdHard.bind(null, id)}>
                    <button type="submit" className="pure-button admin-button-medium hard">
                      <span className="button-label-small">Hard</span>
                      <span className="button-api">updateTag('product-{id}')</span>
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      const newStock = Math.floor(Math.random() * 50) + 1;
                      await updateProductStock(id, newStock);
                    }}
                  >
                    <button type="submit" className="pure-button admin-button-medium update">
                      <span className="button-label-small">Update Stock</span>
                      <span className="button-api">updateProductStock({id}, stock)</span>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <h3>Legend</h3>
          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-badge soft">Soft</span>
              <span className="legend-text">
                Stale-while-revalidate - shows cached content immediately while
                fetching fresh data in background
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-badge hard">Hard</span>
              <span className="legend-text">
                Blocking reload - waits for fresh data before showing content
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-badge update">Update</span>
              <span className="legend-text">
                Simulates data update + cache revalidation (random stock value)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-notes">
        <h3>How to Test</h3>
        <ol>
          <li>
            Visit the <Link href="/products">Products page</Link> and note the
            "Data Fetched" timestamp
          </li>
          <li>Refresh the products page - the timestamp stays the same (cached!)</li>
          <li>Come back here and click "Revalidate All Products"</li>
          <li>
            Go back to the products page and refresh - you'll see a new
            timestamp (cache was invalidated!)
          </li>
          <li>
            Try viewing a specific product at{" "}
            <Link href="/products/1">/products/1</Link>
          </li>
          <li>
            Use "Revalidate Product 1" to invalidate just that product's cache
          </li>
          <li>
            Notice how the product detail page uses PPR - the product data is
            cached but the "Current Server Time" updates on every request
          </li>
        </ol>

        <h3>Key Concepts</h3>
        <ul>
          <li>
            <strong>Server Actions:</strong> All revalidation actions use{" "}
            <code>"use server"</code> to execute on the server
          </li>
          <li>
            <strong>Tag-Based Revalidation:</strong> We use{" "}
            <code>cacheTag()</code> to tag cached content and{" "}
            <code>revalidateTag()</code> to invalidate specific caches
          </li>
          <li>
            <strong>Path-Based Revalidation:</strong>{" "}
            <code>revalidatePath(path, type)</code> invalidates cached content for a path.
            Use <code>type="page"</code> for a single page or <code>type="layout"</code> to
            revalidate all pages under that path (including nested routes).
          </li>
          <li>
            <strong>Soft Revalidation (revalidateTag):</strong>{" "}
            <code>revalidateTag(tag, "max")</code> uses stale-while-revalidate.
            The next request gets cached (stale) content immediately while fresh
            data is fetched in the background. Subsequent requests get the fresh data.
            <br />
            <em>Note: In local development with `vc dev`, this may behave like
            hard revalidation. Deploy to Vercel to see true SWR behavior.</em>
          </li>
          <li>
            <strong>Hard Revalidation (updateTag):</strong>{" "}
            <code>updateTag(tag)</code> immediately expires the cache.
            The next request will block and wait for fresh data to be fetched -
            no stale content is served. Can only be used in Server Actions.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="page-container"><div className="page-header"><h1>Loading Admin Dashboard...</h1></div></div>}>
      <AdminContent />
    </Suspense>
  );
}
