import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaUsers, FaTrophy, FaGift } from 'react-icons/fa'
import { db } from '../../services/firebaseConfig'
import { collection, getDocs, doc, deleteDoc, query, orderBy, where, updateDoc } from 'firebase/firestore'
import { addNotification } from '../../store/slices/uiSlice'

const AdminUsersPage = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [userStats, setUserStats] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(usersQuery)
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to Date objects for easier handling
        createdAt: doc.data().createdAt?.toDate?.() || null,
        lastLogin: doc.data().lastLogin?.toDate?.() || null,
      }))
      
      // Fetch additional stats for each user
      const usersWithStats = await Promise.all(usersData.map(async (user) => {
        const stats = await fetchUserStats(user.id)
        return { ...user, ...stats }
      }))
      
      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error fetching users:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load users. Please try again.'
      }))
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async (userId) => {
    try {
      // Get challenges the user is participating in
      const participantsQuery = query(
        collection(db, 'challengeParticipants'),
        where('userId', '==', userId)
      )
      const participantsSnapshot = await getDocs(participantsQuery)
      
      // Get rewards the user has redeemed
      const rewardsQuery = query(
        collection(db, 'userRewards'),
        where('userId', '==', userId)
      )
      const rewardsSnapshot = await getDocs(rewardsQuery)
      
      return {
        challengesCount: participantsSnapshot.size,
        rewardsCount: rewardsSnapshot.size
      }
    } catch (error) {
      console.error(`Error fetching stats for user ${userId}:`, error)
      return { challengesCount: 0, rewardsCount: 0 }
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      // Delete the user document from Firestore
      await deleteDoc(doc(db, 'users', userId))
      
      // Update the local state
      setUsers(users.filter(user => user.id !== userId))
      
      dispatch(addNotification({
        type: 'success',
        message: 'User deleted successfully'
      }))
      
      setConfirmDelete(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete user. Please try again.'
      }))
    }
  }

  const handleToggleAdmin = async (user) => {
    try {
      const userRef = doc(db, 'users', user.id)
      const isAdmin = user.isAdmin || false
      
      await updateDoc(userRef, {
        isAdmin: !isAdmin
      })
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isAdmin: !isAdmin } : u
      ))
      
      dispatch(addNotification({
        type: 'success',
        message: `User ${!isAdmin ? 'promoted to admin' : 'demoted from admin'} successfully`
      }))
    } catch (error) {
      console.error('Error updating user admin status:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update user admin status. Please try again.'
      }))
    }
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setShowModal(true)
  }

  const handleAddNewUser = () => {
    setCurrentUser(null) // Reset current user
    setShowModal(true)
  }

  const filteredUsers = users.filter(user => 
    (user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button
          onClick={handleAddNewUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaUserPlus className="-ml-1 mr-2 h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Challenges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rewards
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.photoURL ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
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
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.points || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaTrophy className="mr-2 h-4 w-4 text-secondary-500" />
                        <span className="text-sm text-gray-900">{user.challengesCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaGift className="mr-2 h-4 w-4 text-warning-500" />
                        <span className="text-sm text-gray-900">{user.rewardsCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleAdmin(user)}
                        className="text-secondary-600 hover:text-secondary-900 mr-3"
                        title={user.isAdmin ? 'Remove admin privileges' : 'Make admin'}
                      >
                        {user.isAdmin ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-6 w-6 text-danger-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the user "{confirmDelete.displayName || confirmDelete.email}"? This action cannot be undone and will remove all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteUser(confirmDelete.id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal - This would be a separate component in a real app */}
      {/* For brevity, we're not implementing the full form here */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentUser ? 'Edit User' : 'Create New User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        {currentUser 
                          ? 'Update the user details below.' 
                          : 'Fill in the details to create a new user.'}
                      </p>
                      <div className="text-center py-10">
                        <p>User form would go here</p>
                        <p className="text-sm text-gray-500 mt-2">
                          In a real application, this would be a form component with fields for name, email, role, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  {currentUser ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage