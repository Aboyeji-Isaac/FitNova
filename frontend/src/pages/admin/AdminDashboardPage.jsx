import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaTrophy, FaGift, FaRunning } from 'react-icons/fa'
import { db } from '../../services/firebaseConfig'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChallenges: 0,
    totalRewards: 0,
    activeParticipants: 0,
  })
  
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const challengesSnapshot = await getDocs(collection(db, 'challenges'))
        const rewardsSnapshot = await getDocs(collection(db, 'rewards'))
        
        // Calculate active participants (users who have joined at least one challenge)
        const participantsSnapshot = await getDocs(collection(db, 'challengeParticipants'))
        const uniqueParticipants = new Set()
        participantsSnapshot.forEach(doc => {
          uniqueParticipants.add(doc.data().userId)
        })
        
        setStats({
          totalUsers: usersSnapshot.size,
          totalChallenges: challengesSnapshot.size,
          totalRewards: rewardsSnapshot.size,
          activeParticipants: uniqueParticipants.size,
        })
        
        // Fetch recent users
        const recentUsersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        const recentUsersData = recentUsersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        
        setRecentUsers(recentUsersData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.displayName || 'Admin'}</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FaUsers className="h-6 w-6" />} 
          color="bg-primary-600"
        />
        <StatCard 
          title="Active Participants" 
          value={stats.activeParticipants} 
          icon={<FaRunning className="h-6 w-6" />} 
          color="bg-success-600"
        />
        <StatCard 
          title="Total Challenges" 
          value={stats.totalChallenges} 
          icon={<FaTrophy className="h-6 w-6" />} 
          color="bg-secondary-600"
        />
        <StatCard 
          title="Available Rewards" 
          value={stats.totalRewards} 
          icon={<FaGift className="h-6 w-6" />} 
          color="bg-warning-600"
        />
      </div>
      
      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.photoURL ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.photoURL} 
                            alt={user.displayName || user.email} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <FaUsers className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.points || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt?.toDate ? (
                      new Date(user.createdAt.toDate()).toLocaleDateString()
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/challenges" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Manage Challenges
          </a>
          <a 
            href="/admin/users" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
          >
            Manage Users
          </a>
          <a 
            href="/admin/rewards" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
          >
            Manage Rewards
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage