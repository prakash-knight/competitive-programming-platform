import {
  FiCalendar,
  FiCheckCircle,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

export default function StatCards({ contestCount, solvedCount }) {
  const stats = [
    {
      label: "Upcoming Contests",
      value: contestCount,
      icon: <FiCalendar />,
      bar: "cyan",
    },
    {
      label: "Solved Problems",
      value: solvedCount,
      icon: <FiCheckCircle />,
      bar: "green",
    },
    {
      label: "Current Rating",
      value: "—",
      icon: <FiBarChart2 />,
      bar: "yellow",
    },
    {
      label: "Active Streak",
      value: "—",
      icon: <FiZap />,
      bar: "orange",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-card-header">
            <span className="stat-card-label">{stat.label}</span>
            <span className="stat-card-icon">{stat.icon}</span>
          </div>
          <div className="stat-card-value">{stat.value}</div>
          <div className={`stat-card-bar ${stat.bar}`} />
        </div>
      ))}
    </div>
  );
}
