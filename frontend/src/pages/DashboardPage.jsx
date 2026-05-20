// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { FaRunning, FaTrophy, FaGift, FaChartLine } from 'react-icons/fa';

// const DashboardPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [stats, setStats] = useState({
//     points: 0,
//     completedChallenges: 0,
//     activeChallenges: 0,
//     redeemedRewards: 0
//   });
//   const [activeChallenges, setActiveChallenges] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate fetching data
//     setTimeout(() => {
//       setStats({
//         points: 1250,
//         completedChallenges: 8,
//         activeChallenges: 3,
//         redeemedRewards: 5
//       });

//       setActiveChallenges([
//         {
//           id: '1',
//           title: '10K Steps Daily',
//           description: 'Complete 10,000 steps every day for a week',
//           progress: 71,
//           endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//           pointsReward: 500,
//           category: 'Walking'
//         },
//         {
//           id: '2',
//           title: 'Morning Yoga',
//           description: 'Complete a 15-minute yoga session every morning for 10 days',
//           progress: 40,
//           endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
//           pointsReward: 300,
//           category: 'Yoga'
//         },
//         {
//           id: '3',
//           title: 'Hydration Hero',
//           description: 'Drink 8 glasses of water daily for 2 weeks',
//           progress: 85,
//           endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//           pointsReward: 400,
//           category: 'Wellness'
//         }
//       ]);

//       setRecentActivity([
//         {
//           id: '1',
//           type: 'challenge_progress',
//           title: 'Made progress on 10K Steps Daily',
//           date: new Date(Date.now() - 2 * 60 * 60 * 1000),
//           details: 'Completed 8,500 steps'
//         },
//         {
//           id: '2',
//           type: 'challenge_completed',
//           title: 'Completed Weekend Warrior Challenge',
//           date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//           details: 'Earned 350 points'
//         },
//         {
//           id: '3',
//           type: 'reward_redeemed',
//           title: 'Redeemed $10 Gift Card',
//           date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//           details: 'Used 1000 points'
//         }
//       ]);

//       setLoading(false);
//     }, 1000);
//   }, []);

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     let interval = seconds / 31536000;

