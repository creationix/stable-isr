export default function AnalyticsSlot() {
  return (
    <div className="slot-container analytics-slot">
      <h2>Analytics</h2>
      <p className="slot-description">
        This section is loaded independently using the @analytics parallel route
        slot.
      </p>
      <div className="analytics-grid">
        <div className="metric-box">
          <h4>Page Views</h4>
          <p className="metric-value">8,547</p>
          <span className="metric-change positive">+12.5%</span>
        </div>
        <div className="metric-box">
          <h4>Bounce Rate</h4>
          <p className="metric-value">32.4%</p>
          <span className="metric-change negative">-2.3%</span>
        </div>
        <div className="metric-box">
          <h4>Avg. Duration</h4>
          <p className="metric-value">4.13m</p>
          <span className="metric-change positive">+8.1%</span>
        </div>
      </div>
    </div>
  );
}
