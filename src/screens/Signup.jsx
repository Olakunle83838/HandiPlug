import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PasswordInput, StatusSpace, TextInput, TogglePill } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("I need a service");
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", homeAddress: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const validate = () => {
    const next = {};
    if (values.fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!emailPattern.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (values.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a valid phone number.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setErrors({});
    setLoading(true);
    try {
      const isArtisan = role === "I offer a service";
      const result = await register({
        fullName: values.fullName.trim(), email: values.email.trim().toLowerCase(), phone: values.phone.trim(),
        password: values.password, address: values.homeAddress.trim(), role: isArtisan ? "artisan" : "customer",
      });
      navigate(`/otp?role=${isArtisan ? "artisan" : "customer"}`, { state: { email: result.email || values.email.trim().toLowerCase() } });
    } catch (error) {
      const field = error.code === "EMAIL_EXISTS" ? "email" : error.code === "PHONE_EXISTS" ? "phone" : "form";
      setErrors({ [field]: error.message || "We couldn’t create your account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <form className="auth-form auth-form--compact" onSubmit={submit} noValidate>
      <fieldset className="auth-role-fieldset"><legend>I want to</legend><TogglePill variant="chip" options={["I need a service", "I offer a service"]} active={role} onChange={setRole} /></fieldset>
      <div className="auth-field-grid">
        <TextInput id="signup-name" name="fullName" plainLabel label="Full name" placeholder="e.g. Tolu Adeyemi" autoComplete="name" value={values.fullName} error={errors.fullName} onChange={update("fullName")} />
        <TextInput id="signup-email" name="email" plainLabel label="Email address" placeholder="you@example.com" type="email" autoComplete="email" value={values.email} error={errors.email} onChange={update("email")} />
        <TextInput id="signup-phone" name="phone" plainLabel label="Phone number" placeholder="0803 123 4567" type="tel" autoComplete="tel" value={values.phone} error={errors.phone} onChange={update("phone")} />
        <TextInput id="signup-address" name="homeAddress" plainLabel label="Home address (optional)" placeholder="Your area in Lagos" autoComplete="street-address" value={values.homeAddress} onChange={update("homeAddress")} />
      </div>
      <PasswordInput id="signup-password" name="password" plainLabel label="Create password" placeholder="At least 8 characters" autoComplete="new-password" value={values.password} visible={showPassword} error={errors.password} hint="Use 8 or more characters." onToggleVisibility={() => setShowPassword((current) => !current)} onChange={update("password")} />
      {errors.form && <div className="auth-alert" role="alert">{errors.form}</div>}
      <p className="auth-terms">By continuing, you agree to HandiPlug’s Terms of Service and Privacy Policy.</p>
      <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Creating your account…" : "Create account"}</Button>
      <p className="auth-switch">Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign in</button></p>
    </form>
  );

  const header = <header className="auth-header"><span className="auth-eyebrow">Get started</span><h1>Create your account</h1><p>Book trusted professionals or grow your service business.</p></header>;

  return (
    <main className="auth-page">
      <div className="md:hidden auth-mobile auth-mobile--scroll"><StatusSpace /><section className="auth-mobile-content">{header}{form}</section></div>
      <div className="hidden md:flex md:h-full md:w-full"><AuthSidePanel /><section className="auth-desktop-panel auth-desktop-panel--scroll"><div className="auth-card auth-card--wide">{header}{form}</div></section></div>
    </main>
  );
}
