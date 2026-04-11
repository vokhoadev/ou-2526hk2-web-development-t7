export default function UserForm() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-base font-bold text-slate-900">
        Form thêm / chỉnh sửa (mẫu)
      </h2>
      <form
        action="#"
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Legacy: lưu user");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <label htmlFor="full-name">Họ và tên</label>
            <input
              type="text"
              id="full-name"
              name="fullName"
              autoComplete="name"
              maxLength="80"
              required
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <label htmlFor="email-addr">Email</label>
            <input
              type="email"
              id="email-addr"
              name="email"
              autoComplete="email"
              maxLength="120"
              required
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <label htmlFor="phone">Điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              inputMode="tel"
              maxLength="20"
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <label htmlFor="role-select">Vai trò</label>
            <select
              id="role-select"
              name="role"
              required
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="student">Sinh viên</option>
              <option value="staff">Nhân sự</option>
              <option value="admin">Quản trị</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Tài khoản đang hoạt động
            </label>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <label htmlFor="note">Ghi chú nội bộ</label>
            <textarea
              id="note"
              name="note"
              rows="3"
              maxLength="500"
              placeholder="Thông tin thêm cho CSKH…"
              className="resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700"
          >
            Lưu
          </button>
          <button
            type="reset"
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset form
          </button>
        </div>
      </form>
    </section>
  );
}
