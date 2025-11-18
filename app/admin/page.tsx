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
          <h2>Cache Revalidation (Soft/SWR)</h2>
          <p>
            These actions use stale-while-revalidate. The browser will show
            cached content immediately while revalidating in the background.
          </p>

          <form action={revalidateProducts}>
            <button type="submit" className="pure-button pure-button-primary">
              Revalidate All Products (revalidateTag "max")
            </button>
            <p className="action-note">
              Uses <code>revalidateTag('products', 'max')</code> - shows stale
              content while revalidating
            </p>
          </form>

          <form action={revalidateProductsPath}>
            <button type="submit" className="pure-button">
              Revalidate Products Path
            </button>
            <p className="action-note">
              Uses <code>revalidatePath('/products')</code> to invalidate the
              entire route
            </p>
          </form>
        </div>

        <div className="action-section">
          <h2>Cache Revalidation (Hard/Blocking)</h2>
          <p>
            These actions force a blocking reload. The browser will wait for
            fresh data instead of showing stale content.
          </p>

          <form action={revalidateProductsHard}>
            <button type="submit" className="pure-button pure-button-primary">
              Hard Revalidate All Products (updateTag)
            </button>
            <p className="action-note">
              Uses <code>updateTag('products')</code> - immediately expires cache,
              forcing blocking reload on next request
            </p>
          </form>

          <form action={revalidateProductsPathHard}>
            <button type="submit" className="pure-button">
              Hard Revalidate Products Path
            </button>
            <p className="action-note">
              Uses <code>revalidatePath('/products')</code> - immediately expires
              path cache, blocking until fresh data loads
            </p>
          </form>
        </div>

        <div className="action-section">
          <h2>Product-Specific Revalidation (Soft/SWR)</h2>
          <p>Invalidate cache for individual products using stale-while-revalidate.</p>

          {productIds.map((id) => (
            <form
              key={id}
              action={revalidateProductById.bind(null, id)}
            >
              <button type="submit" className="pure-button">
                Revalidate Product {id} (max)
              </button>
            </form>
          ))}
        </div>

        <div className="action-section">
          <h2>Product-Specific Revalidation (Hard/Blocking)</h2>
          <p>Force blocking reload for individual products.</p>

          {productIds.map((id) => (
            <form
              key={id}
              action={revalidateProductByIdHard.bind(null, id)}
            >
              <button type="submit" className="pure-button">
                Hard Revalidate Product {id}
              </button>
            </form>
          ))}
        </div>

        <div className="action-section">
          <h2>Update & Revalidate</h2>
          <p>
            Simulate a data update followed by cache revalidation. This
            demonstrates a common real-world pattern.
          </p>

          {productIds.slice(0, 3).map((id) => (
            <form
              key={id}
              action={async (formData: FormData) => {
                "use server";
                const newStock = Math.floor(Math.random() * 50) + 1;
                await updateProductStock(id, newStock);
              }}
            >
              <button type="submit" className="pure-button pure-button-primary">
                Update Stock for Product {id}
              </button>
              <p className="action-note">
                Updates product data and revalidates using{" "}
                <code>revalidateTag()</code>
              </p>
            </form>
          ))}
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
            <code>revalidatePath()</code> invalidates all cached content for a
            route
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
