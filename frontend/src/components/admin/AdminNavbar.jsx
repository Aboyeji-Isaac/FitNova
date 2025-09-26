import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaBars, FaRunning, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'

const AdminNavbar = () => {
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
    <nav className="bg-gray-800 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
              onClick={handleToggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="flex items-center">
                <FaRunning className="h-8 w-auto text-primary-400" />
                <span className="ml-2 text-xl font-bold text-white">FitNova Admin</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.photoURL ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt={user.displayName || 'Admin'}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                        <FaUser className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>

                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      to="/app/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="mr-3 h-4 w-4 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/app/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaCog className="mr-3 h-4 w-4 text-gray-400" />
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => {
                        setDropdownOpen(false)
                        handleLogout()
                      }}
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar