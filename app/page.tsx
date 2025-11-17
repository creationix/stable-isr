import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <main className="main-content">
        <Image
          className="logo"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="content-section">
          <h1>Next.js 16 ISR & Cache Demo</h1>
          <p>
            This demo showcases the latest Next.js 16 features including Cache
            Components, ISR, and Partial Prerendering (PPR).
          </p>
        </div>
        <div className="demo-links">
          <Link href="/products" className="demo-card">
            <h2>Products Catalog</h2>
            <p>
              Demonstrates 'use cache' directive with cacheLife() and
              cacheTag() for granular control.
            </p>
          </Link>
          <Link href="/admin" className="demo-card">
            <h2>Admin Dashboard</h2>
            <p>
              Test cache revalidation with revalidateTag(), updateTag(), and
              see PPR in action.
            </p>
          </Link>
        </div>
        <div className="features-list">
          <h3>Features Demonstrated:</h3>
          <ul>
            <li>'use cache' directive</li>
            <li>cacheLife() API</li>
            <li>cacheTag() for granular control</li>
            <li>revalidateTag() for eventual consistency</li>
            <li>React Server Components (RSC)</li>
            <li>Partial Prerendering (PPR)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
