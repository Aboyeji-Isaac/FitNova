import { useState } from 'react'
import { FaBars, FaBell, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <nav className="bg-dark-card border-b border-dark-border fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side */}
          <div className="flex items-center">
            <button
              type="button"
              className="px-4 text-gray-400 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden transition-colors"
              onClick={handleToggleSidebar}
            >
              <span className="sr-only">Toggle sidebar</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-black font-bold text-sm group-hover:shadow-neon transition-all">
                  FN
                </div>
                <span className="hidden sm:inline text-xl font-bold text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors">
                  FitNova
                </span>
              </Link>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <FaBell className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="max-w-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                {user?.photoURL ? (
                  <img
                    className="h-8 w-8 rounded-lg object-cover"
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-black font-bold text-xs">
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-dark-card border border-dark-border ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <div className="px-4 py-2 border-b border-dark-border">
                    <p className="text-sm font-bold text-white">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/app/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-primary-500 hover:bg-dark-border transition-colors"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUser className="mr-3 h-4 w-4" />
                    Your Profile
                  </Link>
                  <Link
                    to="/app/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-primary-500 hover:bg-dark-border transition-colors"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaCog className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:text-danger-400 hover:bg-dark-border transition-colors"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => {
                      setDropdownOpen(false)
                      handleLogout()
                    }}
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar