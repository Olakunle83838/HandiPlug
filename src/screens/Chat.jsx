import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar } from "../components/UI";

const initialMessages = [
  { from: "them", text: "Hello, I got your booking request." },
  { from: "me", text: "Great — can you come by 2pm on Thursday?" },
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

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#E5E7EB]">
        <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">
          ‹
        </button>
        <Avatar size={40} />
        <div>
          <p className="text-[#1F2937] font-semibold">Ifeanyi Obi</p>
          <p className="text-[#22C55E] text-xs">● Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] ${
                m.from === "me"
                  ? "bg-[#FF7A00] text-white rounded-br-sm"
                  : "bg-[#F5F6F8] text-[#1F2937] rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E7EB]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message..."
          className="flex-1 border border-[#E5E7EB] rounded-[10px] h-[52px] px-4 outline-none focus:border-[#FF7A00] text-[16px]"
        />
        <button
          onClick={send}
          className="bg-[#FF7A00] rounded-[10px] size-[52px] flex items-center justify-center text-white text-lg shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
