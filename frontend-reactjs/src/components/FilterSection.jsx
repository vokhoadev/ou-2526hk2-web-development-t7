export default function FilterSection() {
  return (
    <section
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="filter-heading"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <h2
          id="filter-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Bộ lọc &amp; tìm kiếm
        </h2>
      </div>
      <form
        className="mb-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Legacy submit");
        }}
      >
        <div className="flex min-w-[200px] flex-1 flex-col gap-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="search-q">Từ khóa</label>
          <input
            type="search"
            id="search-q"
            name="q"
            placeholder="Họ tên, email, MSSV…"
            maxLength="120"
            tabIndex={1}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex min-w-[160px] flex-col gap-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="filter-role">Vai trò</label>
          <select
            id="filter-role"
            name="role"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Tất cả</option>
            <option value="admin">Quản trị</option>
            <option value="staff">Giảng viên / NV</option>
            <option value="student">Sinh viên</option>
          </select>
        </div>
        <div className="flex min-w-[160px] flex-col gap-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="filter-status">Trạng thái</label>
          <select
            id="filter-status"
            name="status"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700"
        >
          Áp dụng
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={() => (document.getElementById("search-q").value = "")}
        >
          Xóa từ khóa
        </button>
      </form>
      <p className="text-sm text-slate-500">
        <span id="result-count">
          Đang hiển thị <span className="font-semibold text-slate-800">4</span> /{" "}
          <span className="tabular-nums">124</span> người dùng (trang 1)
        </span>
      </p>
    </section>
  );
}
