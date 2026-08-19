const fs = require('fs');

// AuthContext.jsx
let authCtx = fs.readFileSync('src/context/AuthContext.jsx', 'utf8');
authCtx = authCtx.replace('const cachedUser =', '// const cachedUser =');
fs.writeFileSync('src/context/AuthContext.jsx', authCtx);

// BrandContext.jsx
let brandCtx = fs.readFileSync('src/context/BrandContext.jsx', 'utf8');
brandCtx = brandCtx.replace('setLogoSrc(parsed.src || null);', '// setLogoSrc(parsed.src || null);');
brandCtx = brandCtx.replace('setLogoHeight(parsed.height || DEFAULT_HEIGHT);', '// setLogoHeight(parsed.height || DEFAULT_HEIGHT);');
fs.writeFileSync('src/context/BrandContext.jsx', brandCtx);

// api.js
let apiJs = fs.readFileSync('src/lib/api.js', 'utf8');
apiJs = apiJs.replace('const data = await res.json().catch(() => ({}));', 'const data = await res.json().catch((_) => ({}));');
fs.writeFileSync('src/lib/api.js', apiJs);

// useArtisans.js
let useArtisans = fs.readFileSync('src/lib/useArtisans.js', 'utf8');
useArtisans = useArtisans.replace('setLoading(true);', '// setLoading(true);');
fs.writeFileSync('src/lib/useArtisans.js', useArtisans);

// AdminModeration.jsx
let adminMod = fs.readFileSync('src/screens/AdminModeration.jsx', 'utf8');
adminMod = adminMod.replace('}, [isAuthed, token]);', '}, [isAuthed, token, user?.role]);');
fs.writeFileSync('src/screens/AdminModeration.jsx', adminMod);

// ArtisanDashboard.jsx
let artisanDash = fs.readFileSync('src/screens/ArtisanDashboard.jsx', 'utf8');
artisanDash = artisanDash.replace('import { StatusSpace, VerifiedBadge, Stars } from "../components/UI";', 'import { StatusSpace, Stars } from "../components/UI";');
fs.writeFileSync('src/screens/ArtisanDashboard.jsx', artisanDash);

// ArtisanKyc.jsx
let kyc = fs.readFileSync('src/screens/ArtisanKyc.jsx', 'utf8');
kyc = kyc.replace('import TopNav from "../components/TopNav";', '');
fs.writeFileSync('src/screens/ArtisanKyc.jsx', kyc);

// ArtisanProfile.jsx
let artisanProf = fs.readFileSync('src/screens/ArtisanProfile.jsx', 'utf8');
artisanProf = artisanProf.replace('import { StatusSpace, Button, Avatar, VerifiedBadge, Stars } from "../components/UI";', 'import { StatusSpace, Button, VerifiedBadge, Stars } from "../components/UI";');
fs.writeFileSync('src/screens/ArtisanProfile.jsx', artisanProf);

// BookingConfirmation.jsx
let bookingConf = fs.readFileSync('src/screens/BookingConfirmation.jsx', 'utf8');
bookingConf = bookingConf.replace('import { StatusSpace, Button } from "../components/UI";', 'import { StatusSpace } from "../components/UI";');
fs.writeFileSync('src/screens/BookingConfirmation.jsx', bookingConf);

// Home.jsx
let home = fs.readFileSync('src/screens/Home.jsx', 'utf8');
home = home.replace('import { ArtisanCardDesktop } from "../components/DesktopExtras";', '');
fs.writeFileSync('src/screens/Home.jsx', home);

// OtpVerification.jsx
let otp = fs.readFileSync('src/screens/OtpVerification.jsx', 'utf8');
otp = otp.replace('const { role } = location.state || {};', 'const { } = location.state || {};');
fs.writeFileSync('src/screens/OtpVerification.jsx', otp);

