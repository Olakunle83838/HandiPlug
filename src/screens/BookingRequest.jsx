import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, TextInput, Button, Label, Avatar, VerifiedBadge, Stars } from "../components/UI";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function BookingRequest() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const artisanId = params.get("id");
  const { token, user } = useAuth();

  const [artisan, setArtisan] = useState({ fullName: "Ifeanyi Obi", trade: "Electrician", area: "Lekki" });
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artisanId) return;
    api.getArtisan(artisanId).then((res) => setArtisan(res.artisan)).catch(() => {});
  }, [artisanId]);

  const submit = async () => {
    setError("");
    if (!token) {
      navigate("/login");
      return;
    }
    if (user?.role !== "customer") {
      setError("Only customer accounts can book artisans. Log in as a customer to continue.");
      return;
    }
    if (!detail) {
      setError("Please describe the job.");
      return;
    }
    setLoading(true);
    try {
      await api.createBooking({ artisanId, detail, date, time, location }, token);
      navigate("/booking-confirmation");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <>
      <div className="flex flex-col gap-2">
        <Label>Job Details</Label>
        <textarea
          rows={4}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Describe the job (e.g. rewire kitchen sockets)..."
          className="border border-[#E5E7EB] rounded-[10px] p-4 text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Date" icon="📅" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextInput label="Time" icon="🕑" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <TextInput label="Location" placeholder="Service address" value={location} onChange={(e) => setLocation(e.target.value)} />
      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-8 gap-5 pb-6">
          <div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Request a Booking</h1>
            <p className="text-[#6B7280] text-sm mt-2">with {artisan.fullName} · {artisan.trade}</p>
          </div>
          {Form()}
          <Button className="mt-2" onClick={submit} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex items-center justify-center gap-16 px-12">
          <div className="w-[300px] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-2">
            <Avatar size={72} />
            <p className="text-[#1F2937] text-lg font-bold mt-2">{artisan.fullName}</p>
            {artisan.verified && <VerifiedBadge />}
            <p className="text-[#6B7280] text-sm">{artisan.trade} · {artisan.area}</p>
            <Stars rating={artisan.rating || 5} />
          </div>
          <div className="w-full max-w-[420px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Request a Booking</h1>
            {Form()}
            <Button className="mt-2" onClick={submit} disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
