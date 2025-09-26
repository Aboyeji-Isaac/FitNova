import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AdminNavbar from '../components/admin/AdminNavbar'
import AdminSidebar from '../components/admin/AdminSidebar'
import NotificationContainer from '../components/ui/NotificationContainer'
import { setSidebarOpen } from '../store/slices/uiSlice'

const AdminLayout = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { sidebarOpen } = useSelector((state) => state.ui)

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false))
    }
  }, [location.pathname, dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavbar />
      
      <div className="flex flex-1 pt-16">
        <AdminSidebar />
        
        <main 
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}
        >
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <NotificationContainer />
    </div>
  )
}

export default AdminLayout