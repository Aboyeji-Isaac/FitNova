import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaTimes, FaHome, FaTrophy, FaUsers, FaGift, FaChartBar } from 'react-icons/fa'
import { setSidebarOpen } from '../../store/slices/uiSlice'
import { useLocation } from 'react-router-dom'

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <FaHome className="h-5 w-5" />,
  },
  {
    name: 'Challenges',
    path: '/admin/challenges',
    icon: <FaTrophy className="h-5 w-5" />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <FaUsers className="h-5 w-5" />,
  },
  {
    name: 'Rewards',
    path: '/admin/rewards',
    icon: <FaGift className="h-5 w-5" />,
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: <FaChartBar className="h-5 w-5" />,
  },
]

const AdminSidebar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
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
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">Admin Panel</span>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <FaTimes className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Admin info */}
        <div className="border-b border-gray-700 py-4 px-4">
          <div className="flex items-center">
            {user?.photoURL ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.photoURL}
                alt={user.displayName || 'Admin'}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                <FaUsers className="h-5 w-5" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="bg-primary-700 text-primary-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Administrator
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
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-300'
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

export default AdminSidebar