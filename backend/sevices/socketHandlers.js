import { getDb } from './firebaseAdmin.js';

export const setupSocketHandlers = (io) => {
  const challengeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    socket.on('join-challenge', async (data) => {
      const { challengeId, userId } = data;
      const roomName = `challenge-${challengeId}`;

      try {
        socket.join(roomName);
        if (!challengeRooms.has(roomName)) {
          challengeRooms.set(roomName, new Set());
        }
        challengeRooms.get(roomName).add(userId);

        const activeCount = challengeRooms.get(roomName).size;
        io.to(roomName).emit('user-joined', {
          userId,
          timestamp: new Date().toISOString(),
          activeCount,
        });

        console.log(`✅ User ${userId} joined challenge ${challengeId}`);
      } catch (error) {
        console.error('Error joining challenge:', error);
        socket.emit('error', { message: 'Failed to join challenge' });
      }
    });

    socket.on('leave-challenge', async (data) => {
      const { challengeId, userId } = data;
      const roomName = `challenge-${challengeId}`;

      try {
        socket.leave(roomName);
        if (challengeRooms.has(roomName)) {
          challengeRooms.get(roomName).delete(userId);
          const activeCount = challengeRooms.get(roomName).size;

          if (activeCount === 0) {
            challengeRooms.delete(roomName);
          }

          io.to(roomName).emit('user-left', {
            userId,
            timestamp: new Date().toISOString(),
            activeCount,
          });
        }

        console.log(`✅ User ${userId} left challenge ${challengeId}`);
      } catch (error) {
        console.error('Error leaving challenge:', error);
      }
    });

    socket.on('progress-submitted', async (data) => {
      const { challengeId, userId, progress, points } = data;
      const roomName = `challenge-${challengeId}`;

      try {
        const db = getDb();
        if (!db) {
          socket.emit('error', { message: 'Database unavailable' });
          return;
        }

        // Update user's points in challenge leaderboard
        await db
          .collection('challenges')
          .doc(challengeId)
          .collection('leaderboard')
          .doc(userId)
          .update({
            points: Math.max(0, (await db
              .collection('challenges')
              .doc(challengeId)
              .collection('leaderboard')
              .doc(userId)
              .get()).data()?.points || 0) + points,
            updatedAt: new Date(),
          });

        io.to(roomName).emit('leaderboard-update', {
          userId,
          progress,
          points,
          timestamp: new Date().toISOString(),
        });

        console.log(
          `📊 Progress submitted: ${userId} in ${challengeId} (+${points} points)`
        );
      } catch (error) {
        console.error('Error submitting progress:', error);
        socket.emit('error', { message: 'Failed to submit progress' });
      }
    });

    socket.on('request-leaderboard', async (data) => {
      const { challengeId } = data;
      const roomName = `challenge-${challengeId}`;

      try {
        const db = getDb();
        if (!db) {
          socket.emit('error', { message: 'Database unavailable' });
          return;
        }

        const leaderboardSnap = await db
          .collection('challenges')
          .doc(challengeId)
          .collection('leaderboard')
          .orderBy('points', 'desc')
          .limit(50)
          .get();

        const leaderboard = leaderboardSnap.docs.map((doc) => ({
          userId: doc.id,
          ...doc.data(),
        }));

        socket.emit('leaderboard-data', {
          leaderboard,
          challengeId,
          timestamp: new Date().toISOString(),
        });

        console.log(`🏆 Leaderboard sent for ${challengeId}`);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        socket.emit('error', { message: 'Failed to fetch leaderboard' });
      }
    });

    socket.on('subscribe-notifications', async (data) => {
      const { userId } = data;
      const notificationRoom = `notifications-${userId}`;

      try {
        socket.join(notificationRoom);
        console.log(`🔔 User ${userId} subscribed to notifications`);
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });
  });

  return {
    notifyUser: (userId, notification) => {
      io.to(`notifications-${userId}`).emit('notification', notification);
    },
    notifyChallenge: (challengeId, event, data) => {
      io.to(`challenge-${challengeId}`).emit(event, data);
    },
  };
};
