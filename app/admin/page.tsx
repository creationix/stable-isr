import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import {
  revalidateProducts,
  revalidateProductById,
  revalidateProductsPath,
  updateProductStock,
} from "@/app/actions/revalidate";

// Admin actions component (Client Component for interactivity)
function AdminActions({ productIds }: { productIds: string[] }) {
  return (
    <div className="admin-actions">
      <div className="action-section">
        <h2>Cache Revalidation</h2>
        <p>
          These actions demonstrate on-demand cache revalidation using Next.js
          16's new APIs.
        </p>

        <form
          action={async () => {
            "use server";
            const result = await revalidateProducts();
            return result;
          }}
        >
          <button type="submit" className="pure-button pure-button-primary">
            Revalidate All Products (revalidateTag)
          </button>
          <p className="action-note">
            Uses <code>revalidateTag('products')</code> to invalidate the
            products listing cache
          </p>
        </form>

        <form
          action={async () => {
            "use server";
            const result = await revalidateProductsPath();
            return result;
          }}
        >
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
        <h2>Product-Specific Revalidation</h2>
        <p>Invalidate cache for individual products by their tag.</p>

        {productIds.map((id) => (
          <form
            key={id}
            action={async () => {
              "use server";
              const result = await revalidateProductById(id);
              return result;
            }}
          >
            <button type="submit" className="pure-button">
              Revalidate Product {id}
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
            action={async () => {
              "use server";
              const newStock = Math.floor(Math.random() * 50) + 1;
              const result = await updateProductStock(id, newStock);
              return result;
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
  );
}

export default async function AdminPage() {
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

      <AdminActions productIds={productIds} />

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
            <strong>Eventual Consistency:</strong>{" "}
            <code>revalidateTag()</code> uses stale-while-revalidate, so changes
            may take a moment to appear
          </li>
        </ul>
      </div>
    </div>
  );
}
