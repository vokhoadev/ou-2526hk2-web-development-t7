export default function Breadcrumbs() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Quản lý người dùng
      </h1>
      <nav
        className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label="Breadcrumb"
      >
        <span>Trang chủ</span>
        <span className="text-slate-300">/</span>
        <span>Hệ thống</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-brand-600">Người dùng</span>
      </nav>
    </div>
  );
}
