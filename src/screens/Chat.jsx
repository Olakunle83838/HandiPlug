import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar } from "../components/UI";
import TopNav from "../components/TopNav";
import { StatusPill } from "../components/DesktopExtras";

const initialMessages = [
  { from: "them", text: "Hello, I got your booking request." },
  { from: "me", text: "Great — can you come by 2pm on Thursday?" },
];

const conversations = [
  { id: 1, name: "Ifeanyi Obi", preview: "Great — can you come...", active: true },
  { id: 2, name: "Tunde Bakare", preview: "Job marked complete" },
];

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "me", text: input }]);
    setInput("");
  };

  const Bubbles = () => (
    <div className="flex-1 overflow-y-auto px-6 md:px-7 py-5 flex flex-col gap-3">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[75%] md:max-w-[420px] rounded-2xl px-4 py-3 text-[15px] ${
              m.from === "me" ? "bg-[#FF7A00] text-white rounded-br-sm" : "bg-[#F5F6F8] text-[#1F2937] rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );

  const Composer = () => (
    <div className="flex items-center gap-3 px-6 md:px-7 py-4 border-t border-[#E5E7EB]">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Message..."
        className="flex-1 border border-[#E5E7EB] rounded-[10px] h-[52px] px-4 outline-none focus:border-[#FF7A00] text-[16px]"
      />
      <button onClick={send} className="bg-[#FF7A00] rounded-[10px] h-[52px] px-6 flex items-center justify-center text-white text-sm font-semibold shrink-0">
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
            <p className="text-[#1F2937] font-semibold">Ifeanyi Obi</p>
            <p className="text-[#22C55E] text-xs">● Online</p>
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
            {conversations.map((c) => (
              <button
                key={c.id}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-left ${
                  c.active ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]"
                }`}
              >
                <Avatar size={38} />
                <div className="min-w-0">
                  <p className="text-[#1F2937] text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-[#6B7280] text-xs truncate">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-3 px-7 py-4 border-b border-[#E5E7EB]">
              <Avatar size={38} />
              <div>
                <p className="text-[#1F2937] font-semibold">Ifeanyi Obi</p>
                <p className="text-[#22C55E] text-xs">● Online</p>
              </div>
            </div>
            {Bubbles()}
            {Composer()}
          </div>

          <div className="w-[260px] shrink-0 border-l border-[#E5E7EB] py-6 px-5 flex flex-col gap-3">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">BOOKING DETAILS</p>
            <p className="text-[#1F2937] text-sm">Rewire kitchen sockets</p>
            <p className="text-[#1F2937] text-sm">Thu, 2:00 PM</p>
            <p className="text-[#1F2937] text-sm">Lekki Phase 1</p>
            <StatusPill status="Pending" />
          </div>
        </div>
      </div>
    </div>
  );
}
