import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, TextInput, Button, Label } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function PayoutDetails() {
  const navigate = useNavigate();
  const { token, user, isAuthed } = useAuth();
  const [bankName, setBankName] = useState(user?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(user?.accountNumber || "");
  const [accountName, setAccountName] = useState(user?.accountName || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMessage("");
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await api.updateProfile({ bankName, accountNumber, accountName }, token);
      setMessage("Payout details saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <div className="flex flex-col gap-4">
      <Label>Bank Details</Label>
      <TextInput label="Bank Name" placeholder="e.g. GTBank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
      <TextInput label="Account Number" placeholder="0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
      <TextInput label="Account Name" placeholder="As it appears on your bank account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
      {message && <p className="text-[#22C55E] text-sm">{message}</p>}
      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
      <Button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Save Payout Details"}</Button>
      <p className="text-[#9CA3AF] text-xs">
        This is where your HandiPlug earnings will be sent after each completed job.
      </p>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Payout Details</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          {Form()}
        </div>
        <BottomNav role="artisan" />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-10 flex justify-center">
          <div className="w-full max-w-[480px]">
            <h1 className="text-[#1F2937] text-2xl font-bold mb-6">Payout Details</h1>
            {Form()}
          </div>
        </div>
      </div>
    </div>
  );
}
