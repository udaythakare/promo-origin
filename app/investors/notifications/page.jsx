"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { getNotifications } from "@/app/actions/notifications/getNotifications";
import { markAsRead } from "@/app/actions/notifications/markAsRead";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";

export default function InvestorNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 Load Existing Notifications */
  useEffect(() => {
    async function load() {
      const data = await getNotifications();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  /* 🔹 Realtime Subscription */
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("investor_notifications_page")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "internal_notifications",
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleMarkAsRead(id) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            Stay updated with your latest activity
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell size={18} />
          <span>{unreadCount} Unread</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading notifications...
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No notifications yet.
          </div>
        )}

        {!loading &&
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-5 border-b cursor-pointer transition hover:bg-gray-50 ${
                !n.is_read ? "bg-green-50" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                </div>

                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
