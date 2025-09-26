import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import challengesService from '../../services/challengesService'

const initialState = {
  challenges: [],
  currentChallenge: null,
  userChallenges: [],
  isLoading: false,
  error: null,
}

export const fetchChallenges = createAsyncThunk(
  'challenges/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      return await challengesService.getChallenges()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchChallengeById = createAsyncThunk(
  'challenges/fetchChallengeById',
  async (id, { rejectWithValue }) => {
    try {
      return await challengesService.getChallengeById(id)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchUserChallenges = createAsyncThunk(
  'challenges/fetchUserChallenges',
  async (userId, { rejectWithValue }) => {
    try {
      return await challengesService.getUserChallenges(userId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const joinChallenge = createAsyncThunk(
  'challenges/joinChallenge',
  async (challengeId, { rejectWithValue }) => {
    try {
      return await challengesService.joinChallenge(challengeId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const submitChallengeActivity = createAsyncThunk(
  'challenges/submitChallengeActivity',
  async ({ challengeId, activityData }, { rejectWithValue }) => {
    try {
      return await challengesService.submitActivity(challengeId, activityData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    resetChallengeState: (state) => {
      state.error = null
      state.isLoading = false
    },
    clearCurrentChallenge: (state) => {
      state.currentChallenge = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.isLoading = false
        state.challenges = action.payload
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch challenge by ID
      .addCase(fetchChallengeById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChallengeById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentChallenge = action.payload
      })
      .addCase(fetchChallengeById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch user challenges
      .addCase(fetchUserChallenges.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserChallenges.fulfilled, (state, action) => {
        state.isLoading = false
        state.userChallenges = action.payload
      })
      .addCase(fetchUserChallenges.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Join challenge
      .addCase(joinChallenge.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(joinChallenge.fulfilled, (state, action) => {
        state.isLoading = false
        state.userChallenges.push(action.payload)
      })
      .addCase(joinChallenge.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Submit challenge activity
      .addCase(submitChallengeActivity.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitChallengeActivity.fulfilled, (state, action) => {
        state.isLoading = false
        // Update the current challenge with the new activity
        if (state.currentChallenge && state.currentChallenge.id === action.payload.challengeId) {
          state.currentChallenge.activities = state.currentChallenge.activities || []
          state.currentChallenge.activities.push(action.payload.activity)
        }
        // Update the user challenges list if the challenge exists there
        const challengeIndex = state.userChallenges.findIndex(c => c.id === action.payload.challengeId)
        if (challengeIndex !== -1) {
          state.userChallenges[challengeIndex].activities = state.userChallenges[challengeIndex].activities || []
          state.userChallenges[challengeIndex].activities.push(action.payload.activity)
        }
      })
      .addCase(submitChallengeActivity.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { resetChallengeState, clearCurrentChallenge } = challengesSlice.actions

export default challengesSlice.reducer