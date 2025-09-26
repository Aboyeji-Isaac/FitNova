import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FaUsers, FaTrophy, FaGift, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import { db } from '../../services/firebaseConfig'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { addNotification } from '../../store/slices/uiSlice'

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    totalRewards: 0,
    redeemedRewards: 0,
    userGrowth: [],
    challengeParticipation: [],
    rewardRedemptions: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch users data
      const usersQuery = query(collection(db, 'users'))
      const usersSnapshot = await getDocs(usersQuery)
      const totalUsers = usersSnapshot.size
      
      // Get active users (logged in within the last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const activeUsersQuery = query(
        collection(db, 'users'),
        where('lastLogin', '>=', Timestamp.fromDate(thirtyDaysAgo))
      )
      const activeUsersSnapshot = await getDocs(activeUsersQuery)
      const activeUsers = activeUsersSnapshot.size
      
      // Fetch challenges data
      const challengesQuery = query(collection(db, 'challenges'))
      const challengesSnapshot = await getDocs(challengesQuery)
      const totalChallenges = challengesSnapshot.size
      
      // Get active challenges
      const now = new Date()
      const activeChallengesQuery = query(
        collection(db, 'challenges'),
        where('endDate', '>=', Timestamp.fromDate(now))
      )
      const activeChallengesSnapshot = await getDocs(activeChallengesQuery)
      const activeChallenges = activeChallengesSnapshot.size
      
      // Fetch rewards data
      const rewardsQuery = query(collection(db, 'rewards'))
      const rewardsSnapshot = await getDocs(rewardsQuery)
      const totalRewards = rewardsSnapshot.size
      
      // Get redeemed rewards
      const userRewardsQuery = query(collection(db, 'userRewards'))
      const userRewardsSnapshot = await getDocs(userRewardsQuery)
      const redeemedRewards = userRewardsSnapshot.size
      
      // Get user growth data (last 6 months)
      const userGrowth = await getUserGrowthData()
      
      // Get challenge participation data
      const challengeParticipation = await getChallengeParticipationData()
      
      // Get reward redemption data
      const rewardRedemptions = await getRewardRedemptionsData()
      
      setStats({
        totalUsers,
        activeUsers,
        totalChallenges,
        activeChallenges,
        totalRewards,
        redeemedRewards,
        userGrowth,
        challengeParticipation,
        rewardRedemptions
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load analytics data. Please try again.'
      }))
    } finally {
      setLoading(false)
    }
  }

  const getUserGrowthData = async () => {
    try {
      const months = []
      const counts = []
      
      // Get the last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.toLocaleString('default', { month: 'short' })
        months.push(month)
        
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        
        const monthUsersQuery = query(
          collection(db, 'users'),
          where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
          where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
        )
        const monthUsersSnapshot = await getDocs(monthUsersQuery)
        counts.push(monthUsersSnapshot.size)
      }
      
      return { months, counts }
    } catch (error) {
      console.error('Error fetching user growth data:', error)
      return { months: [], counts: [] }
    }
  }

  const getChallengeParticipationData = async () => {
    try {
      // Get top 5 challenges by participation
      const challengesQuery = query(collection(db, 'challenges'))
      const challengesSnapshot = await getDocs(challengesQuery)
      
      const challengesData = []
      
      for (const doc of challengesSnapshot.docs) {
        const challenge = {
          id: doc.id,
          title: doc.data().title,
          participants: 0
        }
        
        const participantsQuery = query(
          collection(db, 'challengeParticipants'),
          where('challengeId', '==', doc.id)
        )
        const participantsSnapshot = await getDocs(participantsQuery)
        challenge.participants = participantsSnapshot.size
        
        challengesData.push(challenge)
      }
      
      // Sort by participants count and get top 5
      return challengesData
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching challenge participation data:', error)
      return []
    }
  }

  const getRewardRedemptionsData = async () => {
    try {
      // Get top 5 rewards by redemption
      const rewardsQuery = query(collection(db, 'rewards'))
      const rewardsSnapshot = await getDocs(rewardsQuery)
      
      const rewardsData = []
      
      for (const doc of rewardsSnapshot.docs) {
        const reward = {
          id: doc.id,
          title: doc.data().title,
          redemptions: 0
        }
        
        const redemptionsQuery = query(
          collection(db, 'userRewards'),
          where('rewardId', '==', doc.id)
        )
        const redemptionsSnapshot = await getDocs(redemptionsQuery)
        reward.redemptions = redemptionsSnapshot.size
        
        rewardsData.push(reward)
      }
      
      // Sort by redemptions count and get top 5
      return rewardsData
        .sort((a, b) => b.redemptions - a.redemptions)
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching reward redemptions data:', error)
      return []
    }
  }

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
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of platform performance and metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <FaUsers className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="ml-2 text-sm text-success-600">
                  <span className="font-medium">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}%</span> active
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-sm font-medium text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
              <FaTrophy className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Challenges</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalChallenges}</p>
                <p className="ml-2 text-sm text-success-600">
                  <span className="font-medium">{Math.round((stats.activeChallenges / stats.totalChallenges) * 100)}%</span> active
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Active Challenges</p>
              <p className="text-sm font-medium text-gray-900">{stats.activeChallenges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100 text-warning-600">
              <FaGift className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rewards</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRewards}</p>
                <p className="ml-2 text-sm text-success-600">
                  <span className="font-medium">{Math.round((stats.redeemedRewards / stats.totalRewards) * 100)}%</span> redeemed
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Redeemed Rewards</p>
              <p className="text-sm font-medium text-gray-900">{stats.redeemedRewards}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Growth</h2>
          <div className="h-64">
            {stats.userGrowth.months?.length > 0 ? (
              <div className="h-full flex items-end">
                {stats.userGrowth.counts.map((count, index) => {
                  const maxCount = Math.max(...stats.userGrowth.counts)
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary-500 rounded-t" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{stats.userGrowth.months[index]}</div>
                      <div className="text-xs font-medium">{count}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Participation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Challenges by Participation</h2>
          {stats.challengeParticipation.length > 0 ? (
            <div className="space-y-4">
              {stats.challengeParticipation.map((challenge) => {
                const maxParticipants = Math.max(...stats.challengeParticipation.map(c => c.participants))
                const width = maxParticipants > 0 ? (challenge.participants / maxParticipants) * 100 : 0
                
                return (
                  <div key={challenge.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate" title={challenge.title}>
                        {challenge.title}
                      </p>
                      <p className="text-sm text-gray-500">{challenge.participants}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-secondary-500 h-2.5 rounded-full" 
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Reward Redemptions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Rewards by Redemption</h2>
        {stats.rewardRedemptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Redemptions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.rewardRedemptions.map((reward) => {
                  const maxRedemptions = Math.max(...stats.rewardRedemptions.map(r => r.redemptions))
                  const width = maxRedemptions > 0 ? (reward.redemptions / maxRedemptions) * 100 : 0
                  
                  return (
                    <tr key={reward.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reward.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reward.redemptions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-warning-500 h-2.5 rounded-full" 
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                      <FaUsers className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">New user <span className="font-medium text-gray-900">John Doe</span> joined the platform</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-01-23">Today</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-secondary-500 flex items-center justify-center ring-8 ring-white">
                      <FaTrophy className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">New challenge <span className="font-medium text-gray-900">Summer Fitness</span> was created</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-01-22">Yesterday</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-warning-500 flex items-center justify-center ring-8 ring-white">
                      <FaGift className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">User <span className="font-medium text-gray-900">Jane Smith</span> redeemed a reward</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-01-20">3 days ago</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-0">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-white">
                      <FaChartLine className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Platform reached <span className="font-medium text-gray-900">1,000</span> total users</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-01-18">5 days ago</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            View all activity
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalyticsPage