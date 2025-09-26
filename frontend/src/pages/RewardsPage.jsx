import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaGift, FaSearch, FaFilter, FaCoins } from 'react-icons/fa';
import { addNotification } from '../store/slices/uiSlice';

const RewardsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'redeemed'
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching rewards data
    setTimeout(() => {
      const mockRewards = [
        {
          id: '1',
          title: '$10 Amazon Gift Card',
          description: 'Redeem your points for a $10 Amazon gift card that can be used for online purchases.',
          pointsCost: 1000,
          image: '/images/rewards/amazon-gift-card.jpg',
          quantity: 50,
          remaining: 32,
          category: 'Gift Cards'
        },
        {
          id: '2',
          title: 'Premium Fitness Water Bottle',
          description: 'Stay hydrated with this premium 24oz insulated water bottle featuring the FitNova logo.',
          pointsCost: 750,
          image: '/images/rewards/water-bottle.jpg',
          quantity: 100,
          remaining: 45,
          category: 'Merchandise'
        },
        {
          id: '3',
          title: 'One Month Gym Membership',
          description: 'Get a free one-month membership to a participating gym in your area.',
          pointsCost: 2000,
          image: '/images/rewards/gym-membership.jpg',
          quantity: 20,
          remaining: 8,
          category: 'Fitness'
        },
        {
          id: '4',
          title: 'FitNova Premium T-Shirt',
          description: 'Show off your FitNova pride with this comfortable, athletic-fit t-shirt.',
          pointsCost: 500,
          image: '/images/rewards/tshirt.jpg',
          quantity: 200,
          remaining: 120,
          category: 'Merchandise'
        },
        {
          id: '5',
          title: '$25 Sporting Goods Store Gift Card',
          description: 'Use this gift card at any major sporting goods retailer to gear up for your next challenge.',
          pointsCost: 2500,
          image: '/images/rewards/sports-gift-card.jpg',
          quantity: 30,
          remaining: 18,
          category: 'Gift Cards'
        },
        {
          id: '6',
          title: 'Fitness Tracking Smart Watch',
          description: 'Track your steps, heart rate, and more with this premium fitness smart watch.',
          pointsCost: 5000,
          image: '/images/rewards/smart-watch.jpg',
          quantity: 10,
          remaining: 3,
          category: 'Electronics'
        },
        {
          id: '7',
          title: 'Personal Training Session',
          description: 'One hour personal training session with a certified fitness instructor.',
          pointsCost: 1500,
          image: '/images/rewards/personal-training.jpg',
          quantity: 25,
          remaining: 15,
          category: 'Fitness'
        },
        {
          id: '8',
          title: 'FitNova Fitness Backpack',
          description: 'A durable, water-resistant backpack perfect for the gym or outdoor activities.',
          pointsCost: 1200,
          image: '/images/rewards/backpack.jpg',
          quantity: 75,
          remaining: 40,
          category: 'Merchandise'
        }
      ];

      // Add some redeemed rewards for the current user
      const redeemedRewards = [
        {
          ...mockRewards[1],
          id: '101',
          redeemed: true,
          redeemedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          redemptionCode: 'SPIN-WB-12345',
          status: 'delivered'
        },
        {
          ...mockRewards[3],
          id: '102',
          redeemed: true,
          redeemedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          redemptionCode: 'SPIN-TS-67890',
          status: 'delivered'
        }
      ];

      setRewards([...mockRewards, ...redeemedRewards]);
      setUserPoints(1250); // Mock user points
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleRedeemClick = (reward) => {
    if (userPoints < reward.pointsCost) {
      dispatch(addNotification({
        type: 'error',
        message: 'You don\'t have enough points to redeem this reward.'
      }));
      return;
    }

    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const handleRedeemConfirm = () => {
    setRedeemLoading(true);
    
    // Simulate API call to redeem reward
    setTimeout(() => {
      // Update user points
      setUserPoints(prevPoints => prevPoints - selectedReward.pointsCost);
      
      // Update the reward to show as redeemed
      const updatedRewards = rewards.map(reward => {
        if (reward.id === selectedReward.id) {
          return {
            ...reward,
            remaining: reward.remaining - 1
          };
        }
        return reward;
      });
      
      // Add the newly redeemed reward to the list
      const newRedeemedReward = {
        ...selectedReward,
        id: `redeemed-${Date.now()}`,
        redeemed: true,
        redeemedDate: new Date(),
        redemptionCode: `SPIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        status: 'processing'
      };
      
      setRewards([...updatedRewards, newRedeemedReward]);
      
      dispatch(addNotification({
        type: 'success',
        message: 'Reward redeemed successfully!'
      }));
      
      setRedeemLoading(false);
      setShowRedeemModal(false);
    }, 1500);
  };

  const filteredRewards = rewards.filter(reward => {
    // Apply search filter
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    if (filter === 'all') return matchesSearch;
    if (filter === 'available') return matchesSearch && !reward.redeemed;
    if (filter === 'redeemed') return matchesSearch && reward.redeemed;
    
    return matchesSearch;
  });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
        <p className="text-gray-600 mt-1">Redeem your points for exciting rewards</p>
      </div>

      {/* Points Balance Card */}
      <div className="bg-primary-600 text-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Your Points Balance</h2>
            <p className="text-primary-200">Earn more points by completing challenges</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <FaCoins className="text-yellow-300 text-2xl mr-2" />
            <span className="text-3xl font-bold">{userPoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Rewards
            </button>
            <button 
              onClick={() => handleFilterChange('available')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'available' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Available
            </button>
            <button 
              onClick={() => handleFilterChange('redeemed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'redeemed' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Redeemed
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search rewards"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward) => (
              <div key={reward.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative h-48 bg-gray-200">
                  {reward.image ? (
                    <img 
                      src={reward.image} 
                      alt={reward.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaGift className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {reward.redeemed && (
                    <div className="absolute top-0 right-0 bg-success-500 text-white text-xs font-bold px-2 py-1">
                      Redeemed
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center text-white">
                      <FaCoins className="text-yellow-300 mr-1" />
                      <span className="font-bold">{reward.pointsCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{reward.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {reward.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  
                  {reward.redeemed ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Redeemed:</span> {formatDate(reward.redeemedDate)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Code:</span> {reward.redemptionCode}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 ${reward.status === 'delivered' ? 'text-success-600' : 'text-warning-600'}`}>
                          {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Available:</span> {reward.remaining} of {reward.quantity}
                      </div>
                      <button
                        onClick={() => handleRedeemClick(reward)}
                        disabled={userPoints < reward.pointsCost}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${userPoints >= reward.pointsCost ? 'text-white bg-primary-600 hover:bg-primary-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                      >
                        {userPoints >= reward.pointsCost ? 'Redeem Reward' : 'Not Enough Points'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaGift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rewards found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter.' : 'Check back later for new rewards.'}
            </p>
          </div>
        )}
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaGift className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Redeem Reward
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to redeem <span className="font-medium">{selectedReward.title}</span> for <span className="font-medium">{selectedReward.pointsCost.toLocaleString()} points</span>?
                      </p>
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Balance:</span>
                          <span className="font-medium">{userPoints.toLocaleString()} points</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium text-red-600">-{selectedReward.pointsCost.toLocaleString()} points</span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-600">New Balance:</span>
                          <span>{(userPoints - selectedReward.pointsCost).toLocaleString()} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={redeemLoading}
                  onClick={handleRedeemConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redeemLoading ? 'Processing...' : 'Confirm Redemption'}
                </button>
                <button
                  type="button"
                  disabled={redeemLoading}
                  onClick={() => setShowRedeemModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;