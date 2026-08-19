import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Avatar } from "../components/UI";
import TopNav from "../components/TopNav";
import { StatusPill } from "../components/DesktopExtras";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  
  const { token, user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!bookingId || !token) return;

    let isMounted = true;
    let pollInterval = null;

    const fetchMessages = async () => {
      try {
        const res = await api.getMessages(bookingId, token);
        if (isMounted) {
          setMessages(res.messages || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted && !messages.length) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    pollInterval = setInterval(fetchMessages, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [bookingId, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending || !bookingId) return;
    const textToSend = input.trim();
    setSending(true);
    
    // Optimistic UI (optional, but requested simple UI refresh after send)
    // We will just wait for the API for safety to get the real ID and dedupe
    
    try {
      await api.sendMessage({ bookingId, text: textToSend }, token);
      setInput("");
      // Immediately fetch latest
      const res = await api.getMessages(bookingId, token);
      setMessages(res.messages || []);
    } catch (err) {
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const Bubbles = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center flex-col px-6 text-center">
          <p className="text-[#EF4444] font-semibold mb-2">Could not load messages</p>
          <p className="text-[#6B7280] text-sm">{error}</p>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#1F2937] font-semibold mb-1">No messages yet</p>
          <p className="text-[#6B7280] text-sm">Send a message to start the conversation.</p>
        </div>
      );
    }

    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-7 py-5 flex flex-col gap-3">
        {messages.map((m) => {
          const isMe = m.senderId === user?.id;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] md:max-w-[420px] rounded-2xl px-4 py-3 text-[15px] ${
                  isMe ? "bg-[#FF7A00] text-white rounded-br-sm" : "bg-[#F5F6F8] text-[#1F2937] rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const Composer = () => (
    <div className="flex items-center gap-3 px-6 md:px-7 py-4 border-t border-[#E5E7EB]">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Message..."
        disabled={loading || sending || !bookingId}
        className="flex-1 border border-[#E5E7EB] rounded-[10px] h-[52px] px-4 outline-none focus:border-[#FF7A00] text-[16px] disabled:opacity-50"
      />
      <button 
        onClick={send} 
        disabled={loading || sending || !input.trim() || !bookingId}
        className="bg-[#FF7A00] rounded-[10px] h-[52px] px-6 flex items-center justify-center text-white text-sm font-semibold shrink-0 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#E5E7EB]">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <Avatar size={40} />
          <div>
            <p className="text-[#1F2937] font-semibold">Conversation</p>
          </div>
        </div>
        {Bubbles()}
        {Composer()}
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[260px] shrink-0 border-r border-[#E5E7EB] py-6 px-3 flex flex-col gap-1">
            <p className="px-3.5 pb-2 text-[#6B7280] text-xs font-bold tracking-[0.2px]">CONVERSATIONS</p>
            {/* Desktop side-list remains a placeholder for MVP since there is no getConversations API yet */}
            <div className="px-3.5 text-sm text-[#9CA3AF]">Select a booking to view chat</div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-3 px-7 py-4 border-b border-[#E5E7EB]">
              <Avatar size={38} />
              <div>
                <p className="text-[#1F2937] font-semibold">Conversation</p>
              </div>
            </div>
            {Bubbles()}
            {Composer()}
          </div>

          <div className="w-[260px] shrink-0 border-l border-[#E5E7EB] py-6 px-5 flex flex-col gap-3">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">BOOKING ID</p>
            <p className="text-[#1F2937] text-sm break-all">{bookingId || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
