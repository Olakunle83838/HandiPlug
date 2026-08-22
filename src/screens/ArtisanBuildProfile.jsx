import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, Avatar, TextInput } from "../components/UI";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

const TRADE_OPTIONS = [
  { icon: "🔨", label: "Carpenter" },
  { icon: "🔧", label: "Plumber" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🎨", label: "Painter" },
  { icon: "🧱", label: "Mason" },
  { icon: "❄️", label: "AC Technician" },
  { icon: "🚗", label: "Mechanic" },
  { icon: "🧹", label: "Cleaner" },
  { icon: "🪚", label: "Welder" },
  { icon: "🛠️", label: "Other" },
];

const EXPERIENCE_OPTIONS = [
  { icon: "📈", label: "Less than 1 year", years: 0 },
  { icon: "📈", label: "1 year", years: 1 },
  { icon: "📈", label: "2 years", years: 2 },
  { icon: "📈", label: "3 years", years: 3 },
  { icon: "📈", label: "4 years", years: 4 },
  { icon: "📈", label: "5 years", years: 5 },
  { icon: "📈", label: "6 years", years: 6 },
  { icon: "📈", label: "7 years", years: 7 },
  { icon: "📈", label: "8-10 years", years: 9 },
  { icon: "📈", label: "10+ years", years: 10 },
];

// Custom dropdown: icon + label travel together as one unit, both in the
// closed field and in the option list — no native <select> quirks.
function Dropdown({ label, options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px] bg-white"
        >
          <span className="flex items-center gap-2 text-[#1F2937] text-[16px]">
            <span>{selected.icon}</span>
            {selected.label}
          </span>
          <span className={`text-[#9CA3AF] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full max-h-[240px] overflow-y-auto bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg">
            {options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  onSelect(o);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left px-[17px] py-3 text-[16px] hover:bg-[#F9FAFB] ${
                  o.label === selected.label ? "text-[#FF7A00] font-medium" : "text-[#1F2937]"
                }`}
              >
                <span>{o.icon}</span>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtisanBuildProfile() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [trade, setTrade] = useState(TRADE_OPTIONS[0]);
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[6]);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("8000");

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please choose a file under 5MB.");
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    setError("");
    setSaving(true);

    try {
      // Upload the photo first (if a new one was chosen) — directly to
      // Supabase Storage via a signed URL, bypassing our server entirely.
      if (photoFile) {
        const { path, signedUrl, token: uploadToken } = await api.getAvatarUploadUrl(
          { fileName: photoFile.name, fileType: photoFile.type },
          token
        );

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .uploadToSignedUrl(path, uploadToken, photoFile, { contentType: photoFile.type });

        if (uploadError) {
          throw new Error(`Failed to upload photo: ${uploadError.message}`);
        }

        await api.confirmAvatarUpload({ path }, token);
      }

      // Save trade, experience, bio, and hourly rate
      await api.updateProfile(
        {
          trade: trade.label,
          yearsExperience: experience.years,
          bio,
          hourlyRate: Number(hourlyRate) || 0,
        },
        token
      );

      navigate("/artisan/portfolio");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err?.message || "Failed to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const ProfilePhoto = ({ size = 110 }) => (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
      {photoPreview ? (
        <img
          src={photoPreview}
          alt="Profile"
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      ) : (
        <Avatar size={size} />
      )}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 size-8 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-lg border-2 border-white"
      >
        +
      </button>
    </div>
  );

  const Bio = () => (
    <div className="flex flex-col gap-2">
      <Label>Bio</Label>
      <textarea
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell customers about your craft, style and experience"
        className="border border-[#E5E7EB] rounded-[10px] p-4 text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none"
      />
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center justify-between px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <button onClick={() => navigate("/artisan/portfolio")} className="text-[#6B7280] text-sm font-medium">Skip</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Build your profile</h1>
          <div className="flex flex-col items-center gap-2 py-2">
            <ProfilePhoto />
          </div>

          <Dropdown
            label="Wetin be your trade?"
            options={TRADE_OPTIONS}
            selected={trade}
            onSelect={setTrade}
          />
          <Dropdown
            label="Years of Experience"
            options={EXPERIENCE_OPTIONS}
            selected={experience}
            onSelect={setExperience}
          />

          {Bio()}

          <TextInput
            label="Hourly Rate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />

          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
        </div>
        <div className="p-6">
          <Button onClick={handleNext} disabled={saving}>
            {saving ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-10 flex justify-center">
          <div className="w-full max-w-[560px] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[#1F2937] text-2xl font-bold">Build your profile</h1>
              <button onClick={() => navigate("/artisan/portfolio")} className="text-[#6B7280] text-sm font-medium">Skip</button>
            </div>
            <div className="flex justify-center">
              <ProfilePhoto />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="Wetin be your trade?"
                options={TRADE_OPTIONS}
                selected={trade}
                onSelect={setTrade}
              />
              <Dropdown
                label="Years of Experience"
                options={EXPERIENCE_OPTIONS}
                selected={experience}
                onSelect={setExperience}
              />
            </div>

            {Bio()}

            <TextInput
              label="Hourly Rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />

            {error && <p className="text-[#EF4444] text-sm">{error}</p>}

            <Button onClick={handleNext} disabled={saving}>
              {saving ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}