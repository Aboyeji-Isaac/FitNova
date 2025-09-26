import axios from 'axios'
import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

const API_URL = '/api/rewards'

// Get all available rewards
const getRewards = async () => {
  try {
    // Get rewards from Firestore
    const rewardsCollection = collection(db, 'rewards')
    const rewardSnapshot = await getDocs(rewardsCollection)
    const rewardList = rewardSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Also fetch from backend API
    const response = await axios.get(API_URL)
    
    // Merge data if needed
    return rewardList
  } catch (error) {
    throw error
  }
}

// Get rewards redeemed by a user
const getUserRewards = async (userId) => {
  try {
    // Get user rewards from Firestore
    const userRewardsCollection = collection(db, 'userRewards')
    const q = query(userRewardsCollection, where('userId', '==', userId))
    const userRewardSnapshot = await getDocs(q)
    
    // Get full reward details for each redeemed reward
    const userRewards = await Promise.all(
      userRewardSnapshot.docs.map(async (doc) => {
        const userRewardData = doc.data()
        const rewardDoc = await getDoc(doc(db, 'rewards', userRewardData.rewardId))
        
        if (rewardDoc.exists()) {
          return {
            id: doc.id,
            rewardId: userRewardData.rewardId,
            redeemedAt: userRewardData.redeemedAt,
            status: userRewardData.status,
            code: userRewardData.code,
            ...rewardDoc.data()
          }
        }
        return null
      })
    )
    
    // Filter out any null values
    return userRewards.filter(reward => reward !== null)
  } catch (error) {
    throw error
  }
}

// Redeem a reward
const redeemReward = async (rewardId) => {
  try {
    // Get current user ID from auth service
    const userId = localStorage.getItem('userId') // This should be replaced with proper auth
    
    if (!userId) {
      throw new Error('User not authenticated')
    }
    
    // Get the reward details
    const rewardDoc = await getDoc(doc(db, 'rewards', rewardId))
    
    if (!rewardDoc.exists()) {
      throw new Error('Reward not found')
    }
    
    const rewardData = rewardDoc.data()
    
    // Check if reward is available
    if (rewardData.available <= 0) {
      throw new Error('Reward is no longer available')
    }
    
    // Get user points
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    
    // Check if user has enough points
    if (userData.points < rewardData.pointsCost) {
      throw new Error('Not enough points to redeem this reward')
    }
    
    // Generate a unique code for the reward
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    // Add to userRewards collection
    const userRewardsCollection = collection(db, 'userRewards')
    const userRewardDoc = await addDoc(userRewardsCollection, {
      userId,
      rewardId,
      redeemedAt: new Date(),
      status: 'active',
      code,
    })
    
    // Update reward availability
    await updateDoc(doc(db, 'rewards', rewardId), {
      available: rewardData.available - 1,
    })
    
    // Update user points
    await updateDoc(doc(db, 'users', userId), {
      points: userData.points - rewardData.pointsCost,
    })
    
    // Also redeem via backend API
    const response = await axios.post(`${API_URL}/${rewardId}/redeem`)
    
    return {
      id: userRewardDoc.id,
      rewardId,
      redeemedAt: new Date(),
      status: 'active',
      code,
      ...rewardData,
    }
  } catch (error) {
    throw error
  }
}

const rewardsService = {
  getRewards,
  getUserRewards,
  redeemReward,
}

export default rewardsService