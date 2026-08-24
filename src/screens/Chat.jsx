import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Avatar } from "../components/UI";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const { token, user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const scrollRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    api.myBookings(token)
      .then((res) => {
        if (isMounted) setConversations(res.bookings || []);
      })
      .catch((err) => console.error("Failed to load conversations:", err))
      .finally(() => {
        if (isMounted) setConversationsLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);

  useEffect(() => {
    if (!bookingId && conversations.length > 0) {
      setSearchParams({ bookingId: conversations[0].id }, { replace: true });
    }
  }, [bookingId, conversations, setSearchParams]);

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

    setLoading(true);
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

    try {
      await api.sendMessage({ bookingId, text: textToSend }, token);
      setInput("");
      const res = await api.getMessages(bookingId, token);
      setMessages(res.messages || []);
    } catch (err) {
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleImagePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !bookingId) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Please choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Image is too large. Please choose a file under 5MB.");
      return;
    }

    setImageUploading(true);
    try {
      const { path, signedUrl, token: uploadToken } = await api.getMessageUploadUrl(
        { bookingId, fileName: file.name, fileType: file.type },
        token
      );

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .uploadToSignedUrl(path, uploadToken, file, { contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image");
      }

      await api.sendMessage({ bookingId, imagePath: path }, token);
      const res = await api.getMessages(bookingId, token);
      setMessages(res.messages || []);
    } catch (err) {
      alert(err.message || "Failed to send image");
    } finally {
      setImageUploading(false);
    }
  };

  const otherPartyName = (booking) => {
    if (!booking) return "Conversation";
    return user?.role === "artisan" ? booking.customerName : booking.artisanName;
  };

  const activeBooking = conversations.find((b) => b.id === bookingId);

  const ConversationList = ({ onSelect }) => {
    if (conversationsLoading) {
      return <div className="px-3.5 text-sm text-[#9CA3AF]">Loading conversations...</div>;
    }
    if (conversations.length === 0) {
      return <div className="px-3.5 text-sm text-[#9CA3AF]">No bookings yet — conversations appear here once you have one.</div>;
    }
    return conversations.map((b) => (
      <button
        key={b.id}
        onClick={() => onSelect(b.id)}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left ${
          b.id === bookingId ? "bg-[#FFF1E6]" : "hover:bg-[#F5F6F8]"
        }`}
      >
        <Avatar size={36} />
        <div className="min-w-0">
          <p className="text-[#1F2937] text-sm font-semibold truncate">{otherPartyName(b)}</p>
          <p className="text-[#6B7280] text-xs truncate">{b.artisanTrade || b.status}</p>
        </div>
      </button>
    ));
  };

  const MessageBubble = ({ m }) => {
    const isMe = m.senderId === user?.id;
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] md:max-w-[420px] rounded-2xl overflow-hidden ${
            m.imageUrl ? "p-1.5" : "px-4 py-3"
          } text-[15px] ${
            isMe ? "bg-[#FF7A00] text-white rounded-br-sm" : "bg-[#F5F6F8] text-[#1F2937] rounded-bl-sm"
          }`}
        >
          {m.imageUrl && (
            <a href={m.imageUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={m.imageUrl}
                alt="Sent attachment"
                className="rounded-xl max-h-[260px] w-full object-cover"
              />
            </a>
          )}
          {m.text && <div className={m.imageUrl ? "px-2.5 pt-2 pb-1" : ""}>{m.text}</div>}
        </div>
      </div>
    );
  };

  const Bubbles = () => {
    if (!bookingId) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#1F2937] font-semibold mb-1">Select a conversation</p>
          <p className="text-[#6B7280] text-sm">Choose a booking from the list to view its chat.</p>
        </div>
      );
    }

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
        {messages.map((m) => <MessageBubble key={m.id} m={m} />)}
      </div>
    );
  };

  const Composer = () => (
    <div className="flex items-center gap-2.5 px-6 md:px-7 py-4 border-t border-[#E5E7EB]">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImagePick}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        disabled={loading || imageUploading || !bookingId}
        title="Send a photo"
        className="shrink-0 size-[52px] rounded-[10px] border border-[#E5E7EB] flex items-center justify-center text-xl disabled:opacity-50"
      >
        {imageUploading ? (
          <span className="size-4 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
        ) : (
          "📷"
        )}
      </button>
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
        {!bookingId ? (
          <>
            <StatusSpace />
            <div className="flex items-center gap-3 px-6 py-3 border-b border-[#E5E7EB]">
              <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
              <p className="text-[#1F2937] font-semibold text-lg">Messages</p>
            </div>
            <div className="flex-1 overflow-y-auto py-3 px-1 flex flex-col gap-1">
              <ConversationList onSelect={(id) => setSearchParams({ bookingId: id })} />
            </div>
          </>
        ) : (
          <>
            <StatusSpace />
            <div className="flex items-center gap-3 px-6 py-3 border-b border-[#E5E7EB]">
              <button onClick={() => setSearchParams({})} className="text-2xl text-[#1F2937]">‹</button>
              <Avatar size={40} />
              <div>
                <p className="text-[#1F2937] font-semibold">{otherPartyName(activeBooking)}</p>
              </div>
            </div>
            {Bubbles()}
            {Composer()}
          </>
        )}
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant={user?.role === "artisan" ? "artisan" : "app"} />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[260px] shrink-0 border-r border-[#E5E7EB] py-6 px-3 flex flex-col gap-1 overflow-y-auto">
            <p className="px-3.5 pb-2 text-[#6B7280] text-xs font-bold tracking-[0.2px]">CONVERSATIONS</p>
            <ConversationList onSelect={(id) => setSearchParams({ bookingId: id })} />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-3 px-7 py-4 border-b border-[#E5E7EB]">
              <Avatar size={38} />
              <div>
                <p className="text-[#1F2937] font-semibold">{otherPartyName(activeBooking)}</p>
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