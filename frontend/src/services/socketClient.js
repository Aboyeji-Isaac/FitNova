import { io } from 'socket.io-client';
import { getAuthToken } from './backendApi';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token: getAuthToken(),
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected');
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Challenge event handlers
export const joinChallenge = (challengeId, userId) => {
  const sock = getSocket();
  sock.emit('join-challenge', { challengeId, userId });
};

export const leaveChallenge = (challengeId, userId) => {
  const sock = getSocket();
  sock.emit('leave-challenge', { challengeId, userId });
};

export const submitProgress = (challengeId, userId, progress, points) => {
  const sock = getSocket();
  sock.emit('progress-submitted', { challengeId, userId, progress, points });
};

export const requestLeaderboard = (challengeId) => {
  const sock = getSocket();
  sock.emit('request-leaderboard', { challengeId });
};

export const subscribeToNotifications = (userId) => {
  const sock = getSocket();
  sock.emit('subscribe-notifications', { userId });
};

// Listeners setup
export const onUserJoined = (callback) => {
  getSocket().on('user-joined', callback);
};

export const onUserLeft = (callback) => {
  getSocket().on('user-left', callback);
};

export const onLeaderboardUpdate = (callback) => {
  getSocket().on('leaderboard-update', callback);
};

export const onLeaderboardData = (callback) => {
  getSocket().on('leaderboard-data', callback);
};

export const onNotification = (callback) => {
  getSocket().on('notification', callback);
};

export const onSocketError = (callback) => {
  getSocket().on('error', callback);
};

// Cleanup listeners
export const offUserJoined = (callback) => {
  getSocket().off('user-joined', callback);
};

export const offUserLeft = (callback) => {
  getSocket().off('user-left', callback);
};

export const offLeaderboardUpdate = (callback) => {
  getSocket().off('leaderboard-update', callback);
};

export const offLeaderboardData = (callback) => {
  getSocket().off('leaderboard-data', callback);
};

export const offNotification = (callback) => {
  getSocket().off('notification', callback);
};