//     if (interval > 1) return Math.floor(interval) + ' years ago';
//     interval = seconds / 2592000;
//     if (interval > 1) return Math.floor(interval) + ' months ago';
//     interval = seconds / 86400;
//     if (interval > 1) return Math.floor(interval) + ' days ago';
//     interval = seconds / 3600;
//     if (interval > 1) return Math.floor(interval) + ' hours ago';
//     interval = seconds / 60;
//     if (interval > 1) return Math.floor(interval) + ' minutes ago';
//     return Math.floor(seconds) + ' seconds ago';
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.displayName || 'User'}!</h1>
//         <p className="text-gray-600 mt-1">Here's an overview of your fitness journey</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6 flex items-center">
//           <div className="rounded-full bg-primary-100 p-3 mr-4">
//             <FaChartLine className="h-6 w-6 text-primary-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Total Points</p>
//             <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 flex items-center">
//           <div className="rounded-full bg-secondary-100 p-3 mr-4">
//             <FaTrophy className="h-6 w-6 text-secondary-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Completed Challenges</p>
//             <p className="text-2xl font-bold text-gray-900">{stats.completedChallenges}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 flex items-center">
//           <div className="rounded-full bg-success-100 p-3 mr-4">
//             <FaRunning className="h-6 w-6 text-success-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Active Challenges</p>
//             <p className="text-2xl font-bold text-gray-900">{stats.activeChallenges}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 flex items-center">
//           <div className="rounded-full bg-warning-100 p-3 mr-4">
//             <FaGift className="h-6 w-6 text-warning-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Redeemed Rewards</p>
//             <p className="text-2xl font-bold text-gray-900">{stats.redeemedRewards}</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Active Challenges */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800">Active Challenges</h2>
//               <Link to="/app/challenges" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
//                 View All
//               </Link>
//             </div>
//             <div className="p-6">
//               {activeChallenges.length > 0 ? (
//                 <div className="space-y-6">
//                   {activeChallenges.map((challenge) => (
//                     <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h3 className="text-lg font-medium text-gray-900">{challenge.title}</h3>
//                           <p className="text-sm text-gray-600">{challenge.description}</p>
//                         </div>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
//                           {challenge.category}
//                         </span>
//                       </div>
//                       <div className="mt-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-1">
//                           <span>Progress</span>
//                           <span>{challenge.progress}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className="bg-primary-600 h-2.5 rounded-full" 
//                             style={{ width: `${challenge.progress}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                       <div className="mt-4 flex justify-between items-center text-sm">
//                         <span className="text-gray-600">Ends on {formatDate(challenge.endDate)}</span>
//                         <span className="font-medium text-primary-600">{challenge.pointsReward} points</span>
//                       </div>
//                       <div className="mt-4">
//                         <Link 
//                           to={`/app/challenges/${challenge.id}`}
//                           className="text-sm font-medium text-primary-600 hover:text-primary-800"
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">You don't have any active challenges.</p>
//                   <Link 
//                     to="/app/challenges"
//                     className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                   >
//                     Browse Challenges
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div>
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
//             </div>
//             <div className="p-6">
//               {recentActivity.length > 0 ? (
//                 <div className="flow-root">
//                   <ul className="-mb-8">
//                     {recentActivity.map((activity, index) => (
//                       <li key={activity.id}>
//                         <div className="relative pb-8">
//                           {index !== recentActivity.length - 1 && (
//                             <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
//                           )}
//                           <div className="relative flex space-x-3">
//                             <div>
//                               <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
//                                 activity.type === 'challenge_progress' ? 'bg-primary-500' :
//                                 activity.type === 'challenge_completed' ? 'bg-success-500' :
//                                 'bg-warning-500'
//                               }`}>
//                                 {activity.type === 'challenge_progress' && <FaRunning className="h-4 w-4 text-white" />}
//                                 {activity.type === 'challenge_completed' && <FaTrophy className="h-4 w-4 text-white" />}
//                                 {activity.type === 'reward_redeemed' && <FaGift className="h-4 w-4 text-white" />}
//                               </span>
//                             </div>
//                             <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                               <div>
//                                 <p className="text-sm text-gray-900">{activity.title}</p>
//                                 <p className="text-sm text-gray-500">{activity.details}</p>
//                               </div>
//                               <div className="text-right text-sm whitespace-nowrap text-gray-500">
//                                 <time dateTime={activity.date.toISOString()}>{getTimeAgo(activity.date)}</time>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No recent activity to display.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Quick Links</h2>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <Link 
//                   to="/app/challenges"
//                   className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                 >
//                   <FaRunning className="h-6 w-6 text-primary-600 mx-auto mb-2" />
//                   <span className="text-sm font-medium text-gray-900">Challenges</span>
//                 </Link>
//                 <Link 
//                   to="/app/rewards"
//                   className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                 >
//                   <FaGift className="h-6 w-6 text-warning-600 mx-auto mb-2" />
//                   <span className="text-sm font-medium text-gray-900">Rewards</span>
//                 </Link>
//                 <Link 
//                   to="/app/leaderboard"
//                   className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                 >
//                   <FaTrophy className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
//                   <span className="text-sm font-medium text-gray-900">Leaderboard</span>
//                 </Link>
//                 <Link 
//                   to="/app/profile"
//                   className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                 >
//                   <FaChartLine className="h-6 w-6 text-success-600 mx-auto mb-2" />
//                   <span className="text-sm font-medium text-gray-900">My Progress</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;









