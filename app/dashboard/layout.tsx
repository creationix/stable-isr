import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: ReactNode;
  analytics: ReactNode;
  team: ReactNode;
}) {
  return (
    <div className="container">
      <main className="dashboard-layout">
        <div className="page-header">
          <h1>Parallel Routes Dashboard</h1>
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
        <p className="layout-description">
          This dashboard demonstrates Next.js parallel routes. Each section
          below (@analytics and @team) is loaded independently and can have
          its own loading states, error boundaries, and navigation.
        </p>

        <div className="dashboard-main">{children}</div>

        <div className="parallel-slots">
          <div className="slot-wrapper">{analytics}</div>
          <div className="slot-wrapper">{team}</div>
        </div>

        <div className="info-box">
          <h3>How Parallel Routes Work:</h3>
          <ul>
            <li>
              Folders starting with @ (like @analytics, @team) define named
              slots
            </li>
            <li>
              Each slot can have its own loading.tsx, error.tsx, and
              not-found.tsx
            </li>
            <li>Slots are passed as props to the parent layout component</li>
            <li>
              default.tsx files provide fallback content for soft navigation
            </li>
            <li>Enables independent error handling and loading states</li>
            <li>Perfect for dashboards with multiple independent sections</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
