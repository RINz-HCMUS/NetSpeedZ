# Hướng dẫn Đóng góp (Contributing Guidelines)

Cảm ơn bạn đã quan tâm đến việc đóng góp cho **NetSpeedZ**!

## 1. Báo cáo lỗi (Issue Tracker)
- Trước khi tạo issue mới, vui lòng kiểm tra danh sách issue hiện có để tránh trùng lặp.
- Cung cấp thông tin chi tiết: phiên bản trình duyệt, hệ điều hành, nhà mạng (ISP) và các bước tái hiện lỗi.

## 2. Quy chuẩn viết mã (Code Style)
- Sử dụng **TypeScript** với định kiểu dữ liệu rõ ràng, không sử dụng `any`.
- Tuân thủ quy tắc linter: chạy `npm run lint` trước khi commit.
- Sử dụng **Tailwind CSS** cho việc tạo kiểu giao diện.

## 3. Quy chuẩn Commit (Conventional Commits)
Thông điệp commit phải tuân thủ định dạng chuẩn:
- `feat(...)`: Thêm tính năng mới
- `fix(...)`: Sửa lỗi
- `docs(...)`: Cập nhật tài liệu
- `perf(...)`: Cải thiện hiệu năng đo đạc hoặc hiển thị
- `refactor(...)`: Tái cấu trúc mã nguồn

Ví dụ:
```bash
git commit -m "feat(telemetry): add bufferbloat grading curve"
```

## 4. Quy trình Pull Request
1. Fork dự án và tạo nhánh mới từ nhánh `main`.
2. Đảm bảo lệnh `npm run lint` và `npm run build` hoàn thành không có cảnh báo hoặc lỗi.
3. Tạo Pull Request với mô tả ngắn gọn, rõ ràng về mục đích của thay đổi.