import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaRunning, FaTrophy, FaGift, FaChartLine } from "react-icons/fa";
import { FiBell, FiPlus, FiHome, FiUser, FiBarChart2, FiArrowRight } from "react-icons/fi";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bgBase:     "#0c0c0c",
  bgSurface:  "#161616",
  bgElevated: "#1a1a1a",
  border:     "0.5px solid #2a2a2a",
  borderAccent: "0.5px solid rgba(232,98,42,0.35)",
  accent:     "#e8622a",
  accentDim:  "rgba(232,98,42,0.15)",
  accentGlow: "rgba(232,98,42,0.3)",
  textPrimary:   "#ffffff",
  textSecondary: "#888888",
  textMuted:     "#555555",
  success:    "#3b6d11",
  successBg:  "rgba(59,109,17,0.15)",
  radius:     { sm: 8, md: 10, lg: 12, xl: 16 },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: T.bgBase,
    color: T.textPrimary,
    fontFamily: "inherit",
    paddingBottom: 80,
  },
  inner: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "20px 16px 0",
  },

  // Topbar
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  logo: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: T.textPrimary },
  logoAccent: { color: T.accent },
  topbarRight: { display: "flex", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 32, height: 32,
    background: T.bgElevated,
    border: T.border,
    borderRadius: T.radius.sm,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: T.textMuted, fontSize: 16,
    position: "relative",
  },
  notifDot: {
    position: "absolute", top: 7, right: 7,
    width: 6, height: 6, borderRadius: "50%",
    background: T.accent,
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: T.accent,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 600, color: "#fff", flexShrink: 0,
    cursor: "pointer",
  },

  // Greeting
  greetingSub: { fontSize: 12, color: T.textMuted, marginBottom: 2 },
  greetingName: { fontSize: 20, fontWeight: 600, color: T.textPrimary, marginBottom: 20 },

  // Stat cards
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    background: T.bgSurface,
    border: T.border,
    borderRadius: T.radius.md,
    padding: "11px 13px",
  },
  statCardAccent: {
    background: T.bgSurface,
    border: T.borderAccent,
    borderRadius: T.radius.md,
    padding: "11px 13px",
  },
  statLabel: { fontSize: 11, color: T.textMuted, marginBottom: 3 },
  statVal: { fontSize: 21, fontWeight: 600, color: T.textPrimary },
  statValAccent: { fontSize: 21, fontWeight: 600, color: T.accent },
  statDelta: { fontSize: 11, color: T.success, marginTop: 2 },
  statDeltaNeutral: { fontSize: 11, color: T.textMuted, marginTop: 2 },

  // Section header
  sectionHd: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionLbl: {
    fontSize: 11, fontWeight: 500, color: T.textMuted,
    letterSpacing: "0.05em", textTransform: "uppercase",
  },
  seeAll: {
    fontSize: 11, color: T.accent, cursor: "pointer",
    background: "none", border: "none", padding: 0,
    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
  },

  // Challenge card
  challengeCard: {
    background: T.bgSurface,
    border: T.border,
    borderRadius: T.radius.lg,
    padding: 14,
    marginBottom: 10,
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
    transition: "border-color 0.2s",
  },
  challengeCardTop: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 8,
  },
  challengeTitle: { fontSize: 13, fontWeight: 500, color: T.textPrimary },
  badge: (variant) => ({
    fontSize: 10, fontWeight: 600,
    padding: "3px 8px", borderRadius: 20,
    ...(variant === "active"
      ? { background: T.accentDim, color: T.accent, border: `0.5px solid ${T.accentGlow}` }
      : { background: T.bgElevated, color: T.textMuted, border: T.border }),
  }),
  challengeMeta: { fontSize: 11, color: T.textMuted, marginBottom: 8 },
  progressBg: { background: "#222", borderRadius: 4, height: 4 },
  progressFill: (pct) => ({
    width: `${pct}%`, height: 4, borderRadius: 4,
    background: T.accent, transition: "width 0.4s ease",
  }),

  // Two-column
  twoCol: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 10, marginBottom: 14,
  },
  miniCard: {
    background: T.bgSurface,
    border: T.border,
    borderRadius: T.radius.lg,
    padding: 13,
  },

  // Leaderboard rows
  lbRow: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "7px 0",
    borderBottom: `0.5px solid #1e1e1e`,
  },
  lbRowLast: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "7px 0",
  },
  lbRank: (isMe) => ({
    fontSize: 12, fontWeight: 600,
    width: 18, color: isMe ? T.accent : T.textMuted,
  }),
  lbAvatar: (isMe) => ({
    width: 24, height: 24, borderRadius: "50%",
    background: isMe ? T.accentDim : "#222",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 600,
    color: isMe ? T.accent : T.textMuted,
    flexShrink: 0,
  }),
  lbName: (isMe) => ({
    flex: 1, fontSize: 12,
    color: isMe ? T.textPrimary : "#bbb",
    fontWeight: isMe ? 500 : 400,
  }),
  lbPts: (isMe) => ({
    fontSize: 12, fontWeight: 600,
    color: isMe ? T.accent : T.textPrimary,
  }),

  // Bar chart
  chartBars: {
    display: "flex", alignItems: "flex-end",
    gap: 5, height: 72, paddingTop: 4,
  },
  barCol: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", gap: 4,
  },
  barDay: { fontSize: 10, color: "#444" },

  // Streak dots
  streakDotRow: {
    display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap",
  },
  dot: (done, today) => ({
    width: 10, height: 10, borderRadius: "50%",
    background: done ? T.accent : "#222",
    outline: today ? `2px solid ${T.accentGlow}` : "none",
    outlineOffset: today ? 1 : 0,
  }),

  // Recent activity
  activityRow: {
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "10px 0",
    borderBottom: `0.5px solid #1e1e1e`,
  },
  activityRowLast: {
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "10px 0",
  },
  activityDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: T.accent, marginTop: 4, flexShrink: 0,
  },
  activityText: { fontSize: 12, color: "#bbb", lineHeight: 1.5 },
  activityTime: { fontSize: 11, color: T.textMuted, marginTop: 2 },

  // Bottom nav
  navBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: T.bgBase,
    borderTop: T.border,
    display: "flex", justifyContent: "space-around",
    padding: "10px 0 14px",
    zIndex: 100,
  },
  navItem: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 3,
    cursor: "pointer", textDecoration: "none",
  },
  navIcon: (active) => ({ fontSize: 18, color: active ? T.accent : "#444" }),
  navLbl: (active) => ({ fontSize: 10, color: active ? T.accent : "#444" }),

  // Skeleton
  skeleton: {
    background: "#1a1a1a",
    borderRadius: T.radius.md,
    animation: "pulse 1.5s ease-in-out infinite",
  },

  // Error
  errorWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "60vh", flexDirection: "column", gap: 12,
  },
  errorText: { fontSize: 14, color: "#E24B4A" },
  retryBtn: {
    background: T.bgElevated, border: T.border,
    borderRadius: T.radius.md, padding: "8px 16px",
    fontSize: 13, color: T.textSecondary,
    cursor: "pointer", fontFamily: "inherit",
  },
};

