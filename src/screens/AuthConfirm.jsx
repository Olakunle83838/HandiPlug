import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, StatusSpace } from "../components/UI";

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleMagicLink } = useAuth();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMsg, setErrorMsg] = useState("");
  
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") || "email";

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);

    const verify = async () => {
      if (!tokenHash) {
        setStatus("error");
        setErrorMsg("This verification link is incomplete or invalid.");
        return;
      }

      try {
        const user = await handleMagicLink(tokenHash, type);
        setStatus("success");
        // Route according to role
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "artisan") navigate("/artisan/dashboard");
        else navigate("/home");
      } catch (err) {
        setStatus("error");
        // Friendly errors based on backend responses
        if (err.message.includes("Account not found")) {
          setErrorMsg("We verified the email, but couldn't find your account. Please contact support or sign up again.");
        } else if (err.message.includes("Invalid or expired") || err.message.includes("Unsupported verification type") || err.message.includes("Invalid verification link")) {
          setErrorMsg("This verification link is invalid or has expired. Please request a new link.");
        } else {
          setErrorMsg("We couldn't verify your email right now. Please try again.");
        }
      }
    };

    verify();
  }, [searchParams, navigate, handleMagicLink]);

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 flex flex-col justify-center items-center px-6 gap-6 text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Verifying your email...</h1>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Verification Failed</h1>
            <p className="text-[#6B7280]">{errorMsg}</p>
            <div className="w-full mt-4">
              <Button onClick={() => navigate("/login")}>Return to Login</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
