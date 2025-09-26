import { FaHeart, FaRunning } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <FaRunning className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-gray-700 font-medium">FitNova Challenge</span>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-500 flex items-center">
            <span>Made with</span>
            <FaHeart className="h-3 w-3 text-danger-500 mx-1" />
            <span>© {currentYear} FitNova. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer