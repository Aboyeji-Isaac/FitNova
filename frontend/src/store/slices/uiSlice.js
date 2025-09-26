import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  notifications: [],
  theme: 'light',
  loading: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload
      state.loading[key] = isLoading
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setLoading,
} = uiSlice.actions

export default uiSlice.reducer