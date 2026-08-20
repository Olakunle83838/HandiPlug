import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PasswordInput, StatusSpace, TextInput } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";
import { getPostAuthPath } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!identifier.trim()) nextErrors.identifier = "Enter your email address or phone number.";
    if (!password) nextErrors.password = "Enter your password.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setErrors({});
    setLoading(true);
    try {
      const user = await login(identifier, password);
      navigate(location.state?.from?.pathname || getPostAuthPath(user), { replace: true });
    } catch (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        navigate("/otp", { state: { email: error.response?.email || identifier.trim() }, replace: true });
        return;
      }
      setErrors({ form: error.message || "We couldn’t sign you in. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <form className="auth-form" onSubmit={submit} noValidate>
      <TextInput id="login-identifier" name="identifier" plainLabel label="Email or phone number" placeholder="you@example.com" autoComplete="username" value={identifier} error={errors.identifier} onChange={(event) => { setIdentifier(event.target.value); setErrors((current) => ({ ...current, identifier: "", form: "" })); }} />
      <PasswordInput id="login-password" name="password" plainLabel label="Password" placeholder="Enter your password" autoComplete="current-password" value={password} visible={showPassword} error={errors.password} onToggleVisibility={() => setShowPassword((current) => !current)} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: "", form: "" })); }} />
      <div className="auth-form-meta">
        <button type="button" onClick={() => navigate("/forgot-password")} className="auth-link">Forgot password?</button>
      </div>
      {errors.form && <div className="auth-alert" role="alert">{errors.form}</div>}
      <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
      <p className="auth-switch">New to HandiPlug? <button type="button" onClick={() => navigate("/signup")}>Create an account</button></p>
    </form>
  );

  const header = <header className="auth-header"><span className="auth-eyebrow">Welcome back</span><h1>Sign in to HandiPlug</h1><p>Manage bookings, messages and payments in one secure place.</p></header>;

  return (
    <main className="auth-page">
      <div className="md:hidden auth-mobile"><StatusSpace /><section className="auth-mobile-content">{header}{form}</section></div>
      <div className="hidden md:flex md:h-full md:w-full"><AuthSidePanel /><section className="auth-desktop-panel"><div className="auth-card">{header}{form}</div></section></div>
    </main>
  );
}
