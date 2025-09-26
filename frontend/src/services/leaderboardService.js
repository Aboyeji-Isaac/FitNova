import axios from 'axios'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from './firebaseConfig'

const API_URL = '/api/leaderboard'

// Get leaderboard for a challenge
const getLeaderboard = async (challengeId, limitCount = 10) => {
  try {
    // Get leaderboard from Firestore
    const userChallengesCollection = collection(db, 'userChallenges')
    const q = query(
      userChallengesCollection,
      where('challengeId', '==', challengeId),
      orderBy('points', 'desc'),
      limit(limitCount)
    )
    const leaderboardSnapshot = await getDocs(q)
    
    // Get user details for each leaderboard entry
    const leaderboard = await Promise.all(
      leaderboardSnapshot.docs.map(async (doc, index) => {
        const userData = doc.data()
        
        // Get user profile
        const usersCollection = collection(db, 'users')
        const userQuery = query(usersCollection, where('id', '==', userData.userId))
        const userSnapshot = await getDocs(userQuery)
        
        if (!userSnapshot.empty) {
          const user = userSnapshot.docs[0].data()
          
          return {
            rank: index + 1,
            userId: userData.userId,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || null,
            points: userData.points,
            progress: userData.progress,
            lastActivityDate: userData.activities && userData.activities.length > 0
              ? userData.activities[userData.activities.length - 1].timestamp
              : userData.joinedAt,
          }
        }
        
        return null
      })
    )
    
    // Filter out any null values
    return leaderboard.filter(entry => entry !== null)
  } catch (error) {
    throw error
  }
}

// Get user rank in a challenge
const getUserRank = async (userId, challengeId) => {
  try {
    // Get all participants for this challenge, ordered by points
    const userChallengesCollection = collection(db, 'userChallenges')
    const q = query(
      userChallengesCollection,
      where('challengeId', '==', challengeId),
      orderBy('points', 'desc')
    )
    const leaderboardSnapshot = await getDocs(q)
    
    // Find the user's position
    const userIndex = leaderboardSnapshot.docs.findIndex(
      doc => doc.data().userId === userId
    )
    
    if (userIndex === -1) {
      // User hasn't joined this challenge
      return null
    }
    
    const userData = leaderboardSnapshot.docs[userIndex].data()
    
    // Get user profile
    const usersCollection = collection(db, 'users')
    const userQuery = query(usersCollection, where('id', '==', userId))
    const userSnapshot = await getDocs(userQuery)
    
    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data()
      
      return {
        rank: userIndex + 1,
        userId,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL || null,
        points: userData.points,
        progress: userData.progress,
        totalParticipants: leaderboardSnapshot.docs.length,
        lastActivityDate: userData.activities && userData.activities.length > 0
          ? userData.activities[userData.activities.length - 1].timestamp
          : userData.joinedAt,
      }
    }
    
    return null
  } catch (error) {
    throw error
  }
}

const leaderboardService = {
  getLeaderboard,
  getUserRank,
}

export default leaderboardService