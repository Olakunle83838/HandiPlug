import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, TextInput } from "../components/UI";

import { PendingBadge } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB, matches the kyc-documents bucket limit
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export default function ArtisanKyc() {
  const navigate = useNavigate();
  const { token, isAuthed } = useAuth();
  const fileRef = useRef(null);
  const selfieRef = useRef(null);
  const [docType, setDocType] = useState("National ID (NIN)");
  const [ninNumber, setNinNumber] = useState("");
  const [file, setFile] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [guarantor1Phone, setGuarantor1Phone] = useState("");
  const [guarantor2Phone, setGuarantor2Phone] = useState("");
  const [uploaded, setUploaded] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only PNG, JPG or PDF files are allowed.");
      return false;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError("File is too large. Max size is 5MB.");
      return false;
    }
    return true;
  };

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    if (validateFile(f)) setFile(f);
  };
  const handleSelfiePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    if (validateFile(f)) setSelfie(f);
  };

  // Gets a signed upload URL from our backend (which enforces our own
  // custom auth), then uploads the file directly to Supabase Storage
  // using that URL. The file never passes through our server.
  const uploadToSupabase = async (f, kind) => {
    const { path, signedUrl, token: uploadToken } = await api.getKycUploadUrl(
      { fileName: f.name, fileType: f.type, kind },
      token
    );

    const { error: uploadError } = await supabase.storage
      .from("kyc-documents")
      .uploadToSignedUrl(path, uploadToken, f, { contentType: f.type });

    if (uploadError) {
      throw new Error(`Failed to upload ${kind}: ${uploadError.message}`);
    }

    return path;
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
    if (!guarantor1Phone || !guarantor2Phone) {
      setError("HandiPlug requires 2 guarantors — please fill in both phone numbers.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload files directly to Supabase Storage (browser -> Supabase,
      //    no detour through our server, so no 4.5MB Vercel body limit).
      const documentPath = await uploadToSupabase(file, "document");
      const selfiePath = selfie ? await uploadToSupabase(selfie, "selfie") : null;

      // 2. Send only the small JSON payload (paths + guarantor info) to
      //    our backend, which just records the submission.
      const res = await api.submitKyc(
        {
          documentType: docType,
          documentPath,
          documentOriginalName: file.name,
          ninNumber,
          selfiePath,
          guarantor1Name: "Not collected",
          guarantor1Phone,
          guarantor2Name: "Not collected",
          guarantor2Phone,
        },
        token
      );

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
      <TextInput label="Guarantor 1 — phone number" placeholder="080X XXX XXXX" value={guarantor1Phone} onChange={(e) => setGuarantor1Phone(e.target.value)} />
      <TextInput label="Guarantor 2 — phone number" placeholder="080X XXX XXXX" value={guarantor2Phone} onChange={(e) => setGuarantor2Phone(e.target.value)} />
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
            <h1 className="text-[#1F2937] text-2xl font-bold">Get verified</h1>
          </div>
          <div className="bg-[#EEF2FF] rounded-2xl p-4 flex gap-2.5">
            <span className="text-[#1C4CD1] shrink-0">🛡️</span>
            <p className="text-[#1C4CD1] text-sm leading-5">
              Verified artisans get 3x more bookings. Verification takes NIN, a
              valid ID, a quick facial scan, and 2 guarantors.
            </p>
          </div>
          {DocTypeField()}
          <TextInput label="NIN Number" placeholder="e.g. 12345678901" value={ninNumber} onChange={(e) => setNinNumber(e.target.value)} />
          {UploadZone({})}
          {SelfieZone()}
          {GuarantorFields()}
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          {uploaded.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Uploaded documents</Label>
              {uploaded.map((d) => <div key={d.id}>{DocRow({ doc: d })}</div>)}
            </div>
          )}
        </div>
        <div className="p-6">
          {uploaded.length > 0 ? (
            <Button onClick={() => navigate("/artisan/dashboard")}>Continue to Dashboard</Button>
          ) : (
            <Button onClick={doUpload} disabled={loading}>
              {loading ? "Submitting..." : "🛡️ Submit for Review"}
            </Button>
          )}
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
              <h1 className="text-[#1F2937] text-2xl font-bold">Get verified</h1>
              <p className="text-[#6B7280] text-sm -mt-3">Verified artisans get 3x more bookings.</p>
              <div className="bg-[#EEF2FF] rounded-2xl p-4 flex gap-2.5">
                <span className="text-[#1C4CD1] shrink-0">🛡️</span>
                <p className="text-[#1C4CD1] text-sm leading-5">
                  Verification requires your NIN, a valid ID, a quick facial scan,
                  and 2 guarantors.
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
              {uploaded.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Uploaded documents</Label>
                  {uploaded.map((d) => <div key={d.id}>{DocRow({ doc: d })}</div>)}
                </div>
              )}
              {uploaded.length > 0 ? (
                <Button className="max-w-[280px]" onClick={() => navigate("/artisan/dashboard")}>
                  Continue to Dashboard
                </Button>
              ) : (
                <Button className="max-w-[280px]" onClick={doUpload} disabled={loading}>
                  {loading ? "Submitting..." : "🛡️ Submit for Review"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}