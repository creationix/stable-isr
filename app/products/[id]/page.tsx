import { cacheLife, cacheTag } from "next/cache";
import { getProductById, getAllProducts } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";

// This demonstrates PPR - static product info with dynamic timestamp
async function ProductDetails({ id }: { id: string }) {
  "use cache";

  // Cache this specific product with its own tag
  cacheTag(`product-${id}`);
  cacheLife("max"); // Use "max" profile for stale-while-revalidate

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="product-detail-header">
        <h1>{product.name}</h1>
        <span className="product-category-badge">{product.category}</span>
      </div>

      <div className="cache-info">
        <div className="cache-badge">Cached RSC</div>
        <div className="cache-details">
          <p>
            <strong>Cache Tag:</strong> product-{id}
          </p>
          <p>
            <strong>Last Updated:</strong> {product.lastUpdated}
          </p>
        </div>
      </div>

      <div className="product-detail-content">
        <div className="product-detail-section">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        <div className="product-detail-section">
          <h2>Details</h2>
          <dl className="product-specs">
            <dt>Price:</dt>
            <dd className="price-large">${product.price.toFixed(2)}</dd>

            <dt>Stock:</dt>
            <dd className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
              {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
            </dd>

            <dt>Category:</dt>
            <dd>{product.category}</dd>

            <dt>Product ID:</dt>
            <dd>{product.id}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}

// Dynamic timestamp component (not cached - demonstrates PPR)
async function DynamicTimestamp() {
  // Access request-time data to ensure this is truly dynamic
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const currentTime = new Date().toISOString();

  return (
    <div className="dynamic-section">
      <h3>Dynamic Content (Not Cached)</h3>
      <p>
        <strong>Current Server Time:</strong> {currentTime}
      </p>
      <p>
        <strong>Your User Agent:</strong> {userAgent.substring(0, 50)}...
      </p>
      <p className="cache-note">
        This timestamp and user agent are generated on every request,
        demonstrating Partial Prerendering (PPR). The product details above are
        cached, but this section is always fresh.
      </p>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="page-container">
      <div className="page-header">
        <Link href="/products" className="back-link">
          ← Back to Products
        </Link>
      </div>

      <ProductDetails id={id} />

      <Suspense fallback={<div className="loading">Loading dynamic content...</div>}>
        <DynamicTimestamp />
      </Suspense>

      <div className="demo-notes">
        <h3>PPR in Action</h3>
        <ul>
          <li>
            <strong>Static (Cached):</strong> Product details are cached using{" "}
            <code>'use cache'</code> with the tag <code>product-{id}</code>
          </li>
          <li>
            <strong>Dynamic (Uncached):</strong> The timestamp section is
            wrapped in <code>Suspense</code> and regenerates on every request
          </li>
          <li>
            This demonstrates Partial Prerendering (PPR) - mixing static and
            dynamic content in the same page
          </li>
          <li>
            Refresh the page: product details stay cached (same timestamp), but
            server time updates
          </li>
          <li>
            Go to <Link href="/admin">Admin</Link> to invalidate just this
            product's cache
          </li>
        </ul>
      </div>
    </div>
  );
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}
