import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaFilter, FaImage, FaVideo, FaHeart, FaComment, FaShare } from 'react-icons/fa';

const GalleryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'images', 'videos'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    // Simulate fetching media data
    setTimeout(() => {
      const mockMedia = [
        {
          id: '1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Morning Run Challenge',
          description: 'Completed my 5K morning run challenge!',
          user: {
            id: '101',
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          challenge: {
            id: '201',
            title: '30-Day Morning Run'
          },
          likes: 24,
          comments: 5,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'video',
          url: 'https://player.vimeo.com/external/373803358.sd.mp4?s=4c3c8c954a0fcbff0fc7c3531a3dbe7a6935d4d7&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Yoga Flow Session',
          description: 'My progress on the 21-day yoga challenge. Day 15 complete!',
          user: {
            id: '102',
            name: 'Michael Chen',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          challenge: {
            id: '202',
            title: '21-Day Yoga Challenge'
          },
          likes: 42,
          comments: 8,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Healthy Meal Prep',
          description: 'Week 2 of the nutrition challenge. Prepped all my meals for the week!',
          user: {
            id: '103',
            name: 'Jessica Williams',
            avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
          },
          challenge: {
            id: '203',
            title: 'Clean Eating Challenge'
          },
          likes: 56,
          comments: 12,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'First Marathon Training',
          description: 'Completed my 15-mile long run today. Marathon training is going well!',
          user: {
            id: '104',
            name: 'David Rodriguez',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
          },
          challenge: {
            id: '204',
            title: 'Marathon Training Plan'
          },
          likes: 89,
          comments: 15,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          type: 'video',
          url: 'https://player.vimeo.com/external/459389137.sd.mp4?s=d5892522e2e7b1a114857fa52643181613aa8a56&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'HIIT Workout Session',
          description: 'Day 20 of the 30-day HIIT challenge. Feeling stronger every day!',
          user: {
            id: '105',
            name: 'Emma Thompson',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
          },
          challenge: {
            id: '205',
            title: '30-Day HIIT Challenge'
          },
          likes: 37,
          comments: 6,
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          id: '6',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Mountain Biking Adventure',
          description: 'Conquered the mountain trail challenge today! 20 miles of pure adrenaline.',
          user: {
            id: '106',
            name: 'Alex Parker',
            avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
          },
          challenge: {
            id: '206',
            title: 'Mountain Biking Series'
          },
          likes: 64,
          comments: 9,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: '7',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          thumbnail: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Weightlifting Progress',
          description: 'New personal record on deadlifts today! Strength challenge going strong.',
          user: {
            id: '107',
            name: 'Olivia Martinez',
            avatar: 'https://randomuser.me/api/portraits/women/39.jpg'
          },
          challenge: {
            id: '207',
            title: 'Strength Building Challenge'
          },
          likes: 45,
          comments: 7,
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
        },
        {
          id: '8',
          type: 'video',
          url: 'https://player.vimeo.com/external/477260959.sd.mp4?s=bed3c47e7b14aa9b9e14e94c4c7a73c2a836b761&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
          title: 'Swimming Technique',
          description: 'Working on my freestyle technique for the swimming challenge. Day 10!',
          user: {
            id: '108',
            name: 'James Wilson',
            avatar: 'https://randomuser.me/api/portraits/men/78.jpg'
          },
          challenge: {
            id: '208',
            title: '30-Day Swimming Challenge'
          },
          likes: 29,
          comments: 4,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        }
      ];

      setMedia(mockMedia);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowMediaModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredMedia = media.filter(item => {
    // Apply search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    if (filter === 'all') return matchesSearch;
    if (filter === 'images') return matchesSearch && item.type === 'image';
    if (filter === 'videos') return matchesSearch && item.type === 'video';
    
    return matchesSearch;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Community Gallery</h1>
        <p className="text-gray-600 mt-1">See what others are sharing from their fitness journey</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Media
            </button>
            <button 
              onClick={() => handleFilterChange('images')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'images' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              <FaImage className="inline mr-1" /> Images
            </button>
            <button 
              onClick={() => handleFilterChange('videos')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'videos' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              <FaVideo className="inline mr-1" /> Videos
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search gallery"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          <FaVideo className="text-primary-600 text-xl" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img 
                      src={item.user.avatar} 
                      alt={item.user.name} 
                      className="w-8 h-8 rounded-full mr-2" 
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.user.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <span className="flex items-center">
                        <FaHeart className="mr-1 text-red-500" /> {item.likes}
                      </span>
                      <span className="flex items-center">
                        <FaComment className="mr-1 text-gray-400" /> {item.comments}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.challenge.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No media found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter.' : 'Be the first to share your fitness journey!'}
            </p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {showMediaModal && selectedMedia && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowMediaModal(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowMediaModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 bg-black">
                  {selectedMedia.type === 'video' ? (
                    <video 
                      src={selectedMedia.url} 
                      className="w-full h-full object-contain max-h-[70vh]"
                      controls 
                      autoPlay 
                    />
                  ) : (
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.title} 
                      className="w-full h-full object-contain max-h-[70vh]" 
                    />
                  )}
                </div>
                <div className="md:w-1/3 p-6 overflow-y-auto max-h-[70vh]">
                  <div className="flex items-center mb-4">
                    <img 
                      src={selectedMedia.user.avatar} 
                      alt={selectedMedia.user.name} 
                      className="w-10 h-10 rounded-full mr-3" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedMedia.user.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(selectedMedia.createdAt)}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedMedia.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedMedia.description}</p>
                  
                  <div className="mb-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {selectedMedia.challenge.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <div className="flex space-x-4">
                      <button className="flex items-center text-gray-700 hover:text-red-500">
                        <FaHeart className="mr-1" /> {selectedMedia.likes}
                      </button>
                      <button className="flex items-center text-gray-700 hover:text-blue-500">
                        <FaComment className="mr-1" /> {selectedMedia.comments}
                      </button>
                    </div>
                    <button className="flex items-center text-gray-700 hover:text-green-500">
                      <FaShare className="mr-1" /> Share
                    </button>
                  </div>
                  
                  {/* Comments section would go here */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Comments ({selectedMedia.comments})</h3>
                    <p className="text-sm text-gray-500">Comments would be displayed here...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;