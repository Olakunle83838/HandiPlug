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
  const selfieRef = useRef(null);
  const [docType, setDocType] = useState("National ID (NIN)");
  const [ninNumber, setNinNumber] = useState("");
  const [file, setFile] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [guarantor1, setGuarantor1] = useState({ name: "", phone: "" });
  const [guarantor2, setGuarantor2] = useState({ name: "", phone: "" });
  const [uploaded, setUploaded] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };
  const handleSelfiePick = (e) => {
    const f = e.target.files?.[0];
    if (f) setSelfie(f);
  };

  const doUpload = async () => {
    setError("");
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    if (!file) {
      setError("Choose an ID document first.");
      return;
    }
    if (!guarantor1.name || !guarantor1.phone || !guarantor2.name || !guarantor2.phone) {
      setError("HandiPlug requires 2 guarantors — please fill in both.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      if (selfie) formData.append("selfie", selfie);
      formData.append("documentType", docType);
      formData.append("ninNumber", ninNumber);
      formData.append("guarantor1Name", guarantor1.name);
      formData.append("guarantor1Phone", guarantor1.phone);
      formData.append("guarantor2Name", guarantor2.name);
      formData.append("guarantor2Phone", guarantor2.phone);
      const res = await api.submitKyc(formData, token);
      setUploaded((u) => [...u, res.submission]);
      setFile(null);
      setSelfie(null);
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

  const SelfieZone = () => (
    <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl w-full h-[140px] flex flex-col items-center justify-center gap-2 text-center px-6">
      <span className="text-3xl">🤳</span>
      <span className="text-[#1F2937] text-sm font-semibold">
        {selfie ? selfie.name : "Take or upload a selfie for facial verification"}
      </span>
      <span className="text-[#9CA3AF] text-xs">Matched against your ID photo</span>
      <input ref={selfieRef} type="file" accept="image/png,image/jpeg" capture="user" onChange={handleSelfiePick} className="hidden" />
      <button
        onClick={() => selfieRef.current?.click()}
        className="bg-[#F5F6F8] text-[#1F2937] text-sm font-semibold rounded-[10px] px-5 py-2 mt-1"
      >
        {selfie ? "Retake" : "Take Selfie"}
      </button>
    </div>
  );

  const GuarantorFields = () => (
    <div className="flex flex-col gap-4">
      <Label>Guarantors (2 required)</Label>
      <p className="text-[#9CA3AF] text-xs -mt-2">
        HandiPlug verifies every artisan with NIN, facial verification, and 2
        guarantors who can vouch for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Guarantor 1 Name" placeholder="Full name" value={guarantor1.name} onChange={(e) => setGuarantor1((g) => ({ ...g, name: e.target.value }))} />
        <TextInput label="Guarantor 1 Phone" placeholder="+234 800 000 0000" value={guarantor1.phone} onChange={(e) => setGuarantor1((g) => ({ ...g, phone: e.target.value }))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Guarantor 2 Name" placeholder="Full name" value={guarantor2.name} onChange={(e) => setGuarantor2((g) => ({ ...g, name: e.target.value }))} />
        <TextInput label="Guarantor 2 Phone" placeholder="+234 800 000 0000" value={guarantor2.phone} onChange={(e) => setGuarantor2((g) => ({ ...g, phone: e.target.value }))} />
      </div>
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
              HandiPlug verifies every artisan with your NIN, a facial verification
              selfie, and 2 guarantors — this is what makes the Verified Badge mean
              something to customers.
            </p>
          </div>
          {DocTypeField()}
          <TextInput label="NIN Number" placeholder="e.g. 12345678901" value={ninNumber} onChange={(e) => setNinNumber(e.target.value)} />
          {UploadZone({})}
          {SelfieZone()}
          {GuarantorFields()}
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          <button onClick={doUpload} disabled={loading} className="h-11 rounded-[10px] bg-[#0F2A44] text-white text-sm font-semibold disabled:opacity-50">
            {loading ? "Uploading..." : "Upload Document"}
          </button>
          {uploaded.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Uploaded documents</Label>
              {uploaded.map((d) => <div key={d.id}>{DocRow({ doc: d })}</div>)}
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
                HandiPlug verifies every artisan with NIN, facial verification, and
                2 guarantors to unlock your Verified badge and start receiving
                bookings from customers.
              </p>
              <div className="border border-[#E5E7EB] rounded-2xl p-4">
                <p className="text-[#1F2937] text-sm font-semibold">What you'll need</p>
                <p className="text-[#6B7280] text-sm mt-1">
                  Your NIN, a valid ID document, a selfie for facial matching, and 2
                  guarantors who can vouch for you.
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {DocTypeField()}
                <TextInput label="NIN Number" placeholder="e.g. 12345678901" value={ninNumber} onChange={(e) => setNinNumber(e.target.value)} />
              </div>
              {UploadZone({tall: true})}
              {SelfieZone()}
              {GuarantorFields()}
              {error && <p className="text-[#EF4444] text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={doUpload} disabled={loading} className="h-11 px-6 rounded-[10px] bg-[#0F2A44] text-white text-sm font-semibold disabled:opacity-50">
                  {loading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
              {uploaded.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Uploaded documents</Label>
                  {uploaded.map((d) => <div key={d.id}>{DocRow({ doc: d })}</div>)}
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
