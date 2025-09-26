import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import rewardsService from '../../services/rewardsService'

const initialState = {
  rewards: [],
  userRewards: [],
  isLoading: false,
  error: null,
}

export const fetchRewards = createAsyncThunk(
  'rewards/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      return await rewardsService.getRewards()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchUserRewards = createAsyncThunk(
  'rewards/fetchUserRewards',
  async (userId, { rejectWithValue }) => {
    try {
      return await rewardsService.getUserRewards(userId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const redeemReward = createAsyncThunk(
  'rewards/redeemReward',
  async (rewardId, { rejectWithValue }) => {
    try {
      return await rewardsService.redeemReward(rewardId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    resetRewardsState: (state) => {
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all rewards
      .addCase(fetchRewards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.isLoading = false
        state.rewards = action.payload
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch user rewards
      .addCase(fetchUserRewards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        state.isLoading = false
        state.userRewards = action.payload
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Redeem reward
      .addCase(redeemReward.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.isLoading = false
        state.userRewards.push(action.payload)
        // Update the available points in the rewards list
        const rewardIndex = state.rewards.findIndex(r => r.id === action.payload.rewardId)
        if (rewardIndex !== -1) {
          state.rewards[rewardIndex].available -= 1
        }
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { resetRewardsState } = rewardsSlice.actions

export default rewardsSlice.reducer