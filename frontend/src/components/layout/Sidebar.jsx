import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaTimes, FaHome, FaTrophy, FaMedal, FaGift, FaImages, FaUser } from 'react-icons/fa'
import { setSidebarOpen } from '../../store/slices/uiSlice'

const navItems = [
  {
    name: 'Dashboard',
    path: '/app/dashboard',
    icon: <FaHome className="h-5 w-5" />,
  },
  {
    name: 'Leaderboard',
    path: '/app/leaderboard',
    icon: <FaTrophy className="h-5 w-5" />,
  },
  {
    name: 'Challenges',
    path: '/app/challenges',
    icon: <FaMedal className="h-5 w-5" />,
  },
  {
    name: 'Rewards',
    path: '/app/rewards',
    icon: <FaGift className="h-5 w-5" />,
  },
  {
    name: 'Gallery',
    path: '/app/gallery',
    icon: <FaImages className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    path: '/app/profile',
    icon: <FaUser className="h-5 w-5" />,
  },
]

const Sidebar = () => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const { user } = useSelector((state) => state.auth)

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false))
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-9 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-9 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">FitNova</span>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <FaTimes className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-gray-200 py-4 px-4">
          <div className="flex items-center">
            {user?.photoURL ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.photoURL}
                alt={user.displayName || 'User'}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <FaUser className="h-5 w-5" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {user?.points || 0} Points
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    closeSidebar()
                  }
                }}
              >
                <div
                  className={`mr-4 flex-shrink-0 ${
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                >
                  {item.icon}
                </div>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar