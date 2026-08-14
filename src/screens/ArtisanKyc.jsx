import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, TextInput } from "../components/UI";
import TopNav from "../components/TopNav";
import { PendingBadge } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function ArtisanKyc() {
  const navigate = useNavigate();
  const { token, isAuthed } = useAuth();
  const fileRef = useRef(null);
  const [docType, setDocType] = useState("National ID (NIN)");
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const doUpload = async () => {
    setError("");
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", docType);
      const res = await api.submitKyc(formData, token);
      setUploaded((u) => [...u, res.submission]);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const DocTypeField = () => (
    <div className="flex flex-col gap-2">
      <Label>Document Type</Label>
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        className="w-full border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px] text-[#1F2937] text-[16px] outline-none focus:border-[#FF7A00]"
      >
        <option>National ID (NIN)</option>
        <option>Trade Certification</option>
        <option>Proof of Address</option>
      </select>
    </div>
  );

  const UploadZone = ({ tall = false }) => (
    <div className={`border-2 border-dashed border-[#E5E7EB] rounded-2xl w-full flex flex-col items-center justify-center gap-2 text-center px-6 ${tall ? "h-[208px]" : "h-[160px]"}`}>
      <span className="text-3xl">📄</span>
      <span className="text-[#1F2937] text-sm font-semibold">
        {file ? file.name : "Upload relevant document for verification"}
      </span>
      <span className="text-[#9CA3AF] text-xs">PNG, JPG or PDF · Max 5MB</span>
      <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handlePick} className="hidden" />
      <button
        onClick={() => fileRef.current?.click()}
        className="bg-[#F5F6F8] text-[#1F2937] text-sm font-semibold rounded-[10px] px-5 py-2 mt-1"
      >
        Choose File
      </button>
    </div>
  );

  const DocRow = ({ doc }) => (
    <div className="flex items-center justify-between border border-[#E5E7EB] rounded-xl px-4 h-[68px]">
      <span className="flex items-center gap-3 text-[#1F2937] text-sm">
        <span className="size-9 rounded-lg bg-[#F5F6F8] flex items-center justify-center text-lg">📎</span>
        <span>
          <span className="block font-medium">{doc.originalName}</span>
          <span className="block text-[#6B7280] text-xs">{doc.documentType}</span>
        </span>
      </span>
      <PendingBadge />
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-4">
          <div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Verify Your Identity</h1>
            <p className="text-[#6B7280] text-sm mt-2">
              HandiPlug requires ID verification (FR-03) to keep the platform safe for everyone.
            </p>
          </div>
          <DocTypeField />
          <UploadZone />
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          <button onClick={doUpload} disabled={loading} className="h-11 rounded-[10px] bg-[#0F2A44] text-white text-sm font-semibold disabled:opacity-50">
            {loading ? "Uploading..." : "Upload Document"}
          </button>
          {uploaded.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Uploaded documents</Label>
              {uploaded.map((d) => <DocRow key={d.id} doc={d} />)}
            </div>
          )}
        </div>
        <div className="p-6">
          <Button onClick={() => navigate("/artisan/dashboard")}>Continue to Dashboard</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <div className="hidden md:flex items-center justify-between h-[72px] px-12 border-b border-[#E5E7EB] w-full shrink-0">
          <div className="w-10" />
          <PendingBadge>⏳ Verification Pending</PendingBadge>
        </div>
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="flex gap-16 max-w-[1300px] mx-auto">
            <div className="w-[340px] shrink-0 flex flex-col gap-5">
              <h1 className="text-[#1F2937] text-2xl font-bold">Verify Your Identity</h1>
              <p className="text-[#6B7280] text-sm">
                Upload a real document (it's saved to the server's /uploads folder) to unlock
                your Verified badge and start receiving bookings from customers.
              </p>
              <div className="border border-[#E5E7EB] rounded-2xl p-4">
                <p className="text-[#1F2937] text-sm font-semibold">Accepted documents</p>
                <p className="text-[#6B7280] text-sm mt-1">
                  National ID (NIN), Trade Certification, or Proof of Address.
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <DocTypeField />
                <TextInput label="ID / Cert Number" placeholder="e.g. 12345678901" />
              </div>
              <UploadZone tall />
              {error && <p className="text-[#EF4444] text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={doUpload} disabled={loading} className="h-11 px-6 rounded-[10px] bg-[#0F2A44] text-white text-sm font-semibold disabled:opacity-50">
                  {loading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
              {uploaded.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Uploaded documents</Label>
                  {uploaded.map((d) => <DocRow key={d.id} doc={d} />)}
                </div>
              )}
              <Button className="max-w-[220px]" onClick={() => navigate("/artisan/dashboard")}>
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
