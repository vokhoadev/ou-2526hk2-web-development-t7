import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { to: "/dashboard", label: "Tổng quan" },
    { to: "/users", label: "Người dùng" },
    { to: "/courses", label: "Khóa học" },
    { to: "/settings", label: "Cài đặt" },
  ];

  return (
    <aside className="hidden border-r border-slate-200/80 bg-slate-900 text-slate-300 lg:block">
      <div className="sticky top-[57px] flex flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-white/10 font-semibold text-white shadow-inner"
                    : "font-medium hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}