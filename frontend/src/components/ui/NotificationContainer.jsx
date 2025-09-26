import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { removeNotification } from '../../store/slices/uiSlice'

const typeIcons = {
  success: <FaCheckCircle className="h-5 w-5 text-success-400" />,
  error: <FaExclamationCircle className="h-5 w-5 text-danger-400" />,
  info: <FaInfoCircle className="h-5 w-5 text-primary-400" />,
  warning: <FaExclamationCircle className="h-5 w-5 text-warning-400" />,
}

const typeClasses = {
  success: 'bg-success-50 border-success-200',
  error: 'bg-danger-50 border-danger-200',
  info: 'bg-primary-50 border-primary-200',
  warning: 'bg-warning-50 border-warning-200',
}

const Notification = ({ notification, onClose }) => {
  const { id, type = 'info', title, message, duration = 5000 } = notification

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border ${typeClasses[type] || typeClasses.info}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{typeIcons[type] || typeIcons.info}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && <p className="text-sm font-medium text-gray-900">{title}</p>}
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const NotificationContainer = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state) => state.ui)

  const handleClose = (id) => {
    dispatch(removeNotification(id))
  }

  if (notifications.length === 0) return null

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={handleClose}
          />
        ))}
      </div>
    </div>
  )
}

export default NotificationContainer