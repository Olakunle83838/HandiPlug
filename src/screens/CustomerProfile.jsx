import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, TextInput, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";

const ROWS = ["My Bookings", "Saved Artisans", "Reviews I've Left", "Settings"];

export default function CustomerProfile() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 pt-4">
            <h1 className="text-[#1F2937] text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex flex-col items-center gap-2 pt-6 pb-2">
            <Avatar size={80} />
            <p className="text-[#1F2937] text-lg font-semibold mt-2">Chukwudi Divine</p>
            <p className="text-[#6B7280] text-sm">Customer</p>
          </div>
          <div className="px-6 pt-4">
            {ROWS.map((row) => (
              <button
                key={row}
                onClick={() => row === "My Bookings" && navigate("/bookings")}
                className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left"
              >
                <span className="text-[#1F2937] text-base">{row}</span>
                <span className="text-[#9CA3AF] text-lg">›</span>
              </button>
            ))}
            <button onClick={() => navigate("/login")} className="w-full text-left py-4 text-[#EF4444] text-base font-medium">
              Logout
            </button>
          </div>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="SETTINGS"
            links={[
              { label: "Profile" },
              { label: "Security" },
              { label: "Notifications", path: "/notifications" },
              { label: "Saved Artisans" },
              { label: "Logout", onClick: () => navigate("/login") },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-8">
            <div className="max-w-[720px] flex flex-col gap-6">
              <h1 className="text-[#1F2937] text-2xl font-bold">Profile Information</h1>
              <Avatar size={80} />
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Full Name" defaultValue="Chukwudi Divine" />
                <TextInput label="Email" defaultValue="chukwudi@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Phone" defaultValue="+234 800 000 0000" />
                <TextInput label="Location" defaultValue="Lekki, Lagos" />
              </div>
              <Button className="max-w-[200px]">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
