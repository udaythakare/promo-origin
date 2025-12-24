import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function InternalNotifications({userId}) {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/send-internal-notification?limit=50`)
      const data = await response.json()
      
      if (data.notifications) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n) => !n.is_read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/send-internal-notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true, userId })
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Setup realtime subscription
  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'internal_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new
            setNotifications(prev => [newNotification, ...prev])
            setUnreadCount(prev => prev + 1)
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return 'border-green-400 bg-green-50 text-green-800'
      case 'warning': return 'border-yellow-400 bg-yellow-50 text-yellow-800'
      case 'error': return 'border-red-400 bg-red-50 text-red-800'
      default: return 'border-blue-400 bg-blue-50 text-blue-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-yellow-200 border-b-4 border-black">
            <h3 className="font-bold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-2 py-1 bg-green-300 border-2 border-black text-sm font-bold hover:bg-green-400 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-yellow-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-black border-t-yellow-400 rounded-full mx-auto"></div>
                <p className="mt-2 font-bold">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="font-bold text-gray-600">No notifications yet!</p>
              </div>
            ) : (
              <div className="divide-y-4 divide-black">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${!notification.is_read ? 'bg-yellow-50' : 'bg-white'} hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {notification.title && (
                          <h4 className="font-bold text-sm mb-1 truncate">
                            {notification.title}
                          </h4>
                        )}
                        <p className="text-sm break-words mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-bold border-2 border-black ${getTypeStyles(notification.type)}`}>
                            {notification.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-600 font-medium">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="p-1 bg-green-300 border-2 border-black hover:bg-green-400 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <div className={`w-3 h-3 rounded-full border-2 border-black ${!notification.is_read ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-100 border-t-4 border-black text-center">
              <p className="text-sm font-bold text-gray-600">
                {unreadCount} unread of {notifications.length} total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}