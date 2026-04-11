export default function CMSNotification() {
  return (
    <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-bold text-amber-950">
        Thông báo CMS (HTML)
      </h2>
      <div className="border-l-4 border-amber-500 pl-4 text-sm leading-relaxed text-amber-950/90">
        <p>
          <strong>Lưu ý:</strong> Đợt <em>đăng ký học phần tự chọn</em> mở từ{" "}
          <time dateTime="2026-04-10" className="font-semibold text-amber-900">
            10/04/2026
          </time>
          .
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-amber-900/85">
          <li>Ưu tiên sinh viên năm cuối.</li>
          <li>Liên hệ PĐT nếu trùng lịch.</li>
        </ul>
      </div>
    </section>
  );
}
