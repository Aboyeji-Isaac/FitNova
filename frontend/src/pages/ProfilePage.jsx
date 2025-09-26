import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEdit, FaCamera, FaMedal, FaTrophy, FaChartLine, FaCalendarAlt, FaLock } from 'react-icons/fa';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'achievements', 'stats', 'settings'
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      const mockProfileData = {
        id: '123',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Fitness enthusiast and marathon runner. Love challenging myself with new fitness goals every month.',
        location: 'San Francisco, CA',
        joinedDate: new Date(2023, 2, 15), // March 15, 2023
        socialLinks: {
          twitter: 'alexj',
          instagram: 'alex.fitness',
          facebook: 'alex.johnson.fitness'
        },
        stats: {
          totalPoints: 2750,
          rank: 42,
          challengesCompleted: 15,
          challengesInProgress: 2,
          daysActive: 87,
          longestStreak: 21
        },
        achievements: [
          {
            id: '1',
            title: 'Early Bird',
            description: 'Complete 10 morning workouts',
            icon: '🌅',
            earnedDate: new Date(2023, 3, 10),
            progress: 100
          },
          {
            id: '2',
            title: 'Marathon Finisher',
            description: 'Complete a full marathon challenge',
            icon: '🏃',
            earnedDate: new Date(2023, 5, 22),
            progress: 100
          },
          {
            id: '3',
            title: 'Nutrition Master',
            description: 'Log healthy meals for 30 consecutive days',
            icon: '🥗',
            earnedDate: new Date(2023, 7, 5),
            progress: 100
          },
          {
            id: '4',
            title: 'Strength Builder',
            description: 'Complete 20 strength training sessions',
            icon: '💪',
            earnedDate: null,
            progress: 75
          },
          {
            id: '5',
            title: 'Yoga Guru',
            description: 'Complete 15 yoga sessions',
            icon: '🧘',
            earnedDate: null,
            progress: 60
          },
          {
            id: '6',
            title: 'Social Butterfly',
            description: 'Invite 5 friends to join challenges',
            icon: '🦋',
            earnedDate: null,
            progress: 40
          }
        ],
        recentActivities: [
          {
            id: '1',
            type: 'challenge_joined',
            challenge: {
              id: '101',
              title: '30-Day Morning Run'
            },
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            type: 'achievement_earned',
            achievement: {
              id: '3',
              title: 'Nutrition Master'
            },
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            type: 'challenge_completed',
            challenge: {
              id: '102',
              title: 'Summer Fitness Challenge'
            },
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          }
        ]
      };
      
      setProfileData(mockProfileData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Simulate API call to update profile
    setTimeout(() => {
      setEditMode(false);
      // Show success notification
    }, 1000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
          <button className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full text-gray-700 hover:bg-opacity-100">
            <FaCamera className="h-5 w-5" />
          </button>
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img 
                src={profileData.avatar} 
                alt={profileData.name} 
                className="w-32 h-32 rounded-full border-4 border-white" 
              />
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-gray-700 hover:bg-gray-100 border border-gray-200">
                <FaCamera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-6 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-gray-600">{profileData.location}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {formatDate(profileData.joinedDate)}</p>
            </div>
            <button 
              onClick={handleEditToggle}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaEdit className="-ml-1 mr-2 h-4 w-4" />
              Edit Profile
            </button>
          </div>
          <p className="mt-4 text-gray-700">{profileData.bio}</p>
          <div className="mt-4 flex space-x-4">
            {profileData.socialLinks.twitter && (
              <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            )}
            {profileData.socialLinks.instagram && (
              <a href={`https://instagram.com/${profileData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {profileData.socialLinks.facebook && (
              <a href={`https://facebook.com/${profileData.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => handleTabChange('profile')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaUser className="inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => handleTabChange('achievements')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'achievements' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaMedal className="inline-block mr-2" />
              Achievements
            </button>
            <button
              onClick={() => handleTabChange('stats')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaChartLine className="inline-block mr-2" />
              Stats
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaLock className="inline-block mr-2" />
              Account Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              {editMode ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        defaultValue={profileData.name}
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea 
                        id="bio" 
                        name="bio" 
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        defaultValue={profileData.bio}
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input 
                        type="text" 
                        id="location" 
                        name="location" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        defaultValue={profileData.location}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">@</span>
                          <input 
                            type="text" 
                            id="twitter" 
                            name="twitter" 
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={profileData.socialLinks.twitter}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">@</span>
                          <input 
                            type="text" 
                            id="instagram" 
                            name="instagram" 
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={profileData.socialLinks.instagram}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">facebook.com/</span>
                          <input 
                            type="text" 
                            id="facebook" 
                            name="facebook" 
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={profileData.socialLinks.facebook}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {profileData.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          {activity.type === 'challenge_joined' && <FaCalendarAlt />}
                          {activity.type === 'achievement_earned' && <FaMedal />}
                          {activity.type === 'challenge_completed' && <FaTrophy />}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'challenge_joined' && `Joined the ${activity.challenge.title}`}
                            {activity.type === 'achievement_earned' && `Earned the ${activity.achievement.title} achievement`}
                            {activity.type === 'challenge_completed' && `Completed the ${activity.challenge.title}`}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                        {achievement.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      {achievement.earnedDate ? (
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaMedal className="mr-1" /> Earned
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(achievement.earnedDate)}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full" 
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Total Points</h3>
                  <p className="text-3xl font-bold text-primary-600">{profileData.stats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Current Rank</h3>
                  <p className="text-3xl font-bold text-primary-600">#{profileData.stats.rank}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Challenges Completed</h3>
                  <p className="text-3xl font-bold text-primary-600">{profileData.stats.challengesCompleted}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Challenges In Progress</h3>
                  <p className="text-3xl font-bold text-primary-600">{profileData.stats.challengesInProgress}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Days Active</h3>
                  <p className="text-3xl font-bold text-primary-600">{profileData.stats.daysActive}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Longest Streak</h3>
                  <p className="text-3xl font-bold text-primary-600">{profileData.stats.longestStreak} days</p>
                </div>
              </div>
              
              {/* Additional stats visualizations would go here */}
              <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Heatmap</h3>
                <p className="text-gray-500">Activity visualization would be displayed here...</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Email Address</h3>
                  <div className="flex items-center">
                    <p className="text-gray-700 mr-4">{profileData.email}</p>
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Change</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <FaLock className="-ml-1 mr-2 h-4 w-4" />
                    Change Password
                  </button>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          name="email_notifications"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive emails about your activity, challenges, and achievements.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="push_notifications"
                          name="push_notifications"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="push_notifications" className="font-medium text-gray-700">Push Notifications</label>
                        <p className="text-gray-500">Receive push notifications on your device.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing_emails"
                          name="marketing_emails"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketing_emails" className="font-medium text-gray-700">Marketing Emails</label>
                        <p className="text-gray-500">Receive emails about new features, promotions, and updates.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="profile_visibility"
                          name="profile_visibility"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="profile_visibility" className="font-medium text-gray-700">Public Profile</label>
                        <p className="text-gray-500">Make your profile visible to other users.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="activity_visibility"
                          name="activity_visibility"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="activity_visibility" className="font-medium text-gray-700">Activity Visibility</label>
                        <p className="text-gray-500">Allow others to see your activity and achievements.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;