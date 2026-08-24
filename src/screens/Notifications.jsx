import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace } from "../components/UI";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

function NotifRow({ n, onClick }) {
  // If it's a booking notification, use a standard icon if not provided
  const icon = n.icon || (n.type === 'booking_status' ? '📅' : '🔔');
  
  // Format the time slightly better than raw timestamp if needed
  const time = new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      onClick={onClick}
      className={`flex gap-3 items-start border rounded-2xl p-4 cursor-pointer transition-colors ${
        n.isRead ? "border-[#E5E7EB] bg-white hover:bg-gray-50" : "border-[#1C4CD1] bg-[#EEF2FF]"
      }`}
    >
      <div className="size-10 md:size-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-lg md:text-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${n.isRead ? "text-[#1F2937] font-medium" : "text-[#1C4CD1] font-bold"}`}>
          {n.title}
        </p>
        <p className={`text-xs mt-0.5 md:mt-1 ${n.isRead ? "text-[#6B7280]" : "text-[#4B5563]"}`}>
          {n.message}
        </p>
      </div>
      <span className="text-[#9CA3AF] text-[10px] md:text-xs shrink-0 whitespace-nowrap ml-2">
        {time}
      </span>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    api.getNotifications(token)
      .then(res => {
        if (isMounted) {
          setNotifications(res.notifications || []);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [token]);

  const handleNotificationClick = async (n) => {
    // Navigate safely if there's a link
    if (n.link) {
      navigate(n.link);
    }
    
    // Mark as read in backend if unread
    if (!n.isRead) {
      try {
        await api.markNotificationRead(n.id, token);
        setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif));
      } catch (err) {
        // Just silently fail marking read rather than crashing UX
        console.error("Failed to mark read:", err);
      }
    }
  };

  const Content = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#EF4444] font-semibold">Failed to load notifications</p>
          <p className="text-[#6B7280] text-sm mt-2">{error}</p>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#1F2937] font-semibold text-lg">No notifications yet</p>
          <p className="text-[#6B7280] text-sm mt-2">We'll let you know when something needs your attention.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {notifications.map((n) => (
          <NotifRow key={n.id} n={n} onClick={() => handleNotificationClick(n)} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2 pb-4">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Notifications</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-6">
          <Content />
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant={user?.role === "artisan" ? "artisan" : "app"} />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[720px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Notifications</h1>
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}