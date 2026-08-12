import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, Button } from "../components/UI";

export default function Rating() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 flex flex-col items-center px-6 pt-4 gap-4">
        <h1 className="text-[#1F2937] text-xl font-bold self-start">Rate your artisan</h1>

        <Avatar size={120} />
        <p className="text-[#1F2937] text-xl font-bold">Tunde Adeyemi</p>
        <p className="text-[#6B7280] text-sm text-center">
          Carpentry. Job completed 22 July, 2026
        </p>

        <div className="flex gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setRating(i)}
              className={`text-4xl ${i <= rating ? "text-[#FACC15]" : "text-[#E5E7EB]"}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us about your experience..."
          rows={5}
          className="w-full border border-[#E5E7EB] rounded-2xl p-4 text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none mt-2"
        />
      </div>
      <div className="p-6">
        <Button onClick={() => navigate("/home")}>Submit Review</Button>
      </div>
    </div>
  );
}
