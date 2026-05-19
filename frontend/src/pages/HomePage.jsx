import { FaArrowRight, FaFire, FaGift, FaRunning, FaTrophy, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="badge badge-primary flex items-center gap-2 w-fit">
                  <FaFire className="w-4 h-4" />
                  FitNova Challenge
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-tight">
                <span className="text-primary-500">Challenge</span> Yourself
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl">
                Join the ultimate fitness challenge platform. Track your progress, compete globally, and earn epic rewards. Level up your fitness game today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/auth/register"
                  className="btn btn-primary gap-2 group"
                >
                  Start Your Journey
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/auth/login"
                  className="btn btn-outline gap-2"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex gap-6 pt-8 text-sm">
                <div>
                  <p className="text-primary-500 font-bold text-2xl">50K+</p>
                  <p className="text-gray-400">Active Players</p>
                </div>
                <div>
                  <p className="text-primary-500 font-bold text-2xl">100+</p>
                  <p className="text-gray-400">Challenges</p>
                </div>
                <div>
                  <p className="text-primary-500 font-bold text-2xl">$1M+</p>
                  <p className="text-gray-400">Rewards</p>
                </div>
              </div>
            </div>

            {/* Right Side - Retro Card */}
            <div className="hidden md:flex justify-center">
              <div className="gaming-panel w-full max-w-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary-500 font-bold text-sm uppercase tracking-widest">FitNova v1.0</p>
                      <p className="text-gray-400 text-xs">Gaming Protocol</p>
                    </div>
                    <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
                  </div>
                  
                  <div className="border border-dark-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">STATUS</span>
                      <span className="text-primary-500 font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">PLAYERS</span>
                      <span className="text-secondary-400 font-bold">50,000</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">ACTIVE NOW</span>
                      <span className="text-success-400 font-bold">12,345</span>
                    </div>
                  </div>

                  <button className="w-full btn btn-primary uppercase tracking-widest">
                    Enter Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-dark-card/50 border-t border-dark-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              How <span className="text-primary-500">FitNova</span> Works
            </h2>
            <p className="text-gray-400 text-lg">
              Four simple steps to dominate the fitness arena
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaUsers,
                title: 'Join Community',
                desc: 'Sign up and join thousands of fitness warriors competing globally.'
              },
              {
                icon: FaRunning,
                title: 'Complete Challenges',
                desc: 'Participate in diverse fitness challenges tailored to your level.'
              },
              {
                icon: FaTrophy,
                title: 'Track Progress',
                desc: 'Monitor your stats and see your ranking on live leaderboards.'
              },
              {
                icon: FaGift,
                title: 'Earn Rewards',
                desc: 'Collect points and redeem them for exclusive rewards and badges.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="card-hover group">
                <div className="p-6 space-y-4 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-lg bg-primary-500 text-black flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <feature.icon />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wider">{feature.title}</h3>
                  <p className="text-gray-400 flex-grow">{feature.desc}</p>
                  <div className="flex items-center text-primary-500 font-bold text-sm group-hover:translate-x-2 transition-transform">
                    Learn More <FaArrowRight className="ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="gaming-panel space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-black">
            Ready to <span className="text-primary-500">Level Up?</span>
          </h2>
          <p className="text-xl text-gray-300">
            Join the revolution. Challenge yourself. Earn legendary rewards.
          </p>
          <Link
            to="/auth/register"
            className="inline-block btn btn-primary gap-2 group text-lg"
          >
            Start Playing Now
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;