import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCalendarAlt, FaUsers, FaTrophy, FaRunning, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { addNotification } from '../store/slices/uiSlice';

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [progress, setProgress] = useState(0);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Simulate fetching challenge data
    setTimeout(() => {
      const mockChallenge = {
        id,
        title: '10K Steps Daily Challenge',
        description: 'Complete 10,000 steps every day for a week to promote cardiovascular health and build a consistent walking habit. Track your steps using any fitness app or device and log them daily.',
        longDescription: 'Walking 10,000 steps daily has numerous health benefits including improved cardiovascular fitness, enhanced mood, better weight management, and reduced risk of chronic diseases. This challenge encourages you to make walking a regular part of your routine and experience these benefits firsthand. You can split your steps throughout the day - morning walks, lunch breaks, evening strolls - whatever works for your schedule!',
        rules: [
          'Complete 10,000 steps each day for 7 consecutive days',
          'Log your steps daily in the challenge tracker',
          'Steps must be tracked using a fitness app or wearable device',
          'Screenshots or photos of your step count may be required for verification'
        ],
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        category: 'Walking',
        difficulty: 'Moderate',
        pointsReward: 500,
        participantsCount: 248,
        createdBy: 'FitNova Team',
        image: '/images/challenges/10k-steps.jpg'
      };

      const mockParticipants = [
        { id: '1', name: 'Jane Smith', avatar: '/images/avatars/avatar-1.jpg', progress: 85 },
        { id: '2', name: 'John Doe', avatar: '/images/avatars/avatar-2.jpg', progress: 92 },
        { id: '3', name: 'Alice Johnson', avatar: '/images/avatars/avatar-3.jpg', progress: 78 },
        { id: '4', name: 'Robert Brown', avatar: '/images/avatars/avatar-4.jpg', progress: 65 },
        { id: '5', name: 'Emily Davis', avatar: '/images/avatars/avatar-5.jpg', progress: 71 }
      ];

      setChallenge(mockChallenge);
      setParticipants(mockParticipants);
      setIsJoined(true);
      setProgress(71);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleJoinChallenge = () => {
    setIsJoined(true);
    dispatch(addNotification({
      type: 'success',
      message: 'You have successfully joined the challenge!'
    }));
  };

  const handleLeaveChallenge = () => {
    setIsJoined(false);
    dispatch(addNotification({
      type: 'info',
      message: 'You have left the challenge.'
    }));
  };

  const handleLogProgress = (value) => {
    setProgress(value);
    dispatch(addNotification({
      type: 'success',
      message: 'Your progress has been updated!'
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!challenge) return 0;
    const today = new Date();
    const endDate = new Date(challenge.endDate);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      <Link to="/app/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Challenge Header */}
        <div className="relative">
          <div className="h-48 w-full bg-primary-600 flex items-center justify-center">
            {challenge.image ? (
              <img 
                src={challenge.image} 
                alt={challenge.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <FaRunning className="h-24 w-24 text-white opacity-50" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                  {challenge.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{challenge.title}</h1>
            </div>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="p-6">
          <div className="flex flex-wrap -mx-4 mb-6">
            <div className="w-full md:w-1/2 lg:w-2/3 px-4">
              <h2 className="text-xl font-semibold mb-4">About this Challenge</h2>
              <p className="text-gray-700 mb-6">{challenge.longDescription || challenge.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Challenge Rules</h3>
              <ul className="list-disc pl-5 mb-6 text-gray-700">
                {challenge.rules.map((rule, index) => (
                  <li key={index} className="mb-2">{rule}</li>
                ))}
              </ul>

              {isJoined && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Your Progress</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                        Update your progress
                      </label>
                      <input 
                        type="range" 
                        id="progress" 
                        name="progress" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={(e) => handleLogProgress(parseInt(e.target.value))} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primary-600 mr-2" />
                    <span className="text-gray-700 font-medium">Timeline</span>
                  </div>
                  <span className="text-sm text-gray-500">{getDaysRemaining()} days left</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="font-medium">{formatDate(challenge.startDate)}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">End Date</div>
                  <div className="font-medium">{formatDate(challenge.endDate)}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div 
                    className="bg-primary-600 h-1.5 rounded-full" 
                    style={{ width: `${(new Date() - new Date(challenge.startDate)) / (new Date(challenge.endDate) - new Date(challenge.startDate)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FaTrophy className="text-primary-600 mr-2" />
                  <span className="text-gray-700 font-medium">Reward</span>
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-2">{challenge.pointsReward} points</div>
                <p className="text-sm text-gray-500">Complete this challenge to earn points that can be redeemed for rewards.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaUsers className="text-primary-600 mr-2" />
                    <span className="text-gray-700 font-medium">Participants</span>
                  </div>
                  <span className="text-sm text-gray-500">{challenge.participantsCount} joined</span>
                </div>
                <div className="mb-4">
                  <div className="flex -space-x-2 overflow-hidden">
                    {participants.map((participant) => (
                      <div key={participant.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                        {participant.avatar ? (
                          <img 
                            className="h-full w-full rounded-full object-cover" 
                            src={participant.avatar} 
                            alt={participant.name} 
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            {participant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                    {challenge.participantsCount > participants.length && (
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-500 ring-2 ring-white">
                        +{challenge.participantsCount - participants.length}
                      </div>
                    )}
                  </div>
                </div>
                <Link to="/app/leaderboard" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                  View Leaderboard
                </Link>
              </div>

              {isJoined ? (
                <button
                  onClick={handleLeaveChallenge}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Leave Challenge
                </button>
              ) : (
                <button
                  onClick={handleJoinChallenge}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaCheck className="mr-2" />
                  Join Challenge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailPage;