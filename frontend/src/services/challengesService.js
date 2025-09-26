import axios from 'axios'
import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebaseConfig'

const API_URL = '/api/challenges'

// Get all challenges
const getChallenges = async () => {
  try {
    // Get challenges from Firestore
    const challengesCollection = collection(db, 'challenges')
    const challengeSnapshot = await getDocs(challengesCollection)
    const challengeList = challengeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Also fetch from backend API
    const response = await axios.get(API_URL)
    
    // Merge data if needed (backend might have additional data)
    return challengeList
  } catch (error) {
    throw error
  }
}

// Get challenge by ID
const getChallengeById = async (id) => {
  try {
    // Get challenge from Firestore
    const challengeDoc = doc(db, 'challenges', id)
    const challengeSnapshot = await getDoc(challengeDoc)
    
    if (!challengeSnapshot.exists()) {
      throw new Error('Challenge not found')
    }
    
    const challengeData = {
      id: challengeSnapshot.id,
      ...challengeSnapshot.data()
    }

    // Also fetch from backend API
    const response = await axios.get(`${API_URL}/${id}`)
    
    // Merge data if needed
    return challengeData
  } catch (error) {
    throw error
  }
}

// Get user challenges
const getUserChallenges = async (userId) => {
  try {
    // Get user challenges from Firestore
    const userChallengesCollection = collection(db, 'userChallenges')
    const q = query(userChallengesCollection, where('userId', '==', userId))
    const userChallengeSnapshot = await getDocs(q)
    
    const userChallengeIds = userChallengeSnapshot.docs.map(doc => doc.data().challengeId)
    
    // Get full challenge details for each challenge
    const challenges = await Promise.all(
      userChallengeIds.map(async (challengeId) => {
        const challengeDoc = doc(db, 'challenges', challengeId)
        const challengeSnapshot = await getDoc(challengeDoc)
        
        if (challengeSnapshot.exists()) {
          return {
            id: challengeSnapshot.id,
            ...challengeSnapshot.data(),
            // Add user-specific data
            userProgress: userChallengeSnapshot.docs.find(
              doc => doc.data().challengeId === challengeId
            ).data().progress || 0,
            joined: true
          }
        }
        return null
      })
    )
    
    // Filter out any null values (challenges that no longer exist)
    return challenges.filter(challenge => challenge !== null)
  } catch (error) {
    throw error
  }
}

// Join a challenge
const joinChallenge = async (challengeId) => {
  try {
    // Get current user ID from auth service
    const userId = localStorage.getItem('userId') // This should be replaced with proper auth
    
    if (!userId) {
      throw new Error('User not authenticated')
    }
    
    // Add user to challenge in Firestore
    const userChallengeCollection = collection(db, 'userChallenges')
    await addDoc(userChallengeCollection, {
      userId,
      challengeId,
      joinedAt: new Date(),
      progress: 0,
      activities: [],
      points: 0,
    })
    
    // Also join via backend API
    const response = await axios.post(`${API_URL}/${challengeId}/join`)
    
    // Get the full challenge details
    const challenge = await getChallengeById(challengeId)
    
    return {
      ...challenge,
      userProgress: 0,
      joined: true
    }
  } catch (error) {
    throw error
  }
}

// Submit activity for a challenge
const submitActivity = async (challengeId, activityData) => {
  try {
    // Get current user ID from auth service
    const userId = localStorage.getItem('userId') // This should be replaced with proper auth
    
    if (!userId) {
      throw new Error('User not authenticated')
    }
    
    // Upload photo if provided
    let photoUrl = null
    if (activityData.photo) {
      const storageRef = ref(storage, `activities/${userId}/${challengeId}/${Date.now()}`)
      const uploadResult = await uploadBytes(storageRef, activityData.photo)
      photoUrl = await getDownloadURL(uploadResult.ref)
    }
    
    // Create activity object
    const activity = {
      ...activityData,
      photoUrl,
      timestamp: new Date(),
      userId,
    }
    
    // Find the user challenge document
    const userChallengesCollection = collection(db, 'userChallenges')
    const q = query(
      userChallengesCollection,
      where('userId', '==', userId),
      where('challengeId', '==', challengeId)
    )
    const userChallengeSnapshot = await getDocs(q)
    
    if (userChallengeSnapshot.empty) {
      throw new Error('User has not joined this challenge')
    }
    
    const userChallengeDoc = userChallengeSnapshot.docs[0]
    const userChallengeRef = doc(db, 'userChallenges', userChallengeDoc.id)
    
    // Calculate points based on activity type and challenge rules
    // This is a simplified example
    const pointsEarned = 10
    
    // Update user challenge with new activity and points
    await updateDoc(userChallengeRef, {
      activities: arrayUnion(activity),
      points: userChallengeDoc.data().points + pointsEarned,
      progress: userChallengeDoc.data().progress + 1,
    })
    
    // Also submit via backend API
    const response = await axios.post(`${API_URL}/${challengeId}/activity`, {
      ...activityData,
      photoUrl,
    })
    
    return {
      challengeId,
      activity: {
        ...activity,
        pointsEarned,
      },
    }
  } catch (error) {
    throw error
  }
}

const challengesService = {
  getChallenges,
  getChallengeById,
  getUserChallenges,
  joinChallenge,
  submitActivity,
}

export default challengesService