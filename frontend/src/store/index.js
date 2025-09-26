import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import challengesReducer from './slices/challengesSlice'
import leaderboardReducer from './slices/leaderboardSlice'
import rewardsReducer from './slices/rewardsSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    challenges: challengesReducer,
    leaderboard: leaderboardReducer,
    rewards: rewardsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store