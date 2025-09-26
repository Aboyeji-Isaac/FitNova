import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useSelector((state) => state.auth)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Redirect to dashboard if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/app/dashboard" replace />
  }

  // Render children if authenticated and admin
  return children
}



// const AdminRoute = ({ children }) => {
//   return children; // Always allow access for now
// };


export default AdminRoute