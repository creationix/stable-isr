const teamMembers = [
  { name: "Alice Johnson", role: "Team Lead", status: "online" },
  { name: "Bob Smith", role: "Developer", status: "away" },
  { name: "Charlie Brown", role: "Designer", status: "online" },
  { name: "Diana Prince", role: "Product Manager", status: "offline" },
];

export default function TeamSlot() {
  return (
    <div className="slot-container team-slot">
      <h2>Team Activity</h2>
      <p className="slot-description">
        This section is loaded independently using the @team parallel route
        slot.
      </p>
      <div className="team-list">
        {teamMembers.map((member) => (
          <div key={member.name} className="team-member">
            <div className="member-info">
              <h4>{member.name}</h4>
              <p className="member-role">{member.role}</p>
            </div>
            <span className={`status-badge ${member.status}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
      <div className="team-stats">
        <p>
          <strong>Active Now:</strong> {teamMembers.filter((m) => m.status === "online").length} /{" "}
          {teamMembers.length}
        </p>
      </div>
    </div>
  );
}
