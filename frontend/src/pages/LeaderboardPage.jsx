import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrophy, FaMedal, FaSearch } from 'react-icons/fa';

const LeaderboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all-time'); // 'all-time', 'monthly', 'weekly'

  useEffect(() => {
    // Simulate fetching leaderboard data
    setTimeout(() => {
      const mockLeaderboard = [
        { id: '1', name: 'Jane Smith', avatar: '/images/avatars/avatar-1.jpg', points: 12500, completedChallenges: 25, rank: 1 },
        { id: '2', name: 'John Doe', avatar: '/images/avatars/avatar-2.jpg', points: 10800, completedChallenges: 22, rank: 2 },
        { id: '3', name: 'Alice Johnson', avatar: '/images/avatars/avatar-3.jpg', points: 9750, completedChallenges: 20, rank: 3 },
        { id: '4', name: 'Robert Brown', avatar: '/images/avatars/avatar-4.jpg', points: 8900, completedChallenges: 18, rank: 4 },
        { id: '5', name: 'Emily Davis', avatar: '/images/avatars/avatar-5.jpg', points: 8200, completedChallenges: 17, rank: 5 },
        { id: '6', name: 'Michael Wilson', avatar: '/images/avatars/avatar-6.jpg', points: 7800, completedChallenges: 16, rank: 6 },
        { id: '7', name: 'Sarah Martinez', avatar: '/images/avatars/avatar-7.jpg', points: 7200, completedChallenges: 15, rank: 7 },
        { id: '8', name: 'David Anderson', avatar: '/images/avatars/avatar-8.jpg', points: 6900, completedChallenges: 14, rank: 8 },
        { id: '9', name: 'Lisa Thomas', avatar: '/images/avatars/avatar-9.jpg', points: 6500, completedChallenges: 13, rank: 9 },
        { id: '10', name: 'James Taylor', avatar: '/images/avatars/avatar-10.jpg', points: 6200, completedChallenges: 12, rank: 10 },
        // Add the current user somewhere in the leaderboard
        { id: user?.id || 'current', name: user?.displayName || 'You', avatar: user?.photoURL || null, points: 7500, completedChallenges: 15, rank: 7, isCurrentUser: true }
      ];

      // Sort by points (highest first)
      mockLeaderboard.sort((a, b) => b.points - a.points);
      
      // Update ranks after sorting
      mockLeaderboard.forEach((user, index) => {
        user.rank = index + 1;
      });

      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1000);
  }, [user, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    // In a real app, this would trigger a new API call with the filter
  };

  const filteredLeaderboard = leaderboard.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserRank = leaderboard.find(u => u.isCurrentUser)?.rank || 'N/A';

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-500'; // Gold
      case 2: return 'text-gray-400'; // Silver
      case 3: return 'text-amber-700'; // Bronze
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-1">See how you rank against other participants</p>
      </div>

      {/* User's Rank Card */}
      <div className="bg-primary-600 text-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-white" 
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-300 flex items-center justify-center text-primary-800 text-xl font-bold border-2 border-white">
                  {user?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.displayName || 'You'}</h2>
              <p className="text-primary-200">Your current rank</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-center px-6">
              <div className="text-3xl font-bold">{currentUserRank}</div>
              <p className="text-primary-200">Rank</p>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-bold">{leaderboard.find(u => u.isCurrentUser)?.points || 0}</div>
              <p className="text-primary-200">Points</p>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-bold">{leaderboard.find(u => u.isCurrentUser)?.completedChallenges || 0}</div>
              <p className="text-primary-200">Challenges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button 
              onClick={() => handleFilterChange('all-time')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all-time' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Time
            </button>
            <button 
              onClick={() => handleFilterChange('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'monthly' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => handleFilterChange('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'weekly' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              This Week
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Challenges Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaderboard.map((user) => (
                <tr key={user.id} className={user.isCurrentUser ? 'bg-primary-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.rank <= 3 ? (
                        <FaTrophy className={`mr-2 ${getMedalColor(user.rank)}`} />
                      ) : (
                        <span className="text-gray-900 font-medium">{user.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name} {user.isCurrentUser && '(You)'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.points.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.completedChallenges}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;