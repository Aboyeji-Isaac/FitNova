import { useEffect, useState } from 'react';
import { FiArrowLeft, FiLoader, FiMedal } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { leaderboard as leaderboardApi } from '../../services/backendApi';
import { onLeaderboardUpdate, requestLeaderboard } from '../../services/socketClient';

export default function LeaderboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();

    const handleUpdate = (data) => {
      console.log('Leaderboard updated:', data);
      fetchLeaderboard();
    };

    if (id) {
      requestLeaderboard(id);
      onLeaderboardUpdate(handleUpdate);
    }

    return () => {
      // Cleanup if needed
    };
  }, [id, user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        const response = await leaderboardApi.getByChallenge(id, 100);
        setLeaderboardData(response.data.leaderboard || []);

        if (user) {
          const rankResponse = await leaderboardApi.getUserRank(id, user.uid);
          setUserRank(rankResponse.data);
        }
      } else {
        const response = await leaderboardApi.getGlobal(100);
        setLeaderboardData(response.data.leaderboard || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {id && (
          <button
            onClick={() => navigate(`/challenges/${id}`)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <FiArrowLeft className="mr-2" />
            Back to challenge
          </button>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <FiMedal className="mr-3 text-yellow-500" />
            {id ? 'Challenge Leaderboard' : 'Global Leaderboard'}
          </h1>
          <p className="text-lg text-gray-600">
            {leaderboardData.length} competitors
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {userRank && (
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">YOUR RANK</p>
                <p className="text-3xl font-bold text-blue-600">{userRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm font-semibold">POINTS</p>
                <p className="text-3xl font-bold text-blue-600">{userRank.points}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboardData.map((entry, idx) => (
                  <tr
                    key={entry.userId || idx}
                    className={`hover:bg-gray-50 transition-colors ${
                      userRank?.userId === entry.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-lg font-bold text-gray-900">
                      <div className="flex items-center">
                        {getMedalIcon(entry.rank)}
                        <span className="ml-2">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">
                        {entry.displayName || `User ${entry.userId?.slice(0, 8)}`}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-blue-600">
                        {entry.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboardData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No participants yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
