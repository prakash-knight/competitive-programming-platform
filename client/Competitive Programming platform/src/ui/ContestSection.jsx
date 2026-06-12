import { useState, useEffect } from "react";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
} from "react-icons/si";
import { FiExternalLink, FiCalendar } from "react-icons/fi";

/* ── Helpers ───────────────────────────────────────── */

function getPlatformKey(platform) {
  const p = (platform || "").toLowerCase();
  if (p.includes("codeforces")) return "codeforces";
  if (p.includes("leetcode"))   return "leetcode";
  if (p.includes("codechef"))   return "codechef";
  if (p.includes("atcoder"))    return "atcoder";
  return "other";
}

function getPlatformIcon(key) {
  switch (key) {
    case "codeforces":
      return <SiCodeforces style={{ color: "#1565c0" }} />;
    case "leetcode":
      return <SiLeetcode style={{ color: "#f59e0b" }} />;
    case "codechef":
      return <SiCodechef style={{ color: "#F6A000" }} />;
    case "atcoder":
      return (
        <span style={{ color: "#e53935", fontWeight: 800, fontSize: 13, lineHeight: 1 }}>
          AC
        </span>
      );
    default:
      return <FiCalendar />;
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCountdown(startTime) {
  const diff = startTime - Date.now();
  if (diff <= 0) return { text: "Started", days: 0, hours: 0, mins: 0 };

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins  = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return { text: `${days}d ${hours}h`, days, hours, mins };
  }
  return { text: `${hours}h ${mins}m`, days, hours, mins };
}

/* ── Filter chips config ───────────────────────────── */
const FILTERS = ["All", "Codeforces", "LeetCode", "CodeChef", "AtCoder"];

/* ── Component ─────────────────────────────────────── */

export default function ContestSection({ contests }) {
  const [filter, setFilter] = useState("All");
  const [now, setNow] = useState(Date.now());

  // Tick every 60s for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter contests
  const filtered = contests.filter((c) => {
    if (filter === "All") return true;
    return getPlatformKey(c.platform) === filter.toLowerCase();
  });

  return (
    <section>
      {/* Header + Filters */}
      <div className="section-header">
        <h2 className="section-title">Upcoming Contests</h2>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Contest Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <FiCalendar />
          <p>No upcoming contests for this platform.</p>
        </div>
      ) : (
        <div className="contests-grid">
          {filtered.map((contest, index) => {
            const platformKey = getPlatformKey(contest.platform);
            const countdown   = getCountdown(contest.startTime);

            return (
              <div
                key={index}
                className={`contest-card platform-${platformKey}`}
              >
                {/* Top row: platform + badge */}
                <div className="contest-card-top">
                  <div className="contest-platform">
                    <span className="contest-platform-icon">
                      {getPlatformIcon(platformKey)}
                    </span>
                    {contest.platform}
                  </div>
                  <span className="contest-badge rated">Rated</span>
                </div>

                {/* Contest name */}
                <div className="contest-name">{contest.name}</div>

                {/* Meta row */}
                <div className="contest-meta">
                  <div className="contest-meta-item">
                    <span className="contest-meta-label">Starts</span>
                    <span className="contest-meta-value">
                      {formatDate(contest.startTime)}
                    </span>
                  </div>

                  <div className="contest-meta-item">
                    <span className="contest-meta-label">Countdown</span>
                    <span className="contest-countdown">
                      {countdown.text}
                    </span>
                  </div>

                  <div className="contest-meta-item">
                    <span className="contest-meta-label">Duration</span>
                    <span className="contest-meta-value">
                      {contest.duration} min
                    </span>
                  </div>
                </div>

                {/* Link */}
                <a
                  href={contest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contest-link"
                >
                  Open Contest <FiExternalLink />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
