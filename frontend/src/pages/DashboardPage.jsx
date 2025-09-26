import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRunning, FaTrophy, FaGift, FaChartLine } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    points: 0,
    completedChallenges: 0,
    activeChallenges: 0,
    redeemedRewards: 0
  });
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        points: 1250,
        completedChallenges: 8,
        activeChallenges: 3,
        redeemedRewards: 5
      });

      setActiveChallenges([
        {
          id: '1',
          title: '10K Steps Daily',
          description: 'Complete 10,000 steps every day for a week',
          progress: 71,
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          pointsReward: 500,
          category: 'Walking'
        },
        {
          id: '2',
          title: 'Morning Yoga',
          description: 'Complete a 15-minute yoga session every morning for 10 days',
          progress: 40,
          endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          pointsReward: 300,
          category: 'Yoga'
        },
        {
          id: '3',
          title: 'Hydration Hero',
          description: 'Drink 8 glasses of water daily for 2 weeks',
          progress: 85,
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          pointsReward: 400,
          category: 'Wellness'
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'challenge_progress',
          title: 'Made progress on 10K Steps Daily',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          details: 'Completed 8,500 steps'
        },
        {
          id: '2',
          type: 'challenge_completed',
          title: 'Completed Weekend Warrior Challenge',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          details: 'Earned 350 points'
        },
        {
          id: '3',
          type: 'reward_redeemed',
          title: 'Redeemed $10 Gift Card',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          details: 'Used 1000 points'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.displayName || 'User'}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your fitness journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-primary-100 p-3 mr-4">
            <FaChartLine className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Points</p>
            <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-secondary-100 p-3 mr-4">
            <FaTrophy className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Completed Challenges</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedChallenges}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-success-100 p-3 mr-4">
            <FaRunning className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Challenges</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeChallenges}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-warning-100 p-3 mr-4">
            <FaGift className="h-6 w-6 text-warning-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Redeemed Rewards</p>
            <p className="text-2xl font-bold text-gray-900">{stats.redeemedRewards}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Challenges */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Active Challenges</h2>
              <Link to="/app/challenges" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {activeChallenges.length > 0 ? (
                <div className="space-y-6">
                  {activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{challenge.title}</h3>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {challenge.category}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Ends on {formatDate(challenge.endDate)}</span>
                        <span className="font-medium text-primary-600">{challenge.pointsReward} points</span>
                      </div>
                      <div className="mt-4">
                        <Link 
                          to={`/app/challenges/${challenge.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any active challenges.</p>
                  <Link 
                    to="/app/challenges"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Browse Challenges
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== recentActivity.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                activity.type === 'challenge_progress' ? 'bg-primary-500' :
                                activity.type === 'challenge_completed' ? 'bg-success-500' :
                                'bg-warning-500'
                              }`}>
                                {activity.type === 'challenge_progress' && <FaRunning className="h-4 w-4 text-white" />}
                                {activity.type === 'challenge_completed' && <FaTrophy className="h-4 w-4 text-white" />}
                                {activity.type === 'reward_redeemed' && <FaGift className="h-4 w-4 text-white" />}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.details}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={activity.date.toISOString()}>{getTimeAgo(activity.date)}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity to display.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Quick Links</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/app/challenges"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FaRunning className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Challenges</span>
                </Link>
                <Link 
                  to="/app/rewards"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FaGift className="h-6 w-6 text-warning-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Rewards</span>
                </Link>
                <Link 
                  to="/app/leaderboard"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FaTrophy className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Leaderboard</span>
                </Link>
                <Link 
                  to="/app/profile"
                  className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FaChartLine className="h-6 w-6 text-success-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">My Progress</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;