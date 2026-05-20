import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import NotificationContainer from '../components/ui/NotificationContainer'
import { setSidebarOpen } from '../store/slices/uiSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const showSidebar = location.pathname !== '/'

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false))
    }
  }, [location.pathname, dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {showSidebar && <Sidebar />}
        
        <main 
          className={`flex-1 transition-all duration-300 ${showSidebar && sidebarOpen ? 'md:ml-64' : ''}`}
        >
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
      
      <NotificationContainer />
    </div>
  )
}

export default MainLayout