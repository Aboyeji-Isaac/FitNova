import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import leaderboardService from '../../services/leaderboardService'

const initialState = {
  leaderboard: [],
  userRank: null,
  isLoading: false,
  error: null,
}

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ challengeId, limit }, { rejectWithValue }) => {
    try {
      return await leaderboardService.getLeaderboard(challengeId, limit)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async ({ userId, challengeId }, { rejectWithValue }) => {
    try {
      return await leaderboardService.getUserRank(userId, challengeId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    resetLeaderboardState: (state) => {
      state.error = null
      state.isLoading = false
    },
    clearLeaderboard: (state) => {
      state.leaderboard = []
      state.userRank = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.leaderboard = action.payload
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch user rank
      .addCase(fetchUserRank.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.isLoading = false
        state.userRank = action.payload
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { resetLeaderboardState, clearLeaderboard } = leaderboardSlice.actions

export default leaderboardSlice.reducer