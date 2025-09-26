import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Layout components
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
import LeaderboardPage from './pages/LeaderboardPage'
import RewardsPage from './pages/RewardsPage'
import GalleryPage from './pages/GalleryPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminChallengesPage from './pages/admin/AdminChallengesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminRewardsPage from './pages/admin/AdminRewardsPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'

// Auth guard
// import ProtectedRoute from './routes/ProtectedRoute'
// import AdminRoute from './routes/AdminRoute'
import AuthDemo from './pages/auth/AuthDemo'

function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route path="/app" element={
        // <ProtectedRoute>
        //   <MainLayout />
        // </ProtectedRoute>
        <MainLayout />
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin routes */}
      {/* <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="challenges" element={<AdminChallengesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="rewards" element={<AdminRewardsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route> */}

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App