// ─── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ height = 44 }) => (
  <div style={{ ...S.skeleton, height }} />
);

// ─── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, delta, deltaNeutral, accent }) => (
  <div style={accent ? S.statCardAccent : S.statCard}>
    <div style={S.statLabel}>{label}</div>
    <div style={accent ? S.statValAccent : S.statVal}>{value ?? 0}</div>
    {delta && <div style={S.statDelta}>{delta}</div>}
    {deltaNeutral && <div style={S.statDeltaNeutral}>{deltaNeutral}</div>}
  </div>
);

// ─── Challenge card ─────────────────────────────────────────────────────────────
const ChallengeCard = ({ challenge }) => {
  const pct = challenge.totalDays
    ? Math.round((challenge.currentDay / challenge.totalDays) * 100)
    : 0;
  const isUpcoming = challenge.status === "upcoming";

  return (
    <Link to={`/app/challenges/${challenge._id}`} style={S.challengeCard}>
      <div style={S.challengeCardTop}>
        <span style={S.challengeTitle}>{challenge.title}</span>
        <span style={S.badge(isUpcoming ? "upcoming" : "active")}>
          {isUpcoming
            ? `Starts in ${challenge.startsIn} days`
            : "Active"}
        </span>
      </div>
      <div style={S.challengeMeta}>
        {isUpcoming
          ? `Enrolled · 0 pts earned`
          : `Day ${challenge.currentDay} of ${challenge.totalDays} · ${challenge.pointsEarned ?? 0} pts earned`}
      </div>
      <div style={S.progressBg}>
        <div style={S.progressFill(isUpcoming ? 0 : pct)} />
      </div>
    </Link>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([60, 80, 45, 100, 70, 90, 55]);
  const [streakDays, setStreakDays] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:5000/api";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [challengesRes, activeChallengesRes] = await Promise.all([
        axios.get(`${baseURL}/challenges`, { headers }),
        axios.get(`${baseURL}/users/challenges/active`, { headers }),
      ]);

      // Transform challenges data
      const allChallenges = challengesRes.data || [];
      const activeChallenges = activeChallengesRes.data?.challenges || [];

      setActiveChallenges(activeChallenges.slice(0, 5));

      // Calculate stats from active challenges
      const stats = {
        points: activeChallenges.reduce((sum, c) => sum + (c.pointsEarned ?? 0), 0),
        rank: Math.floor(Math.random() * 100) + 1, // Placeholder
        totalUsers: 1000, // Placeholder
        streak: 12, // Placeholder
      };
      setStats(stats);

      // Mock recent activity - in production, you'd fetch this from an /activities endpoint
      setRecentActivity([
        {
          _id: '1',
          description: 'Started a new challenge',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          _id: '2',
          description: 'Logged progress on current challenge',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ]);

      // Leaderboard — optional endpoint, fail gracefully
      try {
        const lbRes = await axios.get(`${baseURL}/leaderboard`, { headers });
        setLeaderboard(lbRes.data?.slice(0, 4) ?? []);
      } catch {
        setLeaderboard([]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={S.page}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div style={S.inner}>
          <div style={{ ...S.topbar, marginBottom: 22 }}>
            <span style={S.logo}>Fit<span style={S.logoAccent}>Nova</span></span>
          </div>
          <div style={{ height: 14, background: "#1a1a1a", borderRadius: 6, width: "40%", marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 22, background: "#1a1a1a", borderRadius: 6, width: "60%", marginBottom: 24, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ ...S.statsRow }}>
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} height={68} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} height={78} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ ...S.page, ...S.errorWrap }}>
        <p style={S.errorText}>{error}</p>
        <button style={S.retryBtn} onClick={fetchDashboardData}>Try again</button>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={S.inner}>

        {/* Topbar */}
        <div style={S.topbar}>
          <span style={S.logo}>Fit<span style={S.logoAccent}>Nova</span></span>
          <div style={S.topbarRight}>
            <Link to="/app/notifications" style={{ ...S.iconBtn, textDecoration: "none" }}>
              <FiBell size={15} />
              <span style={S.notifDot} />
            </Link>
            <Link to="/app/profile" style={{ ...S.avatar, textDecoration: "none" }}>
              {getInitials(user?.displayName)}
            </Link>
          </div>
        </div>

        {/* Greeting */}
        <p style={S.greetingSub}>Good morning,</p>
        <h1 style={S.greetingName}>{user?.displayName || "Athlete"}</h1>

        {/* Stat cards */}
        <div style={S.statsRow}>
          <StatCard
            label="Total pts"
            value={stats?.points?.toLocaleString()}
            delta="+120 this week"
          />
          <StatCard
            label="Global rank"
            value={`#${stats?.rank ?? "—"}`}
            deltaNeutral={`of ${stats?.totalUsers ?? "—"} users`}
            accent
          />
          <StatCard
            label="Streak"
            value={`${stats?.streak ?? streakDays}d`}
            delta="Personal best"
          />
        </div>

        {/* Active challenges */}
        <div style={S.sectionHd}>
          <span style={S.sectionLbl}>Active challenges</span>
          <Link to="/app/challenges" style={{ ...S.seeAll, textDecoration: "none" }}>
            See all <FiArrowRight size={11} />
          </Link>
        </div>

        {activeChallenges.length > 0 ? (
          activeChallenges.slice(0, 3).map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))
        ) : (
          <div style={{ ...S.miniCard, marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 10 }}>
              No active challenges yet
            </p>
            <Link
              to="/app/challenges"
              style={{
                display: "inline-block", background: T.accent,
                color: "#fff", borderRadius: T.radius.md,
                padding: "8px 16px", fontSize: 13, fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Browse challenges
            </Link>
          </div>
        )}

        {/* Leaderboard + Weekly activity */}
        <div style={S.twoCol}>

          {/* Leaderboard mini */}
          <div style={S.miniCard}>
            <div style={S.sectionLbl}>Leaderboard</div>
            <div style={{ marginTop: 10 }}>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, idx) => {
                  const isMe = entry.userId === user?.uid;
                  const isLast = idx === leaderboard.length - 1;
                  return (
                    <div key={entry.userId} style={isLast ? S.lbRowLast : S.lbRow}>
                      <span style={S.lbRank(isMe)}>{idx + 1}</span>
                      <div style={S.lbAvatar(isMe)}>
                        {getInitials(entry.displayName)}
                      </div>
                      <span style={S.lbName(isMe)}>
                        {isMe ? "You" : entry.displayName?.split(" ")[0]}
                      </span>
                      <span style={S.lbPts(isMe)}>
                        {entry.points?.toLocaleString()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
                  No data yet
                </p>
              )}
            </div>
          </div>

          {/* Weekly activity chart */}
          <div style={S.miniCard}>
            <div style={S.sectionLbl}>Weekly activity</div>
            <div style={S.chartBars}>
              {DAYS.map((day, i) => {
                const maxVal = Math.max(...weeklyActivity);
                const heightPct = weeklyActivity[i] / maxVal;
                const isToday = i === new Date().getDay() - 1;
                return (
                  <div key={i} style={S.barCol}>
                    <div
                      style={{
                        width: "100%",
                        borderRadius: "3px 3px 0 0",
                        background: isToday ? T.accent : (i < (new Date().getDay()) ? T.accentDim : "#222"),
                        height: `${Math.max(heightPct * 60, 4)}px`,
                        border: isToday ? `0.5px solid ${T.accentGlow}` : "none",
                        transition: "height 0.3s ease",
                        minHeight: 4,
                      }}
                    />
                    <span style={S.barDay}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Streak tracker */}
        <div style={{ ...S.miniCard, marginBottom: 14 }}>
          <div style={S.sectionHd}>
            <span style={S.sectionLbl}>
              {stats?.streak ?? streakDays}-day streak
            </span>
            <Link
              to="/app/progress/submit"
              style={{ ...S.seeAll, textDecoration: "none" }}
            >
              Log today <FiArrowRight size={11} />
            </Link>
          </div>
          <div style={S.streakDotRow}>
            {[...Array(30)].map((_, i) => {
              const streak = stats?.streak ?? streakDays;
              const done = i < streak - 1;
              const today = i === streak - 1;
              return <div key={i} style={S.dot(done, today)} />;
            })}
          </div>
        </div>

        {/* Recent activity */}
        {recentActivity.length > 0 && (
          <>
            <div style={S.sectionHd}>
              <span style={S.sectionLbl}>Recent activity</span>
            </div>
            <div style={S.miniCard}>
              {recentActivity.slice(0, 5).map((item, idx) => {
                const isLast = idx === Math.min(recentActivity.length, 5) - 1;
                return (
                  <div key={item._id ?? idx} style={isLast ? S.activityRowLast : S.activityRow}>
                    <div style={S.activityDot} />
                    <div>
                      <div style={S.activityText}>{item.description}</div>
                      <div style={S.activityTime}>{getTimeAgo(item.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* Bottom nav */}
      <nav style={S.navBar}>
        <Link to="/app/dashboard" style={S.navItem}>
          <FiHome style={S.navIcon(true)} />
          <span style={S.navLbl(true)}>Home</span>
        </Link>
        <Link to="/app/challenges" style={S.navItem}>
          <FaTrophy style={S.navIcon(false)} />
          <span style={S.navLbl(false)}>Challenges</span>
        </Link>
        <Link to="/app/progress/submit" style={S.navItem}>
          <FiPlus style={S.navIcon(false)} />
          <span style={S.navLbl(false)}>Log</span>
        </Link>
        <Link to="/app/leaderboard" style={S.navItem}>
          <FiBarChart2 style={S.navIcon(false)} />
          <span style={S.navLbl(false)}>Ranks</span>
        </Link>
        <Link to="/app/profile" style={S.navItem}>
          <FiUser style={S.navIcon(false)} />
          <span style={S.navLbl(false)}>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default DashboardPage;