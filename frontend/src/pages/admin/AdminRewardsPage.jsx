import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FaSearch, FaEdit, FaTrash, FaGift, FaPlus } from 'react-icons/fa'
import { db, storage } from '../../services/firebaseConfig'
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { addNotification } from '../../store/slices/uiSlice'

const AdminRewardsPage = () => {
  const dispatch = useDispatch()
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentReward, setCurrentReward] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: 0,
    quantity: 0,
    imageFile: null,
    imagePreview: null
  })

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      const rewardsQuery = query(
        collection(db, 'rewards'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(rewardsQuery)
      
      const rewardsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to Date objects for easier handling
        createdAt: doc.data().createdAt?.toDate?.() || null,
      }))
      
      // Fetch redemption counts for each reward
      const rewardsWithStats = await Promise.all(rewardsData.map(async (reward) => {
        const stats = await fetchRewardStats(reward.id)
        return { ...reward, ...stats }
      }))
      
      setRewards(rewardsWithStats)
    } catch (error) {
      console.error('Error fetching rewards:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load rewards. Please try again.'
      }))
    } finally {
      setLoading(false)
    }
  }

  const fetchRewardStats = async (rewardId) => {
    try {
      // Get number of times this reward has been redeemed
      const redemptionsQuery = query(
        collection(db, 'userRewards'),
        where('rewardId', '==', rewardId)
      )
      const redemptionsSnapshot = await getDocs(redemptionsQuery)
      
      return {
        redemptionsCount: redemptionsSnapshot.size
      }
    } catch (error) {
      console.error(`Error fetching stats for reward ${rewardId}:`, error)
      return { redemptionsCount: 0 }
    }
  }

  const handleDeleteReward = async (rewardId) => {
    try {
      // Find the reward to get the image URL
      const rewardToDelete = rewards.find(reward => reward.id === rewardId)
      
      // Delete the image from Storage if it exists
      if (rewardToDelete.imageUrl) {
        try {
          // Extract the file path from the URL
          const imagePath = rewardToDelete.imageUrl.split('rewards%2F')[1].split('?')[0]
          const imageRef = ref(storage, `rewards/${imagePath}`)
          await deleteObject(imageRef)
        } catch (imageError) {
          console.error('Error deleting image:', imageError)
          // Continue with deleting the document even if image deletion fails
        }
      }
      
      // Delete the reward document from Firestore
      await deleteDoc(doc(db, 'rewards', rewardId))
      
      // Update the local state
      setRewards(rewards.filter(reward => reward.id !== rewardId))
      
      dispatch(addNotification({
        type: 'success',
        message: 'Reward deleted successfully'
      }))
      
      setConfirmDelete(null)
    } catch (error) {
      console.error('Error deleting reward:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete reward. Please try again.'
      }))
    }
  }

  const handleEditReward = (reward) => {
    setCurrentReward(reward)
    setFormData({
      title: reward.title || '',
      description: reward.description || '',
      pointsCost: reward.pointsCost || 0,
      quantity: reward.quantity || 0,
      imageFile: null,
      imagePreview: reward.imageUrl || null
    })
    setShowModal(true)
  }

  const handleAddNewReward = () => {
    setCurrentReward(null) // Reset current reward
    setFormData({
      title: '',
      description: '',
      pointsCost: 0,
      quantity: 0,
      imageFile: null,
      imagePreview: null
    })
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'pointsCost' || name === 'quantity' ? parseInt(value, 10) : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let imageUrl = currentReward?.imageUrl || null
      
      // Upload new image if provided
      if (formData.imageFile) {
        const timestamp = new Date().getTime()
        const fileName = `${timestamp}_${formData.imageFile.name}`
        const storageRef = ref(storage, `rewards/${fileName}`)
        
        await uploadBytes(storageRef, formData.imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }
      
      const rewardData = {
        title: formData.title,
        description: formData.description,
        pointsCost: formData.pointsCost,
        quantity: formData.quantity,
        imageUrl,
        updatedAt: new Date()
      }
      
      if (currentReward) {
        // Update existing reward
        await updateDoc(doc(db, 'rewards', currentReward.id), rewardData)
        
        // Update local state
        setRewards(rewards.map(reward => 
          reward.id === currentReward.id ? { ...reward, ...rewardData } : reward
        ))
        
        dispatch(addNotification({
          type: 'success',
          message: 'Reward updated successfully'
        }))
      } else {
        // Create new reward
        rewardData.createdAt = new Date()
        
        const docRef = await addDoc(collection(db, 'rewards'), rewardData)
        
        // Update local state
        setRewards([{ id: docRef.id, ...rewardData, redemptionsCount: 0 }, ...rewards])
        
        dispatch(addNotification({
          type: 'success',
          message: 'Reward created successfully'
        }))
      }
      
      setShowModal(false)
    } catch (error) {
      console.error('Error saving reward:', error)
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to save reward. Please try again.'
      }))
    }
  }

  const filteredRewards = rewards.filter(reward => 
    (reward.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reward.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Rewards</h1>
        <button
          onClick={handleAddNewReward}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Reward
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
            placeholder="Search rewards by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {reward.imageUrl ? (
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaGift className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{reward.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {reward.pointsCost} points
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{reward.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Quantity: {reward.quantity}</span>
                  <span>Redeemed: {reward.redemptionsCount || 0}</span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditReward(reward)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaEdit className="-ml-0.5 mr-1 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(reward)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-danger-600 bg-danger-50 hover:bg-danger-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
                  >
                    <FaTrash className="-ml-0.5 mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <FaGift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm ? 'No rewards match your search.' : 'No rewards found.'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new reward.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleAddNewReward}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add Reward
                </button>
              </div>
            )}
          </div>
        )}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Reward</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the reward "{confirmDelete.title}"? This action cannot be undone and will remove all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteReward(confirmDelete.id)}
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

      {/* Reward Form Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentReward ? 'Edit Reward' : 'Create New Reward'}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="pointsCost" className="block text-sm font-medium text-gray-700 mb-1">
                        Points Cost
                      </label>
                      <input
                        type="number"
                        id="pointsCost"
                        name="pointsCost"
                        min="0"
                        value={formData.pointsCost}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Available
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="0"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reward Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.imagePreview ? (
                          <div className="mb-3">
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="mx-auto h-32 w-auto object-cover"
                            />
                          </div>
                        ) : (
                          <FaGift className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="imageFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="imageFile"
                              name="imageFile"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentReward ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRewardsPage