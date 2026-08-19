import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Button } from "../components/UI";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function ArtisanPortfolioUpload() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(f => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    
    if (valid.length !== selected.length) {
      alert("Only JPEG, PNG, and WebP are allowed.");
    }
    
    const newFiles = [...files, ...valid].slice(0, 5); // max 5
    setFiles(newFiles);
    
    // Generate previews
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (!files.length) {
      // Just continue if they don't want to upload anything
      return navigate("/artisan/kyc");
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("images", f));
      await api.uploadPortfolio(formData, token);
      navigate("/artisan/kyc");
    } catch (err) {
      alert(err.message || "Failed to upload portfolio");
    } finally {
      setUploading(false);
    }
  };

  const UploadZone = ({ tall = false }) => (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed border-[#E5E7EB] rounded-2xl w-full flex flex-col items-center justify-center gap-3 text-center px-6 cursor-pointer hover:bg-[#F9FAFB] transition-colors ${tall ? "h-[320px]" : "h-[270px]"}`}
    >
      <span className="text-4xl">🖼️</span>
      <span className="text-[#1F2937] text-sm font-semibold">Upload your image in PNG, JPEG, WebP</span>
      <span className="bg-[#1C4CD1] text-white text-sm font-semibold rounded-[10px] px-5 py-2">Select files</span>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <input 
        type="file" 
        multiple 
        accept="image/jpeg,image/png,image/webp" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col px-6 pt-4 gap-5 pb-6">
          <h1 className="text-[#1F2937] text-2xl font-bold">Upload your portfolio photos</h1>
          <p className="text-[#6B7280] text-sm -mt-3">Show off your best work — customers trust artisans with photos. (Max 5)</p>
          
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB]">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-2 right-2 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-red-500 text-sm shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#9CA3AF] cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-2xl">+</span>
                </div>
              )}
            </div>
          ) : (
            UploadZone({})
          )}
          
        </div>
        <div className="p-6 pt-2">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : files.length > 0 ? "Upload & Continue" : "Skip for now"}
          </Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-10 flex justify-center">
          <div className="w-full max-w-[640px] flex flex-col gap-6">
            <h1 className="text-[#1F2937] text-2xl font-bold">Upload your portfolio photos</h1>
            <p className="text-[#6B7280] text-sm -mt-3">Show off your best work — customers trust artisans with photos. (Max 5)</p>
            
            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative h-[200px] rounded-xl overflow-hidden border border-[#E5E7EB]">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-red-500 shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#9CA3AF] cursor-pointer hover:bg-gray-50 flex-col gap-2"
                  >
                    <span className="text-3xl">+</span>
                    <span className="text-sm font-medium">Add another</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {UploadZone({tall: true})}
                <div className="hidden sm:block">
                  {UploadZone({tall: true})}
                </div>
              </div>
            )}
            
            <Button className="max-w-[220px]" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : files.length > 0 ? "Upload & Continue" : "Skip for now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
