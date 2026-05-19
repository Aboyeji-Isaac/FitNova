import { useEffect, useState } from 'react';
import { FiArrowRight, FiCalendar, FiLoader, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { challenges as challengesApi } from '../../services/backendApi';

export default function ChallengesListPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await challengesApi.getAll();
      setChallenges(response.data.challenges || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Challenges</h1>
          <p className="text-lg text-gray-600">
            Participate in fitness challenges and compete with others
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No active challenges at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 p-6 flex flex-col justify-end">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {challenge.title}
                  </h2>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-2" />
                      <span>
                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUsers className="mr-2" />
                      <span>{challenge.participantCount || 0} participants</span>
                    </div>
                  </div>

                  <Link
                    to={`/challenges/${challenge.id}`}
                    className="inline-flex items-center w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Details
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
