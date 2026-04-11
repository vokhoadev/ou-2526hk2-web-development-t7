import React from "react";

/** Dữ liệu & markup khớp `user-admin-portal-raw.html` */
export default function UserTable({ onAddUser }) {
  const users = [
    {
      id: "u-1001",
      name: "Nguyễn Văn An",
      subtitle: "MSSV: 22730001",
      email: "an.nv@student.ou.edu.vn",
      phone: "0901 000 001",
      role: "Sinh viên",
      status: "Hoạt động",
      note: "Đăng ký khóa PTHTW — nhóm sáng. Cập nhật lần cuối: 2026-03-28.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
      roleColor: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
      statusColor: "bg-green-50 text-green-800 ring-green-600/15",
      mainRowClass: "bg-white transition hover:bg-slate-50/80",
      actions: "view-edit",
    },
    {
      id: "u-2040",
      name: "Trần Thị Chi",
      subtitle: "Mã NV: GV-042",
      email: "chi.tt@ou.edu.vn",
      phone: "028 1234 567",
      role: "Nhân sự",
      status: "Hoạt động",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chi",
      roleColor: "bg-sky-50 text-sky-800 ring-sky-600/15",
      statusColor: "bg-green-50 text-green-800 ring-green-600/15",
      mainRowClass: "transition hover:bg-slate-50/80",
      actions: "view-lock",
    },
    {
      id: "u-0001",
      name: "Hệ thống",
      subtitle: "Tài khoản nội bộ",
      email: "root@ou.edu.vn",
      phone: null,
      role: "Quản trị",
      status: "Đã khóa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      roleColor: "bg-violet-50 text-violet-800 ring-violet-600/15",
      statusColor: "bg-red-50 text-red-800 ring-red-600/15",
      mainRowClass: "transition hover:bg-slate-50/80",
      actions: "disabled-only",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">Danh sách</h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700"
          onClick={onAddUser}
        >
          <span className="text-lg leading-none">+</span> Thêm người dùng
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th
                colSpan={2}
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6"
              >
                Người dùng
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Liên hệ
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Vai trò
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Trạng thái
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className={user.mainRowClass}>
                  <td
                    rowSpan={user.note ? 2 : 1}
                    className="w-14 align-top px-4 py-4 sm:px-6"
                  >
                    <img
                      className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-slate-100"
                      src={user.avatar}
                      alt=""
                    />
                  </td>
                  <td className="px-2 py-4 pr-4 sm:pr-6">
                    <strong className="text-slate-900">{user.name}</strong>
                    <br />
                    <span className="text-xs text-slate-500">
                      {user.subtitle}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 sm:px-6">
                    {user.email}
                    {user.phone ? (
                      <>
                        <br />
                        <span className="text-xs text-slate-500">
                          {user.phone}
                        </span>
                      </>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${user.roleColor}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${user.statusColor}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    {user.actions === "disabled-only" ? (
                      <button
                        type="button"
                        className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400"
                        disabled
                      >
                        Không thể xóa
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          onClick={() => alert(`Xem ${user.id}`)}
                        >
                          Xem
                        </button>
                        {user.actions === "view-edit" ? (
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={() => alert(`Sửa ${user.id}`)}
                          >
                            Sửa
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                            onClick={() => alert(`Khóa ${user.id}`)}
                          >
                            Khóa
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                {user.note && (
                  <tr className="bg-slate-50/50">
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-xs leading-relaxed text-slate-600 sm:px-6 sm:text-sm"
                    >
                      <span className="font-medium text-slate-700">
                        Ghi chú:
                      </span>{" "}
                      {user.note}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6"
        role="navigation"
        aria-label="Phân trang"
      >
        <span className="mr-2 text-sm text-slate-500">Trang</span>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          onClick={() => alert("Prev")}
        >
          &laquo;
        </button>
        <button
          type="button"
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm"
        >
          1
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          onClick={() => alert("2")}
        >
          2
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          onClick={() => alert("3")}
        >
          3
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          onClick={() => alert("Next")}
        >
          &raquo;
        </button>
      </div>
    </section>
  );
}
