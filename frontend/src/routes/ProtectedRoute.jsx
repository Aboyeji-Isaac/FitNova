import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

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

  // Render children if authenticated
  return children
}



// const ProtectedRoute = ({ children }) => {
//   // ProtectedRoute.jsx (Demo Mode)
// const ProtectedRoute = ({ children }) => {
//   return children; // Always allow
// };

// }


export default ProtectedRoute