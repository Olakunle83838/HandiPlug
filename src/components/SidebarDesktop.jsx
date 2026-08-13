import { useNavigate, useLocation } from "react-router-dom";

/**
 * Desktop-only left sidebar (hidden on mobile). Used for Admin, Settings,
 * and Search-filter contexts.
 * links: [{ label, path? , onClick? }]
 */
export default function SidebarDesktop({ title, links, sections }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const renderLink = (link) => {
    const active = link.path && pathname === link.path;
    return (
      <button
        key={link.label}
        onClick={() => (link.onClick ? link.onClick() : link.path && navigate(link.path))}
        className={`w-full text-left h-[41px] px-3.5 rounded-[10px] text-sm font-medium transition ${
          active ? "bg-[#0F2A44] text-white" : "text-[#1F2937] hover:bg-[#F5F6F8]"
        }`}
      >
        {link.label}
      </button>
    );
  };

  return (
    <div className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-[#E5E7EB] py-7 px-3 gap-1">
      {title && (
        <p className="px-3.5 pb-2 text-[#6B7280] text-xs font-bold tracking-[0.2px]">{title}</p>
      )}
      {links && links.map(renderLink)}
      {sections &&
        sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1 mt-3 first:mt-0">
            <p className="px-3.5 pb-1 text-[#6B7280] text-xs font-semibold">{section.title}</p>
            {section.content}
          </div>
        ))}
    </div>
  );
}
