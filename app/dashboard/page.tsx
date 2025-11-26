export default function DashboardPage() {
  return (
    <div className="dashboard-content">
      <h1>Dashboard Overview</h1>
      <p>
        This is the main dashboard page. The sections below are loaded using
        Next.js parallel routes, allowing them to be rendered independently.
      </p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p className="stat-number">567</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">$12,345</p>
        </div>
      </div>
    </div>
  );
}
