import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaRunning } from 'react-icons/fa'

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/app/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaRunning className="mx-auto h-12 w-auto text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">FitNova Challenge</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the fitness revolution and earn rewards
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout