import { useState, useEffect } from "react";

export default function AppHeader() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("vi-VN", { hour12: false }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          {/* SVG: trong JSX cần camelCase thuộc tính (ví dụ viewBox, strokeWidth) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 shadow-md shadow-brand-500/25">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 22V10h4l4 7 4-7h4v12h-3.5v-7.2L15 22l-3.5-7.2V22H8z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              OU Console
            </span>
            <p className="text-xs font-medium text-slate-500">
              Hệ thống quản trị
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span
            id="clock-display"
            className="tabular-nums rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-800"
          >
            {time}
          </span>
          <span className="hidden sm:inline">
            Admin:{" "}
            <strong className="text-slate-900">admin@ou.edu.vn</strong>
          </span>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => alert("Legacy: đăng xuất")}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}