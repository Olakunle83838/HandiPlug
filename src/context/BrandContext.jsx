import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "handiplug_brand_logo";
const DEFAULT_HEIGHT = 40;

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [logoSrc, setLogoSrc] = useState(null); // base64 data URL, or null = use bundled default
  const [logoHeight, setLogoHeight] = useState(DEFAULT_HEIGHT);

  // Load saved logo on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // setLogoSrc(parsed.src || null);
        // setLogoHeight(parsed.height || DEFAULT_HEIGHT);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const persist = (src, height) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ src, height }));
    } catch {
      // storage full/unavailable — logo just won't persist across reloads
    }
  };

  const uploadLogo = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        return reject(new Error("Please upload a PNG or JPG file"));
      }
      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error("File is too large — max 5MB"));
      }
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        setLogoSrc(src);
        persist(src, logoHeight);
        resolve(src);
      };
      reader.onerror = () => reject(new Error("Couldn't read that file"));
      reader.readAsDataURL(file);
    });

  const updateHeight = (h) => {
    setLogoHeight(h);
    persist(logoSrc, h);
  };

  const resetLogo = () => {
    setLogoSrc(null);
    setLogoHeight(DEFAULT_HEIGHT);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BrandContext.Provider value={{ logoSrc, logoHeight, uploadLogo, updateHeight, resetLogo }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within a BrandProvider");
  return ctx;
}
