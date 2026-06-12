import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../ui/Layout.jsx";
import axios from "axios";
import {
  FiAward,
  FiMail,
  FiUser,
  FiZap,
  FiTrendingUp,
  FiArrowRight,
  FiCalendar,
  FiActivity
} from "react-icons/fi";

// Deterministic random activity generator based on userid
const getContributionData = (userid, totalSolved) => {
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hashVal = getHash(userid || "guest");
  const data = [];
  const today = new Date();
  
  // Generate date array for the last 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    let count = 0;
    
    if (totalSolved > 0) {
      const dateHash = getHash(dateString + hashVal);
      const prob = dateHash % 100;
      if (prob < 48) {
        count = 0;
      } else if (prob < 78) {
        count = (dateHash % 2) + 1;
      } else if (prob < 94) {
        count = (dateHash % 2) + 3;
      } else {
        count = (dateHash % 3) + 5;
      }
    }
    
    data.push({
      date,
      dateString,
      count
    });
  }
  return data;
};

const calculateStreak = (contributions) => {
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < contributions.length; i++) {
    if (contributions[i].count > 0) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      currentStreak++;
    } else {
      if (i < contributions.length - 1) {
        break;
      }
    }
  }
  
  return { currentStreak, maxStreak };
};

const getCellColor = (count) => {
  if (count === 0) return 'var(--bg-hover)';
  if (count <= 2) return 'rgba(34, 211, 238, 0.25)';
  if (count <= 4) return 'rgba(34, 211, 238, 0.5)';
  if (count <= 6) return 'rgba(34, 211, 238, 0.75)';
  return 'var(--accent)';
};

// Local circular SVG gauge
function CircularProgress({ solved, total, size = 110, strokeWidth = 8 }) {
  const percentage = total > 0 ? Math.min((solved / total) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.35s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1 }}>
        <span style={{ fontSize: size * 0.18, fontWeight: 700, color: 'var(--text-primary)' }}>{solved}</span>
        <span style={{ fontSize: size * 0.11, color: 'var(--text-secondary)', marginTop: 2 }}>/ {total}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setError(null);
        const res = await axios.get(`http://localhost:3000/user/${userid}`);
        if (res.data && res.data.success) {
          setUser(res.data);
        } else {
          setError(res.data?.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch profile. User might not exist.");
      }
    }

    fetchUser();
  }, [userid]);

  if (error) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '20px' }}>
          <div className="auth-card" style={{ maxWidth: '480px' }}>
            <div className="auth-logo" style={{ color: 'var(--red)', borderColor: 'rgba(248, 81, 73, 0.2)', background: 'rgba(248, 81, 73, 0.1)' }}>
              <FiAward />
            </div>
            <h1 className="auth-title">Error Loading Profile</h1>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>{error}</p>
            <Link to="/" className="auth-button" style={{ textDecoration: 'none' }}>
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Loading user profile...</p>
        </div>
      </Layout>
    );
  }

  // Calculate total solved
  const totalSolved = user.progress?.reduce((acc, curr) => acc + (curr.questionsDone || 0), 0) || 0;
  const totalQuestions = user.progress?.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0) || 0;

  // Setup contributions and streaks
  const contributions = getContributionData(userid, totalSolved);
  const { currentStreak, maxStreak } = calculateStreak(contributions);

  // Determine user rank / badge title and badge style
  let userBadge = "Beginner Solver";
  let badgeStyle = { backgroundColor: '#475569' };
  if (totalSolved > 100) {
    userBadge = "Grandmaster";
    badgeStyle = { backgroundColor: 'rgba(248, 81, 73, 0.15)', color: 'var(--red)', border: '1px solid rgba(248, 81, 73, 0.3)' };
  } else if (totalSolved > 50) {
    userBadge = "Master";
    badgeStyle = { backgroundColor: 'rgba(210, 153, 34, 0.15)', color: 'var(--yellow)', border: '1px solid rgba(210, 153, 34, 0.3)' };
  } else if (totalSolved > 20) {
    userBadge = "Expert";
    badgeStyle = { backgroundColor: 'rgba(34, 211, 238, 0.15)', color: 'var(--accent)', border: '1px solid var(--accent-border)' };
  } else if (totalSolved > 5) {
    userBadge = "Specialist";
    badgeStyle = { backgroundColor: 'rgba(63, 185, 80, 0.15)', color: 'var(--green)', border: '1px solid rgba(63, 185, 80, 0.3)' };
  }

  // Heatmap Padding and Label configuration
  const firstDayDate = contributions[0].date;
  const padDays = firstDayDate.getDay(); 
  const gridItems = [
    ...Array(padDays).fill(null),
    ...contributions
  ];

  // Compute month labels
  const monthLabels = [];
  let lastMonth = -1;
  for (let i = 0; i < gridItems.length; i += 7) {
    let firstValidDay = null;
    for (let j = 0; j < 7; j++) {
      if (gridItems[i + j]) {
        firstValidDay = gridItems[i + j];
        break;
      }
    }
    if (firstValidDay) {
      const month = firstValidDay.date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          weekIndex: i / 7,
          label: firstValidDay.date.toLocaleDateString(undefined, { month: 'short' })
        });
        lastMonth = month;
      }
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Profile Card Header */}
        <div className="profile-card">
          <div className="profile-cover" />
          <div className="profile-body">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-circle">
                {user.data?.userid?.charAt(0).toUpperCase()}
              </div>

              <div className="profile-info">
                <div className="profile-name-row">
                  <span className="profile-username">{user.data?.userid}</span>
                  <span className="profile-badge" style={badgeStyle}>
                    <FiAward style={{ fontSize: '12px' }} />
                    {userBadge}
                  </span>
                </div>
                
                <div className="profile-meta-row">
                  <div className="profile-meta-item">
                    <FiMail />
                    <span>{user.data?.email}</span>
                  </div>
                  <div className="profile-meta-item">
                    <FiUser />
                    <span>Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          
          {/* Total Solved Card */}
          <div className="profile-stat-card">
            <span className="profile-stat-label">Total Problems Solved</span>
            <div style={{ margin: '8px 0 12px' }}>
              <CircularProgress solved={totalSolved} total={totalQuestions} />
            </div>
            <span className="profile-stat-subtitle">across all assigned sheets</span>
          </div>

          {/* Current Streak Card */}
          <div className="profile-stat-card">
            <span className="profile-stat-label">Solved Streak</span>
            <FiZap className="profile-stat-icon streak" />
            <span className="profile-stat-value">{currentStreak}</span>
            <span className="profile-stat-subtitle">consecutive active days</span>
            <span className="profile-stat-footer">Max Streak: {maxStreak} days</span>
          </div>

          {/* Assigned Sheets Card */}
          <div className="profile-stat-card">
            <span className="profile-stat-label">Assigned Sheets</span>
            <FiTrendingUp className="profile-stat-icon sheets" />
            <span className="profile-stat-value">{user.progress?.length || 0}</span>
            <span className="profile-stat-subtitle">active tracks in progress</span>
            <Link to="/sheets" className="profile-stat-link">
              <span>View All Sheets</span>
              <FiArrowRight />
            </Link>
          </div>

        </div>

        {/* Activity Calendar (Heatmap) */}
        <div className="heatmap-card">
          <div className="heatmap-header">
            <FiCalendar />
            <span className="heatmap-title">Activity Calendar</span>
          </div>

          <div className="heatmap-scroll-area">
            {/* Days Labels Column */}
            <div className="heatmap-y-labels">
              <span className="heatmap-y-label">Mon</span>
              <span className="heatmap-y-label">Wed</span>
              <span className="heatmap-y-label">Fri</span>
            </div>

            <div className="heatmap-grid-wrapper">
              {/* Months Row */}
              <div className="heatmap-months-row">
                {monthLabels.map((lbl, idx) => (
                  <span
                    key={idx}
                    className="heatmap-month-label"
                    style={{ left: `${lbl.weekIndex * 14}px` }}
                  >
                    {lbl.label}
                  </span>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="heatmap-cells-grid">
                {gridItems.map((day, idx) => {
                  if (!day) {
                    return <div key={`pad-${idx}`} className="heatmap-cell-pad" />;
                  }
                  
                  const color = getCellColor(day.count);
                  const dateFormatted = day.date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return (
                    <div
                      key={day.dateString}
                      className="heatmap-cell"
                      style={{ backgroundColor: color }}
                      title={`${day.count} submission${day.count !== 1 ? 's' : ''} on ${dateFormatted}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Deterministic submission history generated for {userid}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '4px' }}>Less</span>
              <div style={{ width: '10px', height: '10px', borderRadius: '1px', backgroundColor: getCellColor(0) }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '1px', backgroundColor: getCellColor(1) }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '1px', backgroundColor: getCellColor(3) }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '1px', backgroundColor: getCellColor(5) }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '1px', backgroundColor: getCellColor(7) }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>More</span>
            </div>
          </div>
        </div>

        {/* Learning Tracks Section */}
        <h2 className="tracks-header">Your Learning Tracks</h2>

        <div className="tracks-grid">
          {user.progress?.map((item, index) => {
            const sheetPercentage = item.totalQuestions > 0 ? Math.round((item.questionsDone / item.totalQuestions) * 100) : 0;
            let pillClass = "not-started";
            let pillLabel = "Not Started";
            
            if (sheetPercentage === 100) {
              pillClass = "completed";
              pillLabel = "Completed";
            } else if (sheetPercentage > 0) {
              pillClass = "progress";
              pillLabel = "In Progress";
            }

            return (
              <div className="track-card" key={index}>
                <div className="track-info">
                  <h3 className="track-name">{item.sheetName || "DSA Track"}</h3>
                  <div className="track-meta">
                    <span className={`track-pill ${pillClass}`}>{pillLabel}</span>
                    <span className="track-desc">{item.questionsDone} of {item.totalQuestions} Questions</span>
                  </div>
                  <Link to="/sheets" className="track-button">
                    <span>Practice Now</span>
                    <FiArrowRight style={{ fontSize: '13px' }} />
                  </Link>
                </div>

                <div className="track-gauge-wrapper">
                  <CircularProgress solved={item.questionsDone} total={item.totalQuestions} size={80} strokeWidth={6} />
                </div>
              </div>
            );
          })}

          {(!user.progress || user.progress.length === 0) && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>No DSA sheets assigned yet.</p>
              <Link to="/sheets" className="auth-button" style={{ display: 'inline-flex', width: 'auto', padding: '0 20px', textDecoration: 'none' }}>
                Browse Sheets
              </Link>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